import {Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
    constructor(config: ConfigService) {
        super({
            accessType: 'offline',
        });
    }
}