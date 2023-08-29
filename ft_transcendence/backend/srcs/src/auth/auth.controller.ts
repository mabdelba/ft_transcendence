import { Controller, Post, Body, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto, loginDto } from './dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: registerDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  login(@Body() dto: loginDto) {
    return this.authService.login(dto);
  }
}
