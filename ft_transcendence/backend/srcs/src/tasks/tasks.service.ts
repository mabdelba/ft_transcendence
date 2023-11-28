import { ForbiddenException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * * *')
  async checkUnmutedUsersInChannel() {
    try{
    await this.prisma.userMutedInChannel.deleteMany({
      where: {
        dateEnd: {
          lte: new Date(),
        },
      },
    });
  } catch (e) {
     new ForbiddenException('User not found');
  }
  }
}
