import { Controller, Post, UseGuards, HttpCode, Req, Get } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtGuard } from 'src/auth/guards';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(private twoFactorAuthService: TwoFactorAuthService) {}
  @Get('qrcode')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  generateQrCode(@Req() req: Request) {
    const qrcode = this.twoFactorAuthService.generateQrCode();
    // console.log(qrcode);
    return qrcode;
  }
  @Post('verify')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  twoFactorAuth(@Req() req: Request) {
    const user: User = req.user as User;
    return this.twoFactorAuthService.verify(user);
  }
}
