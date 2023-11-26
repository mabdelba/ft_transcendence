import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChannelsService } from './channels.service';
import { Server, Socket, Namespace } from 'socket.io';

@WebSocketGateway({ namespace: 'channels' })
export class ChannelsGateway {
  constructor(private channelService: ChannelsService) {}
  @SubscribeMessage('channels-with-conversation')
  async getChannelsWithConversation(
     data: { channelName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const channels = await this.channelService.channelsWithConversation(client, data.channelName);
    client.emit('get-channels', channels);
    return channels;
  }

  @SubscribeMessage('remove-user-from-channel')
  async removeUserFromChannel( @ConnectedSocket() client: Socket, data: { channelName: string; myLogin: string; otherLogin?: string }) {
    return this.channelService.removeUserFromChannel(client, data);
  }

  @SubscribeMessage('mute-user-in-channel')
  async muteUserInChannel(@ConnectedSocket() client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    return this.channelService.muteUserInChannel(client, data);
  }

  @SubscribeMessage('ban-user-in-channel')
  async banUserInChannel(@ConnectedSocket() client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    return this.channelService.banUserFromChannel(client, data);
  }

  @SubscribeMessage('unban-user-in-channel')
  async unbanUserInChannel(@ConnectedSocket() client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    return this.channelService.unbanUserFromChannel(client, data);
  }

  @SubscribeMessage('remove-admin-from-channel')
  async removeAdminFromChannel(@ConnectedSocket() client: Socket, data: { channelName: string; myLogin: string; otherLogin: string }) {
    return this.channelService.removeAdminFromChannel(client, data);
  }

  @SubscribeMessage('remove-channel')
  async removeChannel(@ConnectedSocket() client: Socket, data: { channelName: string; user: string }) {
    return this.channelService.removeChannel(client, data);
  }
}
