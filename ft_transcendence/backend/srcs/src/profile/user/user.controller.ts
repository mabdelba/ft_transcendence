import { Controller, Get, UseGuards, Req, StreamableFile, Res } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return this.userService.getMe(req.user as User);
  }

  @UseGuards(JwtGuard)
  @Get('avatar')
  async getFile(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if ((req.user as User).avatar !== null) {
      const file = createReadStream(
        join(__dirname, `../../../public/avatars/${(req.user as User).login}.jpg`),
      );
      res.set('Content-Type', 'image/jpeg');
      return new StreamableFile(file);
    } else {
      const file = createReadStream(
        join(__dirname, `../../../public/avatars/avatar.jpg`),
      );
      res.set('Content-Type', 'image/jpeg');
      return new StreamableFile(file);
    }
  }
}
