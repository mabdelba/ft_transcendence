import { Module } from '@nestjs/common';
import { DmsGateway } from './dms.gateway';
import { DmsService } from './dms.service';

@Module({
  providers: [DmsGateway, DmsService]
})
export class DmsModule {}
