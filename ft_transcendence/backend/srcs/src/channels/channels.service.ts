import { ForbiddenException, Injectable } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarFromLogin, getAvatarUrlFromLogin } from 'src/utils/get-avatar-from-login';

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

  async updateChannelPassword(login: string, dto: { channelName: string; password: string }) {
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: login });
    if (isOwner) {
      const channelType = await this.checkTypeOfChannel(dto);
      if (channelType == 0 && dto.password)
      {
        await this.prismaservice.channel.update({
          where: {
            name: dto.channelName
          },
          data: {
            type: 2
          }
        })
      }
      else if (channelType == 2 && dto.password)
      {
        await this.prismaservice.channel.update({
          where: {
            name: dto.channelName,
          },
          data: {
            password: dto.password,
          },
        });
      }
      else if (channelType == 2 && dto.password == ''){
        await this.prismaservice.channel.update({
          where: {
            name: dto.channelName
          },
          data: {
            type: 0
          }
        })
        await this.prismaservice.channel.update({
          where: {
            name: dto.channelName,
          },
          data: {
            password: null,
          },
      });
      }
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
    friendsNotInChannel.forEach((friend) => {
      friend['avatarUrl'] = getAvatarUrlFromLogin(friend.login, friend.avatar);
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
    try{

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
    catch (e){
      throw new ForbiddenException('Channel with this name already exists');
    }
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
    dto: { channelName: string; user?: string; password?: string },
  ) {
    const channelType = await this.checkTypeOfChannel(dto);
    const pass = await this.getChannelPassword(dto);
    let userToAdd = dto.user;
    const checkIfAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: login });
    const checkIfOwner = await this.checkIfOwner({ channelName: dto.channelName, user: login });
    console.log("dto.user ===== ", dto.user);
    if (!dto.user){
      if (channelType == 2) {
        if (pass != dto.password)
          throw new ForbiddenException('Wrong password');
      userToAdd = login;
    }
  }
    else{
      if (channelType == 2 || channelType == 1) {
        if (!(checkIfAdmin || checkIfOwner)) {
          throw new ForbiddenException('You are not admin or owner of this channel');
        }
      }
    }
    const isBanned = await this.getBannedUsers(dto.channelName);
    if (isBanned.find((ban) => ban.login == dto.user))
      throw new ForbiddenException('This user is banned from this channel');
    await this.prismaservice.channel.update({
      where: { 
        name: dto.channelName,
      },   
      data: {
        members: {
          connect: {
            login: userToAdd,
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
  async removeUserFromChannel(client: any, dto: { channelName: string; myLogin: string; otherLogin?: string }) {
    const isAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: dto.myLogin });
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: dto.myLogin });
    const isOtherAdmin = await this.checkIfAdmin({
      channelName: dto.channelName,
      user: dto.otherLogin,
    });
    if (!dto.otherLogin)
    {
      if (isOwner)
        return await this.removeChannel(client, {channelName: dto.channelName, user: dto.myLogin});
      else if (isAdmin){
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
      }
      else {
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
      }
      await this.prismaservice.userMutedInChannel.deleteMany({
        where: {
          AND: [
            {
              userLogin: dto.myLogin
            },
            {
              channelName: dto.channelName
            },
          ]
        }
      })
    }
  else {
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
    await this.prismaservice.userMutedInChannel.deleteMany({
      where: {
        AND: [
          {
            userLogin: dto.otherLogin
          },
          {
            channelName: dto.channelName
          },
        ]
      }
    })
    client.to(dto.channelName).emit('user-removed-from-channel', {login: dto.otherLogin, channelName: dto.channelName});
  }

  //use in channel gateway
  async muteUserInChannel(client :any, dto: { channelName: string; myLogin: string; otherLogin: string }) {
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
    client.to(dto.channelName).emit('user-muted-in-channel',  {login: dto.otherLogin, channelName: dto.channelName});
  }

  //use in channel gateway
  async banUserFromChannel(client: any, dto: { channelName: string; myLogin: string; otherLogin: string }) {
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
    client.to(dto.channelName).emit('user-banned-from-channel',  {login: dto.otherLogin, channelName: dto.channelName});
  }

  // use in channel gateway

  async unbanUserFromChannel(client: any, dto: { channelName: string; myLogin: string; otherLogin: string }) {
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
    client.to(dto.channelName).emit('user-unbanned-from-channel',  {login: dto.otherLogin, channelName: dto.channelName});
  }

  // use in channel gateway

  async addAdminToChannel(login, dto: { channelName: string; user: string }) {
    const isOwner = await this.checkIfOwner({ channelName: dto.channelName, user: login });
    const isAdmin = await this.checkIfAdmin({ channelName: dto.channelName, user: dto.user });
    // console.log("log")
    if (isAdmin)
      throw new ForbiddenException('This user is already admin of this channel');
    if (isOwner) {
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
  async removeAdminFromChannel(client: any, dto: { channelName: string; myLogin: string; otherLogin: string }) {
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
    client.to(dto.channelName).emit('admin-removed-from-channel',  {login: dto.otherLogin, channelName: dto.channelName});
  }

  // use in channel gateway
  async removeChannel(client: any, dto: { channelName: string; user: string }) {
    const isOwner = await this.checkIfOwner(dto);
    if (isOwner) {
      await this.prismaservice.channel.delete({
        where: {
          name: dto.channelName,
        },
      });
    } else throw new ForbiddenException('You are not owner of this channel');
    client.to(dto.channelName).emit('channel-removed',  {channelName: dto.channelName});
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
      // include: {
      //   owner: true,
      //   admins: true,
      //   members: true,
      //   banned: true,
      // },
      select: {
        owner: true,
        admins: true,
        members: true,
        banned: true,
        type: true,
      }
    });
    if (channel.owner.login == dto.user) return "owner";
    if (channel.admins.find((admin) => admin.login == dto.user)) return "admin";
    if (channel.members.find((member) => member.login == dto.user)) return "member";
    if (channel.banned.find((ban) => ban.login == dto.user)) return "banned";
    if (await this.checkIfUserMuted(dto)) return "muted";
    return 5;
  }

  async getUsersAvatars(owner, admins, members, banned) {
    owner['avatarUrl'] = getAvatarUrlFromLogin(owner.login, owner.avatar);
    admins.forEach((admin) => {
      admin['avatarUrl'] = getAvatarUrlFromLogin(admin.login, admin.avatar);
    });
    members.forEach((member) => {
      member['avatarUrl'] = getAvatarUrlFromLogin(member.login, member.avatar);
    });
    banned.forEach((ban) => {
      ban['avatarUrl'] = getAvatarUrlFromLogin(ban.login, ban.avatar);
    });
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
    this.getUsersAvatars(channel.owner, channel.admins, channel.members, banned);
    return {
      iAm: await this.whoIam(dto),
      owner: channel.owner,
      admins: channel.admins,
      members: channel.members,
      banned: banned,
    };
  }

  async listPublicProtectedChannels(login: string) {
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
      select: {
        name: true,
        type: true,
      },
    });
    await Promise.all(
      channels.map(async (channel) => {
        const isMember = await this.checkIfMember(channel.name, login);
        const isOwner = await this.checkIfOwner({ channelName: channel.name, user: login });
        const isAdmin = await this.checkIfAdmin({ channelName: channel.name, user: login });
        if (isMember || isOwner || isAdmin) channel['isMember'] = true;
        else channel['isMember'] = false;
      }),
    );
    return channels;
  }
  async channelsWithConversation(client: any, login: string) {
    const channelsWithConversation = await this.prismaservice.channel.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                login: login,
              },
            },
          },
          {
            owner: {
              login: login,
            },
          },
          {
            admins: {
              some: {
                login: login,
              },
            },
          },
        ],
      },
      include: {
        messages: true,
      },
    });
    if (!channelsWithConversation) return [];
    channelsWithConversation.sort((a, b) => {
      const getLastMessageDate = (channel) => {
        const dates = channel.messages.map((message) => message.dateOfSending);
        return Math.max(...dates);
      };

      const aLastMessageDate = getLastMessageDate(a);
      const bLastMessageDate = getLastMessageDate(b);

      if (aLastMessageDate > bLastMessageDate) {
        return -1;
      }
      if (aLastMessageDate < bLastMessageDate) {
        return 1;
      }
      return 0;
    });
    await Promise.all(
      channelsWithConversation.map(async (channel) => {
        channel['whoIam'] = await this.whoIam({ channelName: channel.name, user: login });
        channel['isMuted'] = await this.checkIfUserMuted({channelName: channel.name, user: login});
        console.log("is muted ===== ", channel['isMuted']);
        // console.log('who i am ==== ', channel['whoIam']);
        client.join(channel.name);
      }),
    );
    return channelsWithConversation;
  }
}
