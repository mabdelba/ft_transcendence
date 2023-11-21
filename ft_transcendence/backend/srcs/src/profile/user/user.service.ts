import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { get } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarUrlFromLogin } from 'src/utils/get-avatar-from-login';
import { getUserFromLogin } from 'src/utils/get-user-from-id';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getAllUsers(user: User){
    const test = await this.prisma.user.findMany({
      select:{
        login: true,
      }
    });
    test['avatarUrl'] = getAvatarUrlFromLogin(user.login, user.avatar);
    return test;
  }
  async getMe(login: string) {
    const user =  await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    user['avatarUrl'] = getAvatarUrlFromLogin(user.login, user.avatar);
    return user;
  }
  async getRelation(user: User, userLogin: string) {
    if (user.login === userLogin) {
      return -1;
    }
    const other = await getUserFromLogin(userLogin);
    const friendCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        friends: {
          where: {
            id: other.id,
          },
        },
      },
    });
    if (friendCheck.friends.length) {
      return 1;
    }
    const friendRequestRecievedCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        recievedFriendRequestsBy: {
          where: {
            id: other.id,
          },
        },
      },
    });
    if (friendRequestRecievedCheck.recievedFriendRequestsBy.length) {
      return 2;
    }
    const friendRequestSentCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        sendFriendRequestsTo: {
          where: {
            id: other.id,
          },
        },
      },
    });
    if (friendRequestSentCheck.sendFriendRequestsTo.length) {
      return 3;
    }
    const blockedCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        blockedList: {
          where: {
            id: other.id,
          },
        },
      },
    });
    if (blockedCheck.blockedList.length) {
      return 4;
    }
    const blockedByCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        blockedBy: {
          where: {
            id: other.id,
          },
        },
      },
    });
    if (blockedByCheck.blockedBy.length) {
      return 5;
    }
    return 0;
  }
}
