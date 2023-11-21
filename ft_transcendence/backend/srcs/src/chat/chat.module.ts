import { Module } from '@nestjs/common';
import { DmsModule } from './dms/dms.module';

@Module({
  // providers: [ChatService, ChatGateway],
  imports: [DmsModule],
})
export class ChatModule {}
