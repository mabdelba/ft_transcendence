import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('game')
export class GameController {
    constructor(private prisma: PrismaService) {}
    // @UseGuards(JwtGuard)
    // @Post('add-game')
    // async addNewGame(@Body() dto: { userLogin: string, opponentLogin: string, scoreP1: number, scoreP2: number }) {
    //     try {
    //         await this.prisma.game.create({
    //             data: {
    //                 player1Login: dto.userLogin,
    //                 player2Login: dto.opponentLogin,
    //                 scoreOfPlayer1: dto.scoreP1,
    //                 scoreOfPlayer2: dto.scoreP2,
    //             },
    //         });
    //         await this.prisma.user.update({
    //             where: {
    //                 login: dto.userLogin,
    //             },
    //             data: {
    //                 numberOfGamesPlayed: {
    //                     increment: 1,
    //                 }, 
    //             },
    //             }
    //         );
    //         await this.prisma.user.update({
    //             where: {
    //                 login: dto.opponentLogin,
    //             },
    //             data: {
    //                 numberOfGamesPlayed: {
    //                     increment: 1,
    //                 }, 
    //             },
    //             }
    //         );
    //     }
    //     catch (e) {
    //         return { status: 'error' };
    //     }
    // } 
}
