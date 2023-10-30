import { Module } from '@nestjs/common';
import { StateGateway } from './state.gateway';
import { DmsModule } from 'src/chat/dms/dms.module';
@Module({
    // imports: [DmsModule],
    // providers: [StateGateway, DmsModule],
    // exports: [StateGateway],
})
export class StateModule {}
