import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtDecode from 'jwt-decode';
import { DmsGateway } from 'src/chat/dms/dms.gateway';


@WebSocketGateway()
export class StateGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService, private dmsGateway: DmsGateway) {}
  @WebSocketServer()
  io: Server;
  users = new Map();
  @UseGuards(JwtGuard)
  handleConnection(client: Socket) {
    console.log('connected state  ', client.id);
    this.users.set(client.id, null);
  }

  async handleDisconnect(client: any) { 
    if (this.users.has(client.id) && this.users.get(client.id) != null) {
      console.log("offline----", this.users.get(client.id));
      await this.prisma.user.update({
      where: {
        login: this.users.get(client.id),
      },
      data: {
        state: 0,
      },
    });
    this.users.delete(client.id);
    }
    console.log("offline handler");
  }

  @SubscribeMessage('online')
  async setOnline(client: Socket, message: {token: string}) {
    const jwtToken = message.token;
    const decoded = jwtDecode(jwtToken);
    console.log("online----", decoded['login']);
    this.users.set(client.id, decoded['login']);
    await this.prisma.user.update({
      where: {
        login: decoded['login'],
      },
      data: {
        state: 1,
      }
    });   
  }
  @SubscribeMessage('offline')  
  async setOffline(client: Socket, message: {token: string}) {
    const jwtToken = message.token;
    const decoded = jwtDecode(jwtToken);
    console.log("offline----", decoded['login']);
    this.users.delete(client.id);
    await this.prisma.user.update({
      where: {
        login: decoded['login'],
      },
      data: {
        state: 0,
      }
    }); 
  }


  /** 
       events for direct messages namespace
  **/
  @SubscribeMessage('users-with-conversation')
  getUsersWithConversation(client: Socket, data: {me: string, login: string}){
    this.dmsGateway.getUsersWithConversation(data, client);
  }

  @SubscribeMessage('get-messages')
  getMessages(client: Socket, data: {isChannel: boolean, senderLogin: string, receiverLogin: string}){
    this.dmsGateway.handleGetMessages(data, client);
  }

  @SubscribeMessage('send-message')
  sendMessage(client: Socket, data: {isChannel: boolean, senderLogin: string, receiverLogin: string, text: string}){
    this.dmsGateway.handleMessage(data, client);
  }
}
 