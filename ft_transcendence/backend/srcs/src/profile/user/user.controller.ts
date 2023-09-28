import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return this.userService.getMe(req.user as User);
  }
}
