import { Controller, Post, Req, UseGuards } from '@nestjs/common';
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
}
