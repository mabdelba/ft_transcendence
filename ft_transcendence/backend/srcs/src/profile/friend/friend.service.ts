import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { getAvatarUrlFromLogin } from 'src/utils/get-avatar-from-login';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}
  

  async getFriendList(user: User) {
    try{
    const friendList = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        friends: {
          select: {
            id: true,
            login: true,
            avatar: true,
          },
        },
      },
    });
    const updatedFriendList = await Promise.all(
      friendList.friends.map(async (friend) => {
        const avatarUrl = getAvatarUrlFromLogin(friend.login, friend.avatar);
        return { ...friend, avatarUrl };
      })
    );
  
    return { ...friendList, friends: updatedFriendList };
    } catch (e) {
      throw new ForbiddenException('User not found');
    }
  }

  async getFriendRequestsList(user: User) {
    try{
    const friendRequestsList = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        recievedFriendRequestsBy: {
          select: {
            id: true,
            login: true,
            avatar: true,
          },
        },
      },
    });
    const updatedFriendReqList = await Promise.all(
      friendRequestsList.recievedFriendRequestsBy.map(async (friend) => {
        const avatarUrl = getAvatarUrlFromLogin(friend.login, friend.avatar);
        return { ...friend, avatarUrl };
      })
      );
      // console.log("this is friendRequestsList", updatedFriendReqList);
    return { ...friendRequestsList, recievedFriendRequestsBy: updatedFriendReqList };
    } catch (e) {
      throw new ForbiddenException('User not found');
    }
  }

  async getBlockedUserList(user: User) {
    try{
    const blockedUserList = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        blockedList: {
          select: {
            id: true,
            login: true,
            avatar: true,
          },
        },
      },
    });
    const updatedFriendBlockedList = await Promise.all(
      blockedUserList.blockedList.map(async (friend) => {
        const avatarUrl = getAvatarUrlFromLogin(friend.login, friend.avatar);
        return { ...friend, avatarUrl };
      })
    );
    return { ...blockedUserList, blockedList: updatedFriendBlockedList };
    } catch (e) {
      throw new ForbiddenException('User not found');
    }
  }

  async sendFriendRequest(user: User, recieverId: number) {
    try{
      const alreadyFriendsCheck = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          friends: {
            where: {
              id: recieverId,
            },
          },
        },
      });
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
      } else if (alreadyFriendsCheck.friends.length > 0) {
        return {
          status: 400,
          message: 'You are already friends',
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
    } catch (e) {
      throw new ForbiddenException('User not found');
    }
  }
  async acceptFriendRequest(user: User, senderId: number) {
      try{const friendReqRecievedCheck = await this.prisma.user.findUnique({
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
      };} catch (e) {
         throw new ForbiddenException('User not found');
      }
  }
  async rejectFriendRequest(user: User, senderId: number) {
    try
    {const friendReqRecievedCheck = await this.prisma.user.findUnique({
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
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          recievedFriendRequestsBy: {
            disconnect: {
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
          sendFriendRequestsTo: {
            disconnect: {
              id: user.id,
            },
          },
        },
      }),
    ]);

    return {
      status: 200,
      message: 'Friend request rejected',
    };} catch (e) {
       throw new ForbiddenException('User not found');
    }
  }
  async removeFriend(user: User, friendId: number) {
    try{
    const alreadyFriendsCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        friends: {
          where: {
            id: friendId,
          },
        },
      },
    });
    if (!alreadyFriendsCheck) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (alreadyFriendsCheck.friends.length === 0) {
      return {
        status: 400,
        message: 'You are not friends',
      };
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          friends: {
            disconnect: {
              id: friendId,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id: friendId,
        },
        data: {
          friends: {
            disconnect: {
              id: user.id,
            },
          },
        },
      }),
    ]);
    return {
      status: 200,
      message: 'Friend removed',
    };
  } catch (e) {
    throw new ForbiddenException('User not found');
  }
  }
  async blockUser(user: User, userId: number) {
    try{
    const alreadyBlockedCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        blockedList: {
          where: {
            id: userId,
          },
        },
      },
    });
    if (!alreadyBlockedCheck) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (alreadyBlockedCheck.blockedList.length > 0) {
      return {
        status: 400,
        message: 'User already blocked',
      };
    } else if (userId === user.id) {
      return {
        status: 400,
        message: 'You cannot block yourself',
      };
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          blockedList: {
            connect: {
              id: userId,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blockedBy: {
            connect: {
              id: user.id,
            },
          },
        },
      }),
    ]);
    this.removeFriend(user, userId);
    this.rejectFriendRequest(user, userId);
    return {
      status: 200,
      message: 'User blocked',
    };
  } catch (e) {
    throw new ForbiddenException('User not found');
  }
  }
  async unblockUser(user: User, userId: number) {
    try{
    const alreadyBlockedCheck = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        blockedList: {
          where: {
            id: userId,
          },
        },
      },
    });
    if (!alreadyBlockedCheck) {
      return {
        status: 404,
        message: 'User not found',
      };
    } else if (alreadyBlockedCheck.blockedList.length === 0) {
      return {
        status: 400,
        message: 'User not blocked',
      };
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          blockedList: {
            disconnect: {
              id: userId,
            },
          },
        },
      }),
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blockedBy: {
            disconnect: {
              id: user.id,
            },
          },
        },
      }),
    ]);
    return {
      status: 200,
      message: 'User unblocked',
    };
  } catch (e) {
    throw new ForbiddenException('User not found');
  }
  }
}
