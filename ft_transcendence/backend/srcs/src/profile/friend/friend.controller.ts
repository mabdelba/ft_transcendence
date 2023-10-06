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
  addFriend(@Req() req: Request, @Body() dto: { recieverId: number }) {
    return this.friendService.sendFriendRequest(req.user as User, dto.recieverId);
  }

  @Post('accept-friend-request')
  @UseGuards(JwtGuard)
  acceptFriendRequest(@Req() req: Request, @Body() dto: { senderId: number }) {
    return this.friendService.acceptFriendRequest(req.user as User, dto.senderId);
  }

  @Post('reject-friend-request')
  @UseGuards(JwtGuard)
  rejectFriendRequest(@Req() req: Request, @Body() dto: { senderId: number }) {
    return this.friendService.rejectFriendRequest(req.user as User, dto.senderId);
  }
  @Post('remove-friend')
  @UseGuards(JwtGuard)
  removeFriend(@Req() req: Request, @Body() dto: { friendId: number }) {
    return this.friendService.removeFriend(req.user as User, dto.friendId);
  }
  @Post('block-user')
  @UseGuards(JwtGuard)
  blockUser(@Req() req: Request, @Body() dto: { userId: number }) {
    return this.friendService.blockUser(req.user as User, dto.userId);
  }
  @Post('unblock-user')
  @UseGuards(JwtGuard)
  unblockUser(@Req() req: Request, @Body() dto: { userId: number }) {
    return this.friendService.unblockUser(req.user as User, dto.userId);
  }
}