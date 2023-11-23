import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { JwtGuard } from 'src/auth/guards';
import { Server, Socket, Namespace } from 'socket.io';
import jwtDecode from 'jwt-decode';
import { DmsService } from './dms.service';
import { subscribe } from 'diagnostics_channel';

@WebSocketGateway({ namespace: 'dm' })
// @UseGuards(JwtGuard)
export class DmsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private dmsService: DmsService) {}
  @WebSocketServer()
  io: Namespace;

  async handleConnection(client: any, room: String) {
    console.log('connected dm ', client.id);
    // this.dmsService.joinRoom(client, socket, this.io.server);
  }
  handleDisconnect(client: any) {
    console.log('disconnected');
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody()
    data: { isChannel: boolean; senderLogin: string; receiverLogin: string; text: string },
    @ConnectedSocket() client: Socket,
    users: Map<string, string>,
    ios: Server,
  ) {
    if (!this.dmsService.checkUsers(data.senderLogin, data.receiverLogin)) return;
    await this.dmsService.sendAndSaveMessage(client, data, ios, users);
  }
 
  @SubscribeMessage('users-with-conversation')
  async getUsersWithConversation(
    @MessageBody() data: { login: string },
    @ConnectedSocket() client: Socket,
  ) {
    const dms = await this.dmsService.usersWithConversation(data.login, client);
    client.emit('get-users', dms);
    return dms; 
  }

  @SubscribeMessage('get-messages')
  async handleGetMessages(
    @MessageBody() data: { isChannel: boolean; senderLogin: string; receiverLogin: string },
    @ConnectedSocket() client: Socket,
    users:any
  ) {
    if (!this.dmsService.checkUsers(data.senderLogin, data.receiverLogin)) return;
    const messages = await this.dmsService.getMessages(data, this.io, client, users);
    client.emit('get-messages', messages);
    return messages; 
  }

  // channels part
  
}
