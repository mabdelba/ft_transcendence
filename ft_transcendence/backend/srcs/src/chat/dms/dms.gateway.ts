import { UseGuards } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { JwtGuard } from "src/auth/guards";
import { Server, Socket, Namespace } from 'socket.io';
import jwtDecode from 'jwt-decode';
import { DmsService } from "./dms.service";
import { subscribe } from "diagnostics_channel";



@WebSocketGateway({namespace: 'dm'})
// @UseGuards(JwtGuard)
export class DmsGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private dmsService: DmsService){}
    @WebSocketServer()
    io: Namespace;

    async handleConnection(client: any, room: String, socket: Socket) {
        console.log('connected');
        // this.dmsService.joinRoom(client, socket, this.io.server);
    }
    handleDisconnect(client: any) {
        console.log('disconnected');
    }
    @SubscribeMessage('join-room')
    handleJoinRoom(@MessageBody() data: {roomName: string, user: string}, @ConnectedSocket() client: Socket){
        this.dmsService.joinRoom(data, false, client);
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() data: {senderLogin: string, receiverLogin: string, text: string}, @ConnectedSocket() client: Socket){
        if (!this.dmsService.checkUsers(data.senderLogin, data.receiverLogin)) return;
        client.to(this.dmsService.createRoomName(data.receiverLogin, data.senderLogin)).emit('message', data);
        await this.dmsService.saveMessage(client, data);
    }

    @SubscribeMessage('users-with-conversation')
    async getUsersWithConversation(@MessageBody() data: {login: string}){
        const dms = await this.dmsService.usersWithConversation(data.login);
        console.log(dms);
        return dms;
    }

    @SubscribeMessage('get-messages')
    async handleGetMessages(@MessageBody() data: {senderLogin: string, receiverLogin: string}, @ConnectedSocket() client: Socket){
        if (!this.dmsService.checkUsers(data.senderLogin, data.receiverLogin)) return;
        const messages = await this.dmsService.getMessages(data.senderLogin, data.receiverLogin);
        console.log(messages);
        return messages;
    }

}