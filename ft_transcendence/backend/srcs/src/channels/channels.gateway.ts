import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChannelsService } from './channels.service';

@WebSocketGateway()
export class ChannelsGateway {
  constructor(private channelService: ChannelsService) {}
  @SubscribeMessage('remove-user-from-channel')
  async removeUserFromChannel(data: {channelName: string, user: string}) {
    return this.channelService.removeUserFromChannel(data);
  }

  @SubscribeMessage('mute-user-in-channel')
  async muteUserInChannel(data: {channelName: string, user: string}) {
    return this.channelService.muteUserInChannel(data);
  }

  @SubscribeMessage('ban-user-in-channel')
  async banUserInChannel(data: {channelName: string, user: string}) {
    return this.channelService.banUserFromChannel(data);
  }

  @SubscribeMessage('unban-user-in-channel')
  async unbanUserInChannel(data: {channelName: string, user: string}) {
    return this.channelService.unbanUserFromChannel(data);
  }

  @SubscribeMessage('remove-admin-from-channel')
  async removeAdminFromChannel(data: {channelName: string, user: string}) {
    return this.channelService.removeAdminFromChannel(data);
  }

  @SubscribeMessage('remove-channel')
  async removeChannel(data: {channelName: string, user: string}) {
    return this.channelService.removeChannel(data);
  }
}
