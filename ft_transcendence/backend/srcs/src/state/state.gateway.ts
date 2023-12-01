import { ForbiddenException, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import jwtDecode from 'jwt-decode';
import { DmsGateway } from 'src/chat/dms/dms.gateway';
import { ChannelsGateway } from 'src/channels/channels.gateway';

@WebSocketGateway()
export class StateGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private prisma: PrismaService, private dmsGateway: DmsGateway, private channelsGateway: ChannelsGateway) {}
  @WebSocketServer()
  io: Server;
  users = new Map();
  @UseGuards(JwtGuard)
  handleConnection(client: Socket) {
   this.users.set(client.id, null);
  }

  async handleDisconnect(client: any) {
    if (this.users.has(client.id) && this.users.get(client.id) != null) {

      try{
      await this.prisma.user.update({
        where: {
          login: this.users.get(client.id),
        },
        data: {
          state: 0,
        },
      });
      this.users.delete(client.id);
    } catch (e) {
      throw new ForbiddenException('User not found');
    }
    }
  }
  @SubscribeMessage('online')
  async setOnline(client: Socket, message: { token: string }) {
    const jwtToken = message.token;
    const decoded = jwtDecode(jwtToken);

    this.users.set(client.id, decoded['login']);
    try{
    await this.prisma.user.update({
      where: {
        login: decoded['login'],
      },
      data: {
        state: 1,
      },
    });
  } catch (e) {
    throw new ForbiddenException('User not found');
  }
  }
  @SubscribeMessage('inGame')
  async setInGame(client: Socket, message: { token: string }) {
    const jwtToken = message.token;
    const decoded = jwtDecode(jwtToken);
  
    this.users.set(client.id, decoded['login']);
    try{
    await this.prisma.user.update({
      where: {
        login: decoded['login'],
      },
      data: {
        state: 2,
      },
    });
  } catch (e) {
    throw new ForbiddenException('User not found');
  }
  }
@SubscribeMessage('offline')
  async setOffline(client: Socket, message: { token: string, login?: string }) {
    const jwtToken = message.token;
    const decoded = jwtDecode(jwtToken);
    this.users.delete(client.id);
    const log = message.login ? message.login : decoded['login'];
    try{ 
    await this.prisma.user.update({
      where: {
        login: log,
      },
      data: {
        state: 0,
      },
    }); 
  } catch (e) {
    throw new ForbiddenException('User not found');
  }
  }


  /** 
       events for direct messages namespace
  **/
  @SubscribeMessage('users-with-conversation')
  getUsersWithConversation(client: Socket, data: { me: string; login: string }) {
    this.dmsGateway.getUsersWithConversation(data, client);
  }

  @SubscribeMessage('notification')
  sendNotification(client: Socket, message: {login: string, senderId: string}) {
    const key = [...this.users].find(([key, value]) => value === message.login)?.[0];
  
    if (key != null) {
      this.io.to(key).emit('inviteToGame', {senderId: message.senderId, login: message.login});
    }
  }

  @SubscribeMessage('cancel-invite')
  cancelInvite(client: Socket, message: {senderId: string}) {
    const key = [...this.users].find(([key, value]) => value === message.senderId)?.[0];
    if (key != null){
      this.io.to(key).emit('cancelInvite', {login: message.senderId});
    }
  }

  @SubscribeMessage('channels-with-conversation')
  async getChannelsWithConversation(
    @MessageBody() data: { channelName: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.channelsGateway.getChannelsWithConversation(data, client);
  }
  @SubscribeMessage('get-messages')
  getMessages(
    client: Socket,
    data: { isChannel: boolean; senderLogin: string; receiverLogin: string },
  ) {
    this.dmsGateway.handleGetMessages(data, client, this.users);
  }

  @SubscribeMessage('send-message')
  sendMessage(
    client: Socket,
    data: { isChannel: boolean; senderLogin: string; receiverLogin: string; text: string },
  ) {
    this.dmsGateway.handleMessage(data, client, this.users, this.io);
  }

  @SubscribeMessage('cancel-notif')
  cancelNotif(client: Socket, data: {login : string}){
    const key = [...this.users].find(([key, value]) => value === data.login)?.[0];
    if (key != null){

      this.io.to(key).emit('cancelNotification', {login: data.login});
    }
  }

  @SubscribeMessage('remove-user-from-channel')
  removeUserFromChannel(client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    this.channelsGateway.removeUserFromChannel(client, data);
  }

  @SubscribeMessage('mute-user-in-channel')
  muteUserInChannel(client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    this.channelsGateway.muteUserInChannel(client, data);
  }

  @SubscribeMessage('ban-user-in-channel')
  banUserInChannel(client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    this.channelsGateway.banUserInChannel(client, data);
  }

  @SubscribeMessage('unban-user-in-channel')
  unbanUserInChannel(client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    this.channelsGateway.unbanUserInChannel(client, data);
  }

  @SubscribeMessage('remove-admin-from-channel')
  removeAdminFromChannel(client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    this.channelsGateway.removeAdminFromChannel(client, data);
  }

  @SubscribeMessage('remove-channel')
  removeChannel(client: Socket, data: { channelName: string; user: string }) {
    this.channelsGateway.removeChannel(client, data);
  }
}
