import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import jwtDecode from 'jwt-decode';
import { Socket } from "socket.io";


@Injectable()
export class ChatService {
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

    joinRoom(client: any, socket: Socket){
        const me:{login:string} = this.decodeToken(client.handshake.headers.access_token) as {login:string};
        const channel = client.handshake.query.channel;
        const otherUser = client.handshake.query.user;
        const other = otherUser !== undefined ? this.createRoomName(me.login, otherUser) : channel;
        client.join(other);
        console.log(`User ${me.login} joined room ${other}`);
    }
}