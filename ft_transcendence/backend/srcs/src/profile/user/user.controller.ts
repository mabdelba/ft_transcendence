import { Controller, Post, Body, Get, UseGuards, Req, StreamableFile, Res } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { getUserFromLogin } from 'src/utils/get-user-from-id';
import { getAvatarFromLogin, getAvatarUrlFromLogin } from 'src/utils/get-avatar-from-login';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me-from-token')
  getMeFromToken(@Req() req: Request) {
    const user = req.user as User;
    user['avatarUrl'] = getAvatarUrlFromLogin(user.login, user.avatar);
    return user;
  }

  @UseGuards(JwtGuard)
  @Post('me')
  getMe(@Body() dto: { userLogin: string }) {
    return this.userService.getMe(dto.userLogin);
  }

  @UseGuards(JwtGuard)
  @Post('check-relation')
  getRelation(@Req() req: Request, @Body() dto: { userLogin: string }) {
    return this.userService.getRelation(req.user as User, dto.userLogin);
  }

  @UseGuards(JwtGuard)
  @Post('avatar')
  async getAvatar(@Body() dto: { userLogin: string }) {
    if (dto.userLogin === null) return null;
    return getAvatarFromLogin(dto.userLogin);
  }
}
