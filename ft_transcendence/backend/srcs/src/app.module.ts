import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';
import { StateGateway } from './state/state.gateway';
import { AchievementsModule } from './achievements/achievements.module';
import { StateModule } from './state/state.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { GameGateway } from './game/game.gateway';
import { ChannelsModule } from './channels/channels.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    PrismaModule,
    ChatModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TwoFactorAuthModule,
    ProfileModule,
    AchievementsModule,
    StateModule,
    ScheduleModule.forRoot(),
    ChannelsModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, StateGateway, GameGateway, TasksService],
})
export class AppModule {}
