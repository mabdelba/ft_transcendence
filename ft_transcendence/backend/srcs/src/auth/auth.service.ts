import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { registerDto } from "./dto";
import * as argon from "argon2";
@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async register(dto: registerDto) {
        const hash = await argon.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                login: dto.login,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                password: hash,
                avatar: dto.avatar,
            }
        });
        return user;
    }   
}