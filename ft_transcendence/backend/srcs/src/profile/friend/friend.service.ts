import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import getUserFromId from 'src/utils/get-user-from-id';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}
  async sendFriendRequest(user: User, recieverId: number) {
    const friendReqSendedCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        sendFriendRequestsTo: {
          where: {
            id: recieverId,
          },
        },
      },
    });
    const friendReqRecievedCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        recievedFriendRequestsBy: {
          where: {
            id: recieverId,
          },
        },
      },
    });
    if (!friendReqSendedCheck || !friendReqRecievedCheck) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (
      friendReqSendedCheck.sendFriendRequestsTo.length > 0 ||
      friendReqRecievedCheck.recievedFriendRequestsBy.length > 0
    ) {
      return {
        status: 400,
        message: 'Friend request already sent or recieved',
      };
    } else if (recieverId === user.id) {
      return {
        status: 400,
        message: 'You cannot add yourself',
      };
    }
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sendFriendRequestsTo: {
          connect: {
            id: recieverId,
          },
        },
      },
    });
    return {
      status: 200,
      message: 'Friend request sended',
    };
  }
  async acceptFriendRequest(user: User, senderId: number) {
    const friendReqRecievedCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        recievedFriendRequestsBy: {
          where: {
            id: senderId,
          },
        },
      },
    });
    if (!friendReqRecievedCheck) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (friendReqRecievedCheck.recievedFriendRequestsBy.length === 0) {
      return {
        status: 400,
        message: 'Friend request not found',
      };
    } else if (senderId === user.id) {
      return {
        status: 400,
        message: 'You cannot add yourself',
      };
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          sendFriendRequestsTo: {
            disconnect: {
              id: senderId,
             },
          },
          recievedFriendRequestsBy: {
            disconnect: {
              id: senderId,
            },
          },
          friends: {
            connect: {
              id: senderId,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id: senderId,
        },
        data: {
          friends: {
            connect: {
              id: user.id,
            },
          },
        },
      }),
    ]);
    return {
      status: 200,
      message: 'Friend request accepted',
    };
  }
}
