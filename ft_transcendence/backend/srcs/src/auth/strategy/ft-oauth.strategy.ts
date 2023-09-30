import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('42_CLIENT_ID'),
      clientSecret: config.get('42_CLIENT_SECRET'),
      callbackURL: config.get('42_CALLBACK_URL'),
      scope: 'public',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      const { id, login, last_name, first_name, email, image } = profile._json;
      return {
        id: id,
        login: login,
        firstName: first_name,
        lastName: last_name,
        email: email,
        avatar: image.link,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid authorization grant');
    }
  }
}
