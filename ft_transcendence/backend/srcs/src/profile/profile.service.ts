import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import getUserFromId from 'src/utils/get-user-from-id';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async getLastMatchPlayed(user: User) {
    const matchesPlayedByUser = await this.prisma.game.findFirst({
      where: {
        OR: [{ player1: { login: user.login } }, { player2: { login: user.login } }],
      },
      orderBy: {
        dateOfGame: 'desc',
      },
    });
    if (!matchesPlayedByUser) {
      return null;
    }
    const player1 = await getUserFromId(matchesPlayedByUser.player1Id);
    const player2 = await getUserFromId(matchesPlayedByUser.player2Id);
    return {
      id: matchesPlayedByUser.id,
      player1: player1.login,
      player2: player2.login,
      score1: matchesPlayedByUser.scoreOfPlayer1,
      score2: matchesPlayedByUser.scoreOfPlayer2,
    };
  }

  async getLastAchievement(user: User) {
    const achievements = await this.prisma.user.findMany({
      where: {
        id: user.id,
      },
      select: {
        achievements: {
          take: 6,
          orderBy: {
            id: 'desc',
          },
        },
      },
    });
    if (!achievements) {
      return null;
    }
    return achievements;
  }
}
