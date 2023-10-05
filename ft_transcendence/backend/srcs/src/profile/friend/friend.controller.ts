import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtGuard } from 'src/auth/guards';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller('friend')
export class FriendController {
    constructor(private friendService: FriendService) {}
    @Post('send-friend-request')
    @UseGuards(JwtGuard)
    addFriend(@Req() req: Request, @Body() dto: {recieverId: number}){
        return this.friendService.sendFriendRequest(req.user as User, dto.recieverId);
    }
}
