import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TwoFactorAuthService {
    static secret: speakeasy.GeneratedSecret;

    constructor(private prisma: PrismaService) {
        
    }
    async generateQrCode(user: User) {
        TwoFactorAuthService.secret = speakeasy.generateSecret({
            name: 'ft_transcendence',
        });
        const userUpdate = await this.prisma.user.update({
            where: { id: user.id },
            data: { twoFA_Secret: TwoFactorAuthService.secret.base32 },
        });
        user.twoFA_Secret = TwoFactorAuthService.secret.base32;
        console.log(TwoFactorAuthService.secret);
        return new Promise((resolve, reject) => {
            qrcode.toDataURL(TwoFactorAuthService.secret.otpauth_url, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
    verify(code, user: User) {
        console.log(code);
        const secret = user.twoFA_Secret;
        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: code,
        });
        console.log(verified);
    }
}
