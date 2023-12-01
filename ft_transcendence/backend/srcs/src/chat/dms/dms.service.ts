import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtDecode from 'jwt-decode';
import { Socket } from 'socket.io';
import { getAvatarFromLogin, getAvatarUrlFromLogin } from 'src/utils/get-avatar-from-login';
import { channel } from 'diagnostics_channel';
import { use } from 'passport';
import { all } from 'axios';

@Injectable()
export class DmsService {
  constructor(private prisma: PrismaService) {}
  decodeToken(token: string) {
    const decoded = jwtDecode(token);
    return decoded;
  }

  createRoomName(user1: string, user2: string) {
    if (user1 < user2) return user1 + user2;
    return user2 + user1;
  }

  async mutedUserInChannel(login: string, channel: string) {
    try{
      const muted = await this.prisma.userMutedInChannel.findFirst({
        where: {
          AND: [
            {
              channelName: channel,
            },
            {
              userLogin: login,
            },
          ],
        },
      });
      if (muted) return true;
      return false;
    } catch (e) {
     throw new ForbiddenException('User not found');
    }
  }

  getClientFromLogin(login: string, users: Map<string, string>) {
    for (const [socketId, userLogin] of users) {
      if (userLogin === login) return socketId;
    }
    return null;
  }

  async sendAndSaveMessage(client: any, data: any, io: any, users: Map<string, string>) {
    try{
      
      const roomName = data.isChannel
        ? data.receiverLogin
        : this.createRoomName(data.senderLogin, data.receiverLogin);
      // check if user is blocked
      if (data.isChannel) {
        const mutedInChannel = await this.mutedUserInChannel(data.senderLogin, data.receiverLogin);
        if (mutedInChannel) return;
        await this.prisma.message.create({
          data: {
            text: data.text,
            senderUser: {
              connect: {
                login: data.senderLogin,
              },
            },
            channel: {
              connect: {
                name: data.receiverLogin,
              },
            },
          },
        });
        const allSocketsInRoom = await io.in(roomName).fetchSockets();
        await Promise.all(
          allSocketsInRoom.map(async (socket) => {
            if (socket.id !== client.id){
            const checkIfBlocked = await this.prisma.user.findMany({
              where: {
                AND: [ 
                  {
                    login: users.get(socket.id),
                  },
                  {
                    OR: [
                      {
                        blockedList: {
                          some: {
                            login: data.senderLogin,
                          },
                        },
                      },
                      {
                        blockedBy: {
                          some: {
                            login: data.senderLogin,
                          },
                        },
                      }, 
                    ],
                  } 
                ],
              },
              include: {
                blockedList: true,
                blockedBy: true
              },
            });
            if (!checkIfBlocked || checkIfBlocked.length === 0) {
              socket.emit('receive-message', data);
        
            }
          }
          }),
        ); 
      } else {
        const blockedList = await this.blockedList(data.receiverLogin);
        const blockedListLogins = blockedList.blockedList.map((user) => user.login);
        const blockedByLogins = blockedList.blockedBy.map((user)=> user.login);
        const allBlocked = [...blockedByLogins , ...blockedListLogins]
        if (allBlocked.includes(data.senderLogin))
          return ;
        if (this.getClientFromLogin(data.receiverLogin, users) !== null) 
          io.sockets.sockets.get(this.getClientFromLogin(data.receiverLogin, users)).join(roomName);
        client.to(roomName).emit('receive-message', data);
        await this.prisma.message.create({
          data: {
            text: data.text,
            senderUser: {
              connect: {
                login: data.senderLogin,
              },
            },
            recieverUser: {
              connect: {
                login: data.receiverLogin,
              },
            },
          },
        });
      }
    } catch (e) {
      new ForbiddenException('User not found');
    }
  }

  async checkUsers(senderLogin: string, receiverLogin: string) {
    try{
      const sender = await this.prisma.user.findUnique({
        where: {
          login: senderLogin,
        },
      });
      const receiver = await this.prisma.user.findUnique({
        where: {
          login: receiverLogin,
        },
      });
      if (!sender || !receiver) return false;
      return true;
    } catch (e) {
     throw new ForbiddenException('User not found');
    }
  }

  async getConversation(senderLogin: string, receiverLogin: string, isChannel: boolean) {
    try{
      var messages;
      if (!isChannel) {
        messages = await this.prisma.message.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    sender: senderLogin,
                  },
                  {
                    sender: receiverLogin,
                  },
                ],
              },
              {
                OR: [
                  {
                    reciever: senderLogin,
                  },
                  {
                    reciever: receiverLogin,
                  },
                ],
              },
            ],
          },
          orderBy: {
            dateOfSending: 'asc',
          },
        });
      } else {
        messages = await this.prisma.message.findMany({
          where: {
            recieverchannel: receiverLogin,
          },
          orderBy: {
            dateOfSending: 'asc',
          },
        });
      }
      return messages;
    } catch (e) {
     throw new ForbiddenException('User not found');
    }
  }
  async getUsersWithConversation(login: string) {
    try{
      const usersWithConversation = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              sentMessages: {
                some: {
                  reciever: login,
                },
              },
            },
            {
              recievedMessages: {
                some: {
                  sender: login,
                },
              },
            },
          ],
        },
        include: {
          sentMessages: true,
          recievedMessages: true,
        },
      });
      return usersWithConversation;
    } catch (e) {
     throw new ForbiddenException('User not found');
    }
  }

  async blockedList(login: string) {
    try{
      const blockedList = await this.prisma.user.findUnique({
        where: {
          login: login,
        },
        include: {
          blockedList: true,
          blockedBy: true
        },
      });
      return blockedList;
    } catch (e) {
     throw  new ForbiddenException('User not found');
    }
  }

  sortUsersWithConversation(usersWithConversation: any[]) {
    usersWithConversation.sort((a, b) => {
      const getLastMessageDate = (user) => {
        const sentDates = user.sentMessages.map((message) => message.dateOfSending);
        const recievedDates = user.recievedMessages.map((message) => message.dateOfSending);
        const allDates = [...sentDates, ...recievedDates];
        return Math.max(...allDates);
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
  }

  async usersWithConversation(login: string, client: any) {
    try {
    const usersWithConversation = await this.getUsersWithConversation(login);
    this.sortUsersWithConversation(usersWithConversation);
    const blockedList = await this.blockedList(login);
    const blockedListLogins = blockedList.blockedList.map((user) => user.login);
    const blockedByLogins = blockedList.blockedBy.map((user)=> user.login);
    const allBlocked = [...blockedByLogins , ...blockedListLogins]
    const users: {id: number; login: string; state: number; avatar?: string; isBlocked?: boolean, avatarUrl: string }[] = [];
    usersWithConversation.forEach(async (user) => {
      users.push({
        id: user.id,
        login: user.login,
        state: user.state,
        avatar: user.avatar,
        isBlocked: allBlocked.includes(user.login),
        avatarUrl: getAvatarUrlFromLogin(user.login, user.avatar),
      });

      client.join(this.createRoomName(login, user.login));
    });
    // console.log('users with conversation == ', users );
    return users;
  } catch (e) {
    new ForbiddenException('User not found');
  }
  }


  async getMessages(data: any, io: any, client: Socket, users: any) {
    try {
    const roomName = data.isChannel
      ? data.receiverLogin
      : this.createRoomName(data.senderLogin, data.receiverLogin);
    client.join(roomName);
    const messages = await this.getConversation(
      data.senderLogin,
      data.receiverLogin,
      data.isChannel,
    );
    const blockedList = await this.blockedList(data.senderLogin);
    const messagesWithoutBlocked = [];
    const blockedListLogins = blockedList.blockedList.map((user) => user.login);
    const blockedByLogins = blockedList.blockedBy.map((user)=> user.login);
    const allBlocked = [...blockedByLogins , ...blockedListLogins]
    messages.forEach((message) => {
      if (!allBlocked.includes(message.sender))
        messagesWithoutBlocked.push(message);
    });
    return messagesWithoutBlocked;
  }
  catch (e) {
    new ForbiddenException('User not found');
  }
  }
}
