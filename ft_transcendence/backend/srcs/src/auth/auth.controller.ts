import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: registerDto) {
    return this.authService.register(dto);
  }
}
