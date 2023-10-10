import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards';

@Controller('achievements')
export class AchievementsController {
    constructor(private achivementsService: AchievementsService) {}
    @Post('check-if-acquired')
    @UseGuards(JwtGuard)
    checkIfAcquired(@Req() req) {
        return this.achivementsService.checkIfAchievementsAcquired(req.user as User);
    }

    @Get('all-acquired')
    @UseGuards(JwtGuard)
    getAllAcquired(@Req() req) {
        return this.achivementsService.getAllAchievementsAcquired(req.user as User);
    }

    @Get('all-unacquired')
    @UseGuards(JwtGuard)
    getAllUnacquired(@Req() req) {
        return this.achivementsService.getAllAchievementsUnacquired(req.user as User);
    }
}
