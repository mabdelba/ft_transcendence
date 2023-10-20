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

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ChatModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TwoFactorAuthModule,
    ProfileModule,
    AchievementsModule,
  ],
  controllers: [AppController],
  providers: [AppService, StateGateway],
})
export class AppModule {}
