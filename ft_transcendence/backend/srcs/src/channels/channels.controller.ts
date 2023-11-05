import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { JwtGuard } from 'src/auth/guards';
import { type } from 'os';

@Controller('channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) {}

    @UseGuards(JwtGuard)
    @Post('add-new-channel')
    addNewChannel(@Body() dto: { channelName: string,  description: string , owner: string, type: number, password?: string}) {
        return this.channelsService.addNewChannel(dto);
    }
}
