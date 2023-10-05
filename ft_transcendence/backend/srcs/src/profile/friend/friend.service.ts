import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
    constructor(private prisma: PrismaService) {}
    async sendFriendRequest(user: User, recieverId: number) {
        const friendReqSendedCheck = await this.prisma.user.findUnique({
            where: {
                id: recieverId,
            },
            include: {
                sendFriendRequestsTo: {
                    where: {
                        id: user.id
                    },
                }
            }
        });
        const friendReqRecievedCheck = await this.prisma.user.findUnique({
            where: {
                id: recieverId,
            },
            include: {
                recievedFriendRequestsBy: {
                    where: {
                        id: user.id
                    },
                }
            }
        });
        if (!friendReqSendedCheck || !friendReqRecievedCheck) {
            return {
                status: 404,
                message: 'User not found'
            }
        }
        else if (friendReqSendedCheck.sendFriendRequestsTo.length > 0 || friendReqRecievedCheck.recievedFriendRequestsBy.length > 0) {
            return {
                status: 400,
                message: 'Friend request already sent or recieved'
            }
        }
        else if (friendReqSendedCheck.id === user.id) {
            return {
                status: 400,
                message: 'You cannot add yourself'
            }
        }
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                sendFriendRequestsTo: {
                    connect: {
                        id: recieverId
                    }
                }
            }
        });
        return {
            status: 200,
            message: 'Friend request sended'
        }
    }
}
