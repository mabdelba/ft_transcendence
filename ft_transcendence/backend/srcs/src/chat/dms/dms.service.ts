import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import jwtDecode from 'jwt-decode';
import { Socket } from "socket.io";
import { async } from "rxjs";


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

    joinRoom(data: any, isChannel: boolean, client: Socket){
        client.join(data.roomName);
        console.log(`User ${data.user} joined room ${data.roomName}`);
        // return roomName;
    }

    async saveMessage(client: any,data: any){
        console.log(`User ${data.senderLogin} sent message to ${data.receiverLogin}`);
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
}