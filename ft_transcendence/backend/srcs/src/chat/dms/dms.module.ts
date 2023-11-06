import { Global, Module } from '@nestjs/common';
import { DmsGateway } from './dms.gateway';
import { DmsService } from './dms.service';

@Global()
@Module({
  providers: [DmsGateway, DmsService],
  exports: [DmsGateway],
})
export class DmsModule {} 
 