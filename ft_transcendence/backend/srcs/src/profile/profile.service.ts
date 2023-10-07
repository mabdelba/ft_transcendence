import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {getUserFromId, getUserFromLogin} from 'src/utils/get-user-from-id';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async getLastMatchPlayed(login: string) {
    const matchesPlayedByUser = await this.prisma.game.findFirst({
      where: {
        OR: [{ player1: { login: login } }, { player2: { login: login } }],
      },
      orderBy: {
        dateOfGame: 'desc',
      },
    });
    if (!matchesPlayedByUser) {
      return { id: null, me: null, other: null, myScore: null, otherScore: null };
    }
    const user = getUserFromLogin(login);
    const me = await getUserFromId(
      matchesPlayedByUser.player1Id == (await user).id
        ? matchesPlayedByUser.player1Id
        : matchesPlayedByUser.player2Id,
    );
    const other = await getUserFromId(
      matchesPlayedByUser.player2Id == (await user).id
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

  async getLastAchievement(login: string) {
    const achievements = await this.prisma.user.findMany({
      where: {
        login,
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
