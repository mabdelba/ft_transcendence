import {Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FtOauthGuard extends AuthGuard('42') {
    constructor() {
        super();
    }
}