import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class TwoFactorAuthService {
    constructor() {}
    async verify(user: User) {
        return user;
    }
}
