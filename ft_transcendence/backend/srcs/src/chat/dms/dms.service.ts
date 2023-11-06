import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import jwtDecode from 'jwt-decode';
import { Socket } from "socket.io";


@Injectable()
export class DmsService {
    constructor(private prisma: PrismaService) {}
    decodeToken(token: string){
        const decoded = jwtDecode(token);
        return decoded;
    }

    createRoomName(user1: string, user2: string){
        if (user1 < user2)
            return user1 + user2;
        return user2 + user1;
    }

    async mutedUserInChannel(login: string, channel: string){
        const muted = await this.prisma.userMutedInChannel.findFirst({
            where: {
                AND: [
                    {
                        channelName: channel
                    },
                    {
                        userLogin: login
                    }
                ]
            }
        });
        if (muted) return true;
        return false;
    }

    getClientFromLogin(login: string, users: Map<string, string>){
        for (const [socketId, userLogin] of users) {
            if (userLogin === login)
                return socketId;
        }
        return null;
    }

    async sendAndSaveMessage(client: any,data: any, io: any, users: Map<string, string>){
        console.log(`User ${data.senderLogin} sent message to ${data.receiverLogin}`);
        const roomName = data.isChannel ? data.receiverLogin : this.createRoomName(data.senderLogin, data.receiverLogin);
        // check if user is blocked
        if (data.isChannel){
            const mutedInChannel = await this.mutedUserInChannel(data.senderLogin, data.receiverLogin);
            if (mutedInChannel) return;
            await this.prisma.message.create({
                data: {
                    text: data.text,
                    senderUser: {
                        connect: {
                            login: data.senderLogin
                        }
                    },
                    channel: {
                        connect: {
                            name: data.receiverLogin
                        }
                    } 
                }
            });
        } 
        else
        {
            await this.prisma.message.create({
                data: { 
                    text: data.text,
                    senderUser: {
                        connect: {
                            login: data.senderLogin
                        }  
                    },
                    recieverUser: {
                        connect: {
                            login: data.receiverLogin
                        }
                    } 
                }
            });
            if (this.getClientFromLogin(data.receiverLogin, users) === null) console.log('null');
            else
                io.sockets.sockets.get(this.getClientFromLogin(data.receiverLogin, users)).join(roomName);
        }
        console.log('room name == ', roomName);
        client.to(roomName).emit('receive-message', data);
    }

    async checkUsers(senderLogin: string, receiverLogin: string){
        const sender = await this.prisma.user.findUnique({
            where: {
                login: senderLogin
            } 
        });
        const receiver = await this.prisma.user.findUnique({
            where: {
                login: receiverLogin
            }
        });
        if (!sender || !receiver) return false;
        return true;
    }

    async getConversation(senderLogin: string, receiverLogin: string, isChannel: boolean){
        var messages;
        if (!isChannel){
            messages = await this.prisma.message.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                sender: senderLogin
                            },
                            {
                                sender: receiverLogin
                            }
                        ]
                    },
                    {
                        OR: [
                            {
                                reciever: senderLogin
                            },
                            {
                                reciever: receiverLogin
                            }
                        ]
                    }
                ]
            },
            orderBy: {
                dateOfSending: 'asc'
            }
        });
    }
    else{
        messages = await this.prisma.message.findMany({
            where: {
                recieverchannel: receiverLogin
            },
            orderBy: {
                dateOfSending: 'asc'
            }
        });
    }
        return messages;
    }
    async getUsersWithConversation(login: string){
        const usersWithConversation = await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                    sentMessages: {
                        some: {
                        reciever: login
                        }
                    }
                    },
                    {
                    recievedMessages: {
                        some: {
                        sender: login
                        }
                    }
                    }
                ],
            },
            include: {
                sentMessages: true,
                recievedMessages: true,
            }
        });
        return usersWithConversation;
    }

    async blockedList(login: string){
        const blockedList = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
            include: {
                blockedList: true,
            },
        });
        return blockedList;
    }

    sortUsersWithConversation(usersWithConversation: any[]){
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

    async usersWithConversation(login: string, client: any){
        const usersWithConversation = await this.getUsersWithConversation(login);
        this.sortUsersWithConversation(usersWithConversation);
        const blockedList = await this.blockedList(login);
        const blockedListLogins = blockedList.blockedList.map((user) => user.login);
        const users: {login: string, state: number, avatar?: string, isBlocked?: boolean}[] = [];
        usersWithConversation.forEach(async (user) => {
            users.push({
                login: user.login,
                state: user.state,
                avatar: user.avatar,
                isBlocked: blockedListLogins.includes(user.login)
            });
            console.log(login, "join ", this.createRoomName(login, user.login));
            client.join(this.createRoomName(login, user.login));
        });
        return users;
    }

    checkIfInRoomAndJoin(senderLogin: string, receiverLogin: string, io: any, client: Socket){
        const roomName = this.createRoomName(senderLogin, receiverLogin);
        const room = io.sockets.adapter.rooms.get(roomName);
        if (room) {
            for (const [socketId, socket] of room.sockets) {
                if (socket === client)
                    socket.emit('message', 'Hello from the server!');
            }
        }
    }
    // Check if user is in room before join it
    async getMessages(data: any, io: any, client: Socket){
        // this.checkIfInRoomAndJoin(senderLogin, receiverLogin, io, client);
        const roomName = data.isChannel ? data.receiverLogin : this.createRoomName(data.senderLogin, data.receiverLogin);
        client.join(roomName);
        console.log(`User ${data.senderLogin} joined room ${roomName}`);
        const messages = await this.getConversation(data.senderLogin, data.receiverLogin, data.isChannel);
        const blockedList = await this.blockedList(data.senderLogin);
        const messagesWithoutBlocked = [];
        messages.forEach((message) => {
            if (message.sender === data.senderLogin)
            {
                if (!blockedList.blockedList.map((user) => user.login).includes(message.reciever))
                    messagesWithoutBlocked.push(message);
            }
            else if (message.reciever === data.senderLogin)
            {
                if (!blockedList.blockedList.map((user) => user.login).includes(message.sender))
                    messagesWithoutBlocked.push(message);
            }
        });
        return messagesWithoutBlocked;
    }

    async channelsWithConversation(login: string){
        const channelsWithConversation = await this.prisma.channel.findMany({
            where: {
                AND: [
                    {
                        members: {
                        some: {
                            login: login
                        }
                     },
                    },
                    {
                        messages: {
                            some: {}
                        }
                    }
                ],
            }
        });
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
        return channelsWithConversation;
    }
}