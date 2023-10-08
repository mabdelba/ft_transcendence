import { Controller, Post, Body, Get, UseGuards, Req, StreamableFile, Res } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { getUserFromLogin } from 'src/utils/get-user-from-id';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me-from-token')
  getMeFromToken(@Req() req: Request) {
    return req.user as User;
  }

  @UseGuards(JwtGuard)
  @Post('me')
  getMe(@Body() dto: { userLogin: string }) {
    return this.userService.getMe(dto.userLogin);
  }

  @UseGuards(JwtGuard)
  @Post('avatar')
  async getAvatar(@Body() dto: { userLogin: string }, @Res({ passthrough: true }) res: Response) {
    if (dto.userLogin) {
      const user = await getUserFromLogin(dto.userLogin);
      if (user.avatar !== null) {
        const file = createReadStream(join(__dirname, `../../../public/avatars/${user.login}.jpg`));
        res.set('Content-Type', 'image/jpeg');
        return new StreamableFile(file);
      } else {
        const file = createReadStream(join(__dirname, `../../../public/avatars/avatar.png`));
        res.set('Content-Type', 'image/jpeg');
        return new StreamableFile(file);
      }
    } else {
      return { error: 'userLogin is undefined' };
    }
  }
}
