import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async getMe(login: string) {
    return await this.prismaService.user.findUnique({
      where: {
        login,
      },
    });
  }
}
