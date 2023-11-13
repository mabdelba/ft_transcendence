import { ForbiddenException, Injectable } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private prismaservice: PrismaService) {}
  async addDescriptionToChannel(login: string, dto: { channelName: string; description: string }) {
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: login });
    if (isOwner) {
      await this.prismaservice.channel.update({
        where: {
          name: dto.channelName,
        },
        data: {
          description: dto.description,
        },
      });
    } else throw new ForbiddenException('You are not owner of this channel');
  }
  async listFriendsForChannel(dto: { channelName: string; user: string }) {
    const user = await this.prismaservice.user.findUnique({
      where: {
        login: dto.user,
      },
      include: {
        friends: true,
      },
    });
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: dto.channelName,
      },
      include: {
        members: true,
        owner: true,
        admins: true,
      },
    });
    const channelUsers = [...channel.members, channel.owner, ...channel.admins];
    const friendsNotInChannel = user.friends.filter((friend) => {
      return !channelUsers.some((member) => member.login === friend.login);
    });
    return friendsNotInChannel;
  }

  async checkIfAdmin(dto: { channelName: string; user: string }) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: dto.channelName,
      },
      include: {
        admins: true,
      },
    });
    if (channel.admins.find((admin) => admin.login == dto.user)) return true;
    return false;
  }

  async checkIfOwner(dto: { channelName: string; user: string }) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: dto.channelName,
      },
      include: {
        owner: true,
      },
    });
    if (channel.owner.login == dto.user) return true;
    return false;
  }

  async addNewChannel(
    login: string,
    dto: { channelName: string; type: number; password?: string },
  ) {
    if (dto.type == 0) dto.password = null;
    await this.prismaservice.channel.create({
      data: {
        name: dto.channelName,
        password: dto.password,
        type: dto.type,
        owner: {
          connect: {
            login: login,
          },
        },
      },
    });
  }

  async checkTypeOfChannel(dto: { channelName: string }) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: dto.channelName,
      },
    });
    return channel.type;
  }

  async getChannelPassword(dto: { channelName: string }) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: dto.channelName,
      },
    });
    return channel.password;
  }

  async getBannedUsers(channelName: string) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: channelName,
      },
      include: {
        banned: true,
      },
    });
    return channel.banned;
  }

  async addNewUserToChannel(
    login: string,
    dto: { channelName: string; user: string; password?: string },
  ) {
    const channelType = await this.checkTypeOfChannel(dto);
    if (channelType == 2) {
      const checkIfAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: login });
      const checkIfOwner = await this.checkIfOwner({ channelName: dto.channelName, user: login });
      if (!checkIfAdmin && !checkIfOwner) {
        throw new ForbiddenException('You are not admin or owner of this channel');
      }
    } else if (channelType == 1) {
      if ((await this.getChannelPassword(dto)) != dto.password) {
        throw new ForbiddenException('Wrong password');
      }
    }
    const isBanned = await this.getBannedUsers(dto.channelName);
    if (isBanned.find((ban) => ban.login == dto.user))
      throw new ForbiddenException('You are banned in this channel');
    await this.prismaservice.channel.update({
      where: {
        name: dto.channelName,
      },
      data: {
        members: {
          connect: {
            login: dto.user,
          },
        },
      },
    });
  }

  async checkIfMember(channelName: string, login: string) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: channelName,
      },
      include: {
        members: true,
      },
    });
    if (channel.members.find((member) => member.login == login)) return true;
    return false;
  }
  /// use in channel gateway
  async removeUserFromChannel(dto: { channelName: string; myLogin: string; otherLogin: string }) {
    const isAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: dto.myLogin });
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: dto.myLogin });
    const isOtherAdmin = await this.checkIfAdmin({
      channelName: dto.channelName,
      user: dto.otherLogin,
    });
    const isOtherMember = await this.checkIfMember(dto.channelName, dto.otherLogin);
    if (isOtherAdmin) {
      if (isOwner) {
        await this.prismaservice.channel.update({
          where: {
            name: dto.channelName,
          },
          data: {
            admins: {
              disconnect: {
                login: dto.otherLogin,
              },
            },
          },
        });
      } else
        throw new ForbiddenException(
          'You are not owner of this channel and you want to remove admin',
        );
    } else if (isOtherMember) {
      if (isAdmin || isOwner) {
        await this.prismaservice.channel.update({
          where: {
            name: dto.channelName,
          },
          data: {
            members: {
              disconnect: {
                login: dto.otherLogin,
              },
            },
          },
        });
        await this.prismaservice.userMutedInChannel.deleteMany({
          where: {
            user: {
              login: dto.otherLogin,
            },
            channel: {
              name: dto.channelName,
            },
          },
        });
      } else throw new ForbiddenException('You are not admin or owner of this channel');
    }
  }

  //use in channel gateway
  async muteUserInChannel(dto: { channelName: string; myLogin: string; otherLogin: string }) {
    const isAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: dto.myLogin });
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: dto.myLogin });
    if (isAdmin || isOwner) {
      await this.prismaservice.userMutedInChannel.create({
        data: {
          dateEnd: new Date(Date.now() + 1000 * 60 * 60 * 24),
          user: {
            connect: {
              login: dto.otherLogin,
            },
          },
          channel: {
            connect: {
              name: dto.channelName,
            },
          },
        },
      });
    } else throw new ForbiddenException('You are not admin or owner of this channel');
  }

  //use in channel gateway
  async banUserFromChannel(dto: { channelName: string; myLogin: string; otherLogin: string }) {
    const isAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: dto.myLogin });
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: dto.myLogin });
    if (isOwner) {
      await this.prismaservice.channel.update({
        where: {
          name: dto.channelName,
        },
        data: {
          banned: {
            connect: {
              login: dto.otherLogin,
            },
          },
          members: {
            disconnect: {
              login: dto.otherLogin,
            },
          },
          admins: {
            disconnect: {
              login: dto.otherLogin,
            },
          },
        },
      });
    } else throw new ForbiddenException('You are not admin or owner of this channel');
  }

  // use in channel gateway

  async unbanUserFromChannel(dto: { channelName: string; myLogin: string; otherLogin: string }) {
    const isAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: dto.myLogin });
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: dto.myLogin });
    if (isAdmin || isOwner) {
      await this.prismaservice.channel.update({
        where: {
          name: dto.channelName,
        },
        data: {
          banned: {
            disconnect: {
              login: dto.otherLogin,
            },
          },
        },
      });
    } else throw new ForbiddenException('You are not admin or owner of this channel');
  }

  // use in channel gateway

  async addAdminToChannel(login, dto: { channelName: string; user: string }) {
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: login });
    if (!isOwner) {
      await this.prismaservice.channel.update({
        where: {
          name: dto.channelName,
        },
        data: {
          members: {
            disconnect: {
              login: dto.user,
            },
          },
          admins: {
            connect: {
              login: dto.user,
            },
          },
        },
      });
    } else throw new ForbiddenException('You are not owner of this channel');
  }

  // use in channel gateway
  async removeAdminFromChannel(dto: { channelName: string; myLogin: string; otherLogin: string }) {
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: dto.myLogin });
    if (!isOwner) {
      await this.prismaservice.channel.update({
        where: {
          name: dto.channelName,
        },
        data: {
          admins: {
            disconnect: {
              login: dto.otherLogin,
            },
          },
        },
      });
    } else throw new ForbiddenException('You are not owner of this channel');
  }

  // use in channel gateway
  async removeChannel(dto: { channelName: string; user: string }) {
    const isOwner = await this.checkIfOwner(dto);
    if (isOwner) {
      await this.prismaservice.channel.delete({
        where: {
          name: dto.channelName,
        },
      });
    } else throw new ForbiddenException('You are not owner of this channel');
  }

  async checkIfUserMuted(dto: { channelName: string; user: string }) {
    const channel = await this.prismaservice.userMutedInChannel.findFirst({
      where: {
        user: {
          login: dto.user,
        },
        channel: {
          name: dto.channelName,
        },
      },
    });
    if (channel) return true;
    return false;
  }

  async whoIam(dto: { channelName: string; user: string }) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: dto.channelName,
      },
      include: {
        owner: true,
        admins: true,
        members: true,
        banned: true,
      },
    });
    if (channel.owner.login == dto.user) return 0;
    if (channel.admins.find((admin) => admin.login == dto.user)) return 1;
    if (channel.members.find((member) => member.login == dto.user)) return 2;
    if (channel.banned.find((ban) => ban.login == dto.user)) return 3;
    if (await this.checkIfUserMuted(dto)) return 4;
    return 5;
  }

  async listChannelMembers(login, dto: { channelName: string; user: string }) {
    const channel = await this.prismaservice.channel.findUnique({
      where: {
        name: dto.channelName,
      },
      include: {
        owner: true,
        admins: true,
        members: true,
        banned: true,
      },
    });
    const isAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: login });
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: login });
    const banned = isAdmin || isOwner ? channel.banned : [];
    return {
      iAm: await this.whoIam(dto),
      owner: channel.owner,
      admins: channel.admins,
      members: channel.members,
      banned: banned,
    };
  }

  async listPublicProtectedChannels() {
    const channels = await this.prismaservice.channel.findMany({
      where: {
        OR: [
          {
            type: 0,
          },
          {
            type: 2,
          },
        ],
      },
    });
    return channels;
  }
}
