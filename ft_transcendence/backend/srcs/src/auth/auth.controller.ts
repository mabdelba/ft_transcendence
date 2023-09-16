import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { FtOauthGuard, GoogleOauthGuard } from './guards';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOauthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user as User);
  }
  @Get('ft')
  @UseGuards(FtOauthGuard)
  ftAuth() {}

  @Get('ft-redirect')
  @UseGuards(FtOauthGuard)
  ftAuthRedirect(@Req() req) {
    return this.authService.ftLogin(req.user as User);
  }
}
