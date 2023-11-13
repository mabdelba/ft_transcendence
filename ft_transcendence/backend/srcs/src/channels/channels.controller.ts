import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { JwtGuard } from 'src/auth/guards';
import { User } from '@prisma/client';

@Controller('channels')
export class ChannelsController {
    constructor(private channelsService: ChannelsService) {}

    @UseGuards(JwtGuard)
    @Post('add-new-channel')
    addNewChannel(@Req() req,@Body() dto: { channelName: string , type: number, password?: string}) {
        return this.channelsService.addNewChannel((req.user as User).login, dto);
    }
    @UseGuards(JwtGuard)
    @Post('add-user-to-channel')
    addUserToChannel(@Req() req, @Body() dto: { channelName: string, user: string }) {
        return this.channelsService.addNewUserToChannel((req.user as User).login, dto);
    }

    @UseGuards(JwtGuard)
    @Post('add-admin-to-channel')
    addAdminToChannel(@Req() req, @Body() dto: { channelName: string, user: string }) {
        return this.channelsService.addAdminToChannel((req.user as User).login, dto);
    }
    @UseGuards(JwtGuard)
    @Post('channel-members')
    getChannelMembers(@Req() req,@Body() dto: { channelName: string, user: string }) {
        return this.channelsService.listChannelMembers((req.user as User).login, dto);
    }
    @UseGuards(JwtGuard)
    @Post('friend-list-for-channel')
    getFriendListForChannel(@Req() req,@Body() dto: { channelName: string, user: string }) {
        return this.channelsService.listFriendsForChannel(dto);
    }
}
