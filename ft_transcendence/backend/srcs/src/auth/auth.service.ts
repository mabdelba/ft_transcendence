import { PrismaService } from '../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { registerDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(dto: registerDto) {
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
}
