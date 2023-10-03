import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { ProfileModule } from './profile/profile.module';
import { StateGateway } from './state/state.gateway';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TwoFactorAuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, StateGateway],
})
export class AppModule {}
