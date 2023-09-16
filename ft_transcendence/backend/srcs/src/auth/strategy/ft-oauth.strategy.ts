import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  private readonly profileURL = 'https://api.intra.42.fr/v2/me';

  constructor(config: ConfigService) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: config.get('42_CLIENT_ID'),
      clientSecret: config.get('42_CLIENT_SECRET'),
      callbackURL: config.get('42_CALLBACK_URL'),
      scope: 'public',
    });
  }

  async validate(accessToken: string) {
    return new Promise<User>((resolve) => {
      this._oauth2.get(this.profileURL, accessToken, (err, body) => {
        const { id, login, last_name, first_name, email, image } = JSON.parse(body.toString());
        const user: User = {
          id: id,
          login: login,
          firstName: first_name,
          lastName: last_name,
          email: email,
          avatar: image.link,
        } as User;
        resolve(user);
      });
    });
  }
}
