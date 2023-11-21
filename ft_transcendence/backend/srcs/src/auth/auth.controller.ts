import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { FtOauthGuard, GoogleOauthGuard, JwtGuard } from './guards';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from './utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private prisma: PrismaService) {}

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

  @Get('ft-redirect')
  @UseGuards(FtOauthGuard)
  ftAuthRedirect(@Req() req) {
    try {
      return this.authService.ftLogin(req.user as User);
    } catch (e) {
      new UnauthorizedException('Invalid authorization grant');
    }
  }

  @UseGuards(JwtGuard)
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: 'public/avatars',
        filename: (req, file, cb) => {
          const user = req.user as User;
          cb(null, user.login + '.jpg');
        },
      }),
    }),
  )
  async uploadFile(
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder().addFileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }).build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    avatar: Express.Multer.File,
  ) {
    await this.prisma.user.update({
      where: {
        login: req.user['login'],
      },
      data: {
        avatar: avatar.path,
      },
    });
    return avatar.path;
  }

  @UseGuards(JwtGuard)
  @Get('ft-avatar')
  async uploadImage(@Req() req) {
    return this.authService.uploadFtAvatar(req.user as User);
  }

  // @UseGuards(JwtGuard)
  @Post('regenerate-token')
  async regenerateToken(@Body() dto: { id; login }) {
    return await this.authService.getToken(dto.id, dto.login);
  }
}
