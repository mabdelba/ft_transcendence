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
      return { id: null, me: null, other: null, myScore: null, otherScore: null };
    }
    const me = await getUserFromId(
      matchesPlayedByUser.player1Id == user.id
        ? matchesPlayedByUser.player1Id
        : matchesPlayedByUser.player2Id,
    );
    const other = await getUserFromId(
      matchesPlayedByUser.player2Id == user.id
        ? matchesPlayedByUser.player1Id
        : matchesPlayedByUser.player2Id,
    );

    return {
      id: matchesPlayedByUser.id,
      me: me.login,
      other: other.login,
      myScore:
        me.id == matchesPlayedByUser.player1Id
          ? matchesPlayedByUser.scoreOfPlayer1
          : matchesPlayedByUser.scoreOfPlayer2,
      otherScore:
        other.id == matchesPlayedByUser.player1Id
          ? matchesPlayedByUser.scoreOfPlayer1
          : matchesPlayedByUser.scoreOfPlayer2,
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
