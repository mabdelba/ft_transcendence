import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementsService {
    constructor(private prismaService:PrismaService) {}
    async checkIfAchievementsAcquired(user: User) {
        if (user.numberOfGamesPlayed >= 1)
        {
            const checkIfAcquired = await this.prismaService.achievement.findUnique({
                where: {
                    id: 4
                },
                select: {
                    users: {
                        where: {
                            id: user.id
                        }
                    }
                }
            });
            if (!checkIfAcquired.users[0])
            {
                await this.prismaService.achievement.update({
                    where: {
                        id: 4
                    },
                    data: {
                        users: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                });
                return "You have acquired the achievement: 'First Game Played'"
            }
            else
                return "You already have this achievement"
        }
    }
}
