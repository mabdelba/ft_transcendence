import { Global, Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';

@Global()
@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsGateway],
  exports: [ChannelsGateway],
})
export class ChannelsModule {}
