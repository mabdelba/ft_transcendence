import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) {}
    async updateLogin(user: User, login: string) {
        try {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { login: login },
        });
    } catch (e) {
        throw new ForbiddenException("Login already exists");
    }
    }
    async updateEmail(user: User, email: string) {
        try {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { email: email },
        });
    } catch (e) {
        throw new ForbiddenException("Email already exists");
    }
    }
    async updateFirstname(user: User, firstname: string) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { firstName: firstname },
        });
    }
    async updateLastname(user: User, lastname: string) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastName: lastname },
        });
    }
    async enable2fa(user: User) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { twoFaActive: true },
        });
    }
    async disable2fa(user: User) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { twoFaActive: false },
        });
    }
}
