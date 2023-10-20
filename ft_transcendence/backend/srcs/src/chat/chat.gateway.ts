import { UseGuards } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { JwtGuard } from "src/auth/guards";
import { Server, Socket } from 'socket.io';
import jwtDecode from 'jwt-decode';
import { ChatService } from "./chat.service";



@WebSocketGateway({namespace: 'chat'})
// @UseGuards(JwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private chatService: ChatService){}
    @WebSocketServer()
    server: Server;
    handleConnection(client: any, room: String, socket: Socket) {
        console.log('connected');
        this.chatService.joinRoom(client, socket);
    }
    handleDisconnect(client: any) {
        console.log('disconnected');
    }
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket){
        client.to('aelabimabdelba').emit('message', data);
    }
}