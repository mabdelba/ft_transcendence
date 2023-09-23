import { Controller, Post, UseGuards, Req, Get, Body } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { JwtGuard } from 'src/auth/guards';
import { Request } from 'express';
import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyDto } from './dto';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(private twoFactorAuthService: TwoFactorAuthService) {}
  @Get('qrcode')
  @UseGuards(JwtGuard)
  generateQrCode(@Req() req: Request) {
    const qrcode = this.twoFactorAuthService.generateQrCode(req.user as User);
    return qrcode;
  }

  @Post('verify')
  @UseGuards(JwtGuard)
  twoFactorAuth(@Body() dto: VerifyDto , @Req() req: Request) {
    return this.twoFactorAuthService.verify(dto, req.user as User);
  }
}
