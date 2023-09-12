import { PrismaService } from '../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: RegisterDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          login: dto.login,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hash,
          avatar: dto.avatar,
          twoFaActive: false,
        },
      });
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        if (e.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });
    if (!user) throw new ForbiddenException('User not found');
    const isPasswordValid = await argon.verify(user.password, dto.password);
    if (!isPasswordValid) throw new ForbiddenException('Wrong password');
    return {
      token: await this.getToken(user.id, user.login),
      twoFaActive: user.twoFaActive,
    };
  }

  getToken(userId: number, userLogin: string): Promise<string> {
    const payload = { login: userLogin, sub: userId };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, { expiresIn: '1d', secret });
  }
}
