import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsGateway]
})
export class ChannelsModule {}
