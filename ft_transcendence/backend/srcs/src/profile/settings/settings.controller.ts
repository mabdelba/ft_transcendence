import { Controller, Put, Req, UseGuards, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtGuard } from 'src/auth/guards';
import { User } from '@prisma/client';

@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) {}
    @Put('update-login')
    @UseGuards(JwtGuard)
    async updateLogin(@Req() req, @Body() dto: { login: string }) {
        return this.settingsService.updateLogin(req.user as User, dto.login);
    }

    @Put('update-email')
    @UseGuards(JwtGuard)
    async updateEmail(@Req() req, @Body() dto: { email: string }) {
        return this.settingsService.updateEmail(req.user as User, dto.email);
    }
    @Put('update-firstname')
    @UseGuards(JwtGuard)
    async updateFirstname(@Req() req, @Body() dto: { firstname: string }) {
        return this.settingsService.updateFirstname(req.user as User, dto.firstname);
    }
    @Put('update-lastname')
    @UseGuards(JwtGuard)
    async updateLastname(@Req() req, @Body() dto: { lastname: string }) {
        return this.settingsService.updateLastname(req.user as User, dto.lastname);
    }
    @Put('enable-2fa')
    @UseGuards(JwtGuard)
    async enable2fa(@Req() req) {
        return this.settingsService.enable2fa(req.user as User);
    }
    @Put('disable-2fa')
    @UseGuards(JwtGuard)
    async disable2fa(@Req() req) {
        return this.settingsService.disable2fa(req.user as User);
    }
}
