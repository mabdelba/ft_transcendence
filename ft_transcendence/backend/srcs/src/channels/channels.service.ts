import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsService {
    constructor(private prismaservice: PrismaService) {}
    async checkIfAdmin(dto: { channelName: string, user: string }) {
        const channel = await this.prismaservice.channel.findUnique({
            where: {
                name: dto.channelName
            },
            include: {
                admins: true
            }
        })
        if (channel.admins.find((admin) => admin.login == dto.user))
            return true;
        return false;
    }

    async checkIfOwner(dto: { channelName: string, user: string }) {
        const channel = await this.prismaservice.channel.findUnique({
            where: {
                name: dto.channelName
            },
            include: {
                owner: true
            }
        })
        if (channel.owner.login == dto.user)
            return true;
        return false;
    }


    async addNewChannel(dto: { channelName: string,  description: string , owner: string, type: number, password?: string}) {
        if (dto.type == 0)
            dto.password = null;
        await this.prismaservice.channel.create({
            data: {
                name: dto.channelName,
                description: dto.description,
                password: dto.password,
                type: dto.type,
                owner: {
                    connect: {
                        login: dto.owner
                    }
                }
            }
        })
    }

    async checkTypeOfChannel(dto: { channelName: string }) {
        const channel = await this.prismaservice.channel.findUnique({
            where: {
                name: dto.channelName
            }
        })
        return channel.type;
    }

    async getChannelPassword(dto: { channelName: string }) {
        const channel = await this.prismaservice.channel.findUnique({
            where: {
                name: dto.channelName
            }
        })
        return channel.password;
    }

    async addNewUserToChannel(dto: { channelName: string, user: string, password?: string }) {
        const channelType = await this.checkTypeOfChannel(dto);
        if (channelType == 0 || channelType == 1)
        {
            await this.prismaservice.channel.update({
                where: {
                    name: dto.channelName
                },
                data: {
                    members: {
                        connect: {
                            login: dto.user
                        }
                    }
                }
            })
        }
        else if (channelType == 1)
        {
            if( await this.getChannelPassword(dto) == dto.password)
            {
                await this.prismaservice.channel.update({
                    where: {
                        name: dto.channelName
                    },
                    data: {
                        members: {
                            connect: {
                                login: dto.user
                            }
                        }
                    }
                })
            }
            else
                throw new ForbiddenException("Wrong password");
        }
    }

    /// use in channel gateway
    async removeUserFromChannel(dto: { channelName: string, user: string }) {
        const isAdmin = await this.checkIfAdmin(dto);
        const isOwner = await this.checkIfOwner(dto);
        if (isAdmin || isOwner){
            await this.prismaservice.channel.update({
                where: {
                    name: dto.channelName
                },
                data: {
                    members: {
                        disconnect: {
                            login: dto.user
                        }
                    },
                }
            })
            await this.prismaservice.userMutedInChannel.deleteMany({
                where: {
                    user: {
                        login: dto.user
                    },
                    channel: {
                        name: dto.channelName
                    }
                }
            })
        }
        else
            throw new ForbiddenException("You are not admin or owner of this channel");
    }

    //use in channel gateway
    async muteUserInChannel(dto: { channelName: string, user: string }) {
        const isAdmin = await this.checkIfAdmin(dto);
        const isOwner = await this.checkIfOwner(dto);
        if (isAdmin || isOwner){
            await this.prismaservice.userMutedInChannel.create({
                data: {
                    dateEnd: new Date(Date.now() + 1000 * 60 * 60 * 24),
                    user: {
                        connect: {
                            login: dto.user
                        }
                    },
                    channel: {
                        connect: {
                            name: dto.channelName
                        }
                    }
                }
            })
        }
        else
            throw new ForbiddenException("You are not admin or owner of this channel");
    }

    //use in channel gateway
    async banUserFromChannel(dto: { channelName: string, user: string }) {
        const isAdmin = await this.checkIfAdmin(dto);
        const isOwner = await this.checkIfOwner(dto);
        if (isAdmin || isOwner){
            await this.prismaservice.channel.update({
                where: {
                    name: dto.channelName
                },
                data: {
                    banned: {
                        connect: {
                            login: dto.user
                        }
                    }
                }
            })
        }
        else
            throw new ForbiddenException("You are not admin or owner of this channel");
    }

    // use in channel gateway

    async unbanUserFromChannel(dto: { channelName: string, user: string }) {
        const isAdmin = await this.checkIfAdmin(dto);
        const isOwner = await this.checkIfOwner(dto);
        if (isAdmin || isOwner){
            await this.prismaservice.channel.update({
                where: {
                    name: dto.channelName
                },
                data: {
                    banned: {
                        disconnect: {
                            login: dto.user
                        }
                    }
                }
            })
        }
        else
            throw new ForbiddenException("You are not admin or owner of this channel");
    }

    // use in channel gateway

    async addAdminToChannel(dto: { channelName: string, user: string }) {
        const isOwner = await this.checkIfOwner(dto);
        if (!isOwner){
            await this.prismaservice.channel.update({
                where: {
                    name: dto.channelName
                },
                data: {
                    admins: {
                        connect: {
                            login: dto.user
                        }
                    }
                }
            })
        }
        else
            throw new ForbiddenException("You are not owner of this channel");
    }

    // use in channel gateway
    async removeAdminFromChannel(dto: { channelName: string, user: string }) {
        const isOwner = await this.checkIfOwner(dto);
        if (!isOwner){
            await this.prismaservice.channel.update({
                where: {
                    name: dto.channelName
                },
                data: {
                    admins: {
                        disconnect: {
                            login: dto.user
                        }
                    }
                }
            })
        }
        else
            throw new ForbiddenException("You are not owner of this channel");
    }

    // use in channel gateway
    async removeChannel(dto: { channelName: string, user: string }) {
        const isOwner = await this.checkIfOwner(dto);
        if (isOwner){
            await this.prismaservice.channel.delete({
                where: {
                    name: dto.channelName
                }
            })
        }
        else
            throw new ForbiddenException("You are not owner of this channel");
    }

    async checkIfUserMuted(dto: { channelName: string, user: string }) {
        const channel = await this.prismaservice.userMutedInChannel.findFirst({
            where: {
                user: {
                    login: dto.user
                },
                channel: {
                    name: dto.channelName
                }
            }
        });
        if (channel)
            return true;
        return false;
    }

    async whoIam(dto: { channelName: string, user: string }) {
        const channel = await this.prismaservice.channel.findUnique({
            where: {
                name: dto.channelName
            },
            include: {
                owner: true,
                admins: true,
                members: true,
                banned: true
            }
        })
        if (channel.owner.login == dto.user)
            return 0;
        if (channel.admins.find((admin) => admin.login == dto.user))
            return 1;
        if (channel.members.find((member) => member.login == dto.user))
            return 2;
        if (channel.banned.find((ban) => ban.login == dto.user))
            return 3;
        if ( await this.checkIfUserMuted(dto))
            return 4;
        return 5;
    }

    async listChannelMembers(dto: { channelName: string, user: string }) {
        const channel = await this.prismaservice.channel.findUnique({
            where: {
                name: dto.channelName
            },
            include: {
                owner: true,
                admins: true,
                members: true,
                banned: true
            }
        })
        const isAdmin = await this.checkIfAdmin(dto);
        const isOwner = await this.checkIfOwner(dto);
        const banned = (isAdmin || isOwner) ? channel.banned : []
        return {owner: channel.owner, admins: channel.admins, members: channel.members, banned: banned};
    }

    async listPublicProtectedChannels() {
        const channels = await this.prismaservice.channel.findMany({
            where: {
                OR: [
                    {
                        type: 0
                    },
                    {
                        type: 2
                    }
                ]
            }
        })
        return channels;
    }
}
