import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

@Injectable()
export class TwoFactorAuthService {
    constructor() {}
    async generateQrCode() {
        const secret = await speakeasy.generateSecret({
            name: 'ft_transcendence',
        });       
        return new Promise((resolve, reject) => {
            qrcode.toDataURL(secret.otpauth_url, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
    async verify(user: User) {
        return user;
    }
}
