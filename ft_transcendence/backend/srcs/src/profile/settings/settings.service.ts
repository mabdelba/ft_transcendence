import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}
  async updateLogin(user: User, login: string) {
    try {
      const imagePath = `public/avatars/${user.login}.jpg`;
      await this.prisma.user.update({
        where: { id: user.id },
        data: { login: login },
      });
      const newFileName = `${login}.jpg`; // New filename
      const newPath = 'public/avatars/' + newFileName;

      // Rename the file (if needed)a
      if (fs.existsSync(imagePath)) {
        // Rename the file
        fs.rename(imagePath, newPath, (error) => {
          if (error) {
            console.error('File rename error:', error);
            throw new Error('File rename failed'); // Handle the error appropriately
          } else {
            console.log('File renamed successfully!');
          }
        });
      } else {
        console.error('Original image file not found');
      }
    } catch (e) {
      throw new ForbiddenException('Login already exists');
    }
  }
  async updateEmail(user: User, email: string) {
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { email: email },
      });
    } catch (e) {
      throw new ForbiddenException('Email already exists');
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
