import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { get } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAchievementFromId } from 'src/utils/get-achievement-from-id';

@Injectable()
export class AchievementsService {
  constructor(private prismaService: PrismaService) {}
  async getAllAchievementsAcquired(user: User) {
    try{
      const achievements = await this.prismaService.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          achievements: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
      return achievements;
    } catch (e) {
       new ForbiddenException('User not found')
    }
  }

  async getAllAchievementsUnacquired(user: User) {
    try{
      const achievements = await this.prismaService.achievement.findMany({
        where: {
          NOT: {
            users: {
              some: {
                id: user.id,
              },
            },
          },
        },
        select: {
          name: true,
          description: true,
        },
      });
      return achievements;
    } catch (e) {
       new ForbiddenException('User not found')
    }
  }

  async checkIfAchievements(userId: number, achievementId: number) {
    try{
      const checkIfAcquired = await this.prismaService.achievement.findUnique({
        where: {
          id: achievementId,
        },
        select: {
          users: {
            where: {
              id: userId,
            },
          },
        },
      });
      if (!checkIfAcquired.users[0]) {
        await this.prismaService.achievement.update({
          where: {
            id: achievementId,
          },
          data: {
            users: {
              connect: {
                id: userId,
              },
            },
          },
        });
        return (
          'You have acquired the achievement: ' + (await getAchievementFromId(achievementId)).name
        );
      } else
        return (
          'You already have the achievement: ' + (await getAchievementFromId(achievementId)).name
        );
    } catch (e) {
       new ForbiddenException('User not found')
    }
  }
  async checkIfAchievementsAcquired(user: User) {
    try{
      if (user.numberOfGamesPlayed == 1) return await this.checkIfAchievements(user.id, 0);
      if (user.level < 5 && user.level > 0) return await this.checkIfAchievements(user.id, 1);
      else if (user.level < 10 && user.level >= 5) return await this.checkIfAchievements(user.id, 6);
      else if (user.level < 15 && user.level >= 10) return await this.checkIfAchievements(user.id, 7);
      else if (user.level < 22 && user.level >= 15) return await this.checkIfAchievements(user.id, 8);
      else if (user.level < 30 && user.level >= 22) return await this.checkIfAchievements(user.id, 9);
      else if (user.level < 40 && user.level >= 30)
        return await this.checkIfAchievements(user.id, 10);
      else if (user.level < 50 && user.level >= 40)
        return await this.checkIfAchievements(user.id, 11);
      else if (user.level < 55 && user.level >= 50)
        return await this.checkIfAchievements(user.id, 12);
      else if (user.level < 60 && user.level >= 55)
        return await this.checkIfAchievements(user.id, 13);
      else if (user.level < 66 && user.level >= 60)
        return await this.checkIfAchievements(user.id, 14);
      else if (user.level < 70 && user.level >= 66)
        return await this.checkIfAchievements(user.id, 15);
      else if (user.level < 77 && user.level >= 70)
        return await this.checkIfAchievements(user.id, 16);
      else if (user.level < 80 && user.level >= 77)
        return await this.checkIfAchievements(user.id, 17);
      else if (user.level < 88 && user.level >= 80)
        return await this.checkIfAchievements(user.id, 18);
      else if (user.level < 90 && user.level >= 88)
        return await this.checkIfAchievements(user.id, 19);
      else if (user.level < 99 && user.level >= 90)
        return await this.checkIfAchievements(user.id, 20);
      else if (user.level < 100 && user.level >= 99)
        return await this.checkIfAchievements(user.id, 21);
      else if (user.level == 100) return await this.checkIfAchievements(user.id, 22);
    } catch (e) {
       new ForbiddenException('User not found')
    }
  }
}
