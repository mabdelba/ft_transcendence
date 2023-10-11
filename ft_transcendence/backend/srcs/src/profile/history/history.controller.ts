import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtGuard } from 'src/auth/guards';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}
  @Get()
  @UseGuards(JwtGuard)
  getAllMatchesPlayed(@Req() req) {
    return this.historyService.getAllMatchesPlayed(req.user.login);
  }
}
