import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarFromLogin, getAvatarUrlFromLogin } from 'src/utils/get-avatar-from-login';
import { getUserFromId, getUserFromLogin } from 'src/utils/get-user-from-id';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async getLastMatchPlayed(login: string) {
    try{
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
      const me = await getUserFromLogin(
        matchesPlayedByUser.player1Login == (await user).login
          ? matchesPlayedByUser.player1Login
          : matchesPlayedByUser.player2Login,
      );
      const other = await getUserFromLogin(
        matchesPlayedByUser.player2Login == (await user).login
          ? matchesPlayedByUser.player1Login
          : matchesPlayedByUser.player2Login,
      );

      return {
        id: matchesPlayedByUser.id,
        me: me.login,
        other: other.login,
        myAvatar: getAvatarUrlFromLogin(me.login, me.avatar),
        otherAvatar: getAvatarUrlFromLogin(other.login, other.avatar),
        myScore:
          me.login == matchesPlayedByUser.player1Login
            ? matchesPlayedByUser.scoreOfPlayer1
            : matchesPlayedByUser.scoreOfPlayer2,
        otherScore:
          other.login == matchesPlayedByUser.player1Login
            ? matchesPlayedByUser.scoreOfPlayer1
            : matchesPlayedByUser.scoreOfPlayer2,
      };
    } catch (e) {
       new ForbiddenException('User not found');
    }
  }

  async getLastAchievement(login: string) {
    try{
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
    } catch (e) {
       new ForbiddenException('User not found');
    }
  }
}
