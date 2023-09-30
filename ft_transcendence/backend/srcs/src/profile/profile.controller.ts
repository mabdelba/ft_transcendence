import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { ProfileService } from './profile.service';
import { User } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @UseGuards(JwtGuard)
  @Get('last-match-played')
  getLastMatchPlayed(@Req() req) {
    return this.profileService.getLastMatchPlayed(req.user as User);
  }
  @UseGuards(JwtGuard)
  @Get('last-achievement')
  getLastAchievement(@Req() req) {
    return this.profileService.getLastAchievement(req.user as User);
  }
}
