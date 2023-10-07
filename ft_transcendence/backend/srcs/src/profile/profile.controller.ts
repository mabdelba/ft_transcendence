import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @UseGuards(JwtGuard)
  @Post('last-match-played')
  getLastMatchPlayed(@Body() dto: { userLogin: string }) {
    return this.profileService.getLastMatchPlayed(dto.userLogin);
  }
  @UseGuards(JwtGuard)
  @Post('last-achievement')
  getLastAchievement(@Body() dto: { userLogin: string }) {
    return this.profileService.getLastAchievement(dto.userLogin);
  }
}
