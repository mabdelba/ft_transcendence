import { UseGuards } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { JwtGuard } from "src/auth/guards";
import { Server, Socket, Namespace } from 'socket.io';
import jwtDecode from 'jwt-decode';
import { DmsService } from "./dms.service";



@WebSocketGateway({namespace: 'dm'})
// @UseGuards(JwtGuard)
export class DmsGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private dmsService: DmsService){}
    @WebSocketServer()
    io: Namespace;

    async handleConnection(client: any, room: String, socket: Socket) {
        this.dmsService.joinRoom(client, socket, this.io.server);
    }
    handleDisconnect(client: any) {
        console.log('disconnected');
    }
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket){
        client.to('aelabimabdelba').emit('message', data);
    }
}