import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { SaveTokenDto } from './token.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '../common/modules/jwt/jwt.service';

type JwtTokenPayload = {
    userId: string,
    type: TokenType;
    iat: number;
    exp: number;
};
@Injectable()
export class TokenService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    private async convertDaysToISO(days) {
        const now = new Date();
        now.setDate(now.getDate() + days);
        return now.toISOString();
    }

    async saveToken(payload: SaveTokenDto) {
        return this.prismaService.token.create({
            data: {
                expiresAt: payload.expiresAt,
                token: String(payload.token),
                type: payload.type,
                blackList: payload.blackList,
                userId: payload.userId,
            }
        });
    }

    async generateAuthToken(userId: string) {
        const jwtExpiresIn = Number(this.configService.get('JWT_EXPIRES_IN'));

        const accessToken = this.jwtService.generateToken(
            { userId, type: TokenType.ACCESS },
            { expiresIn: jwtExpiresIn },
        );

        const jwtRefreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN');

        const refreshToken = this.jwtService.generateToken(
            { userId, type: TokenType.REFRESH },
            { expiresIn: jwtRefreshExpiresIn },
        );

        const days = parseInt(jwtRefreshExpiresIn.replace('d', ''), 10);
        const isoDate = await this.convertDaysToISO(days);

        await this.saveToken({
            expiresAt: new Date(isoDate),
            token: refreshToken,
            type: TokenType.REFRESH,
            userId: userId,
        });

        return {
            access: {
                token: accessToken,
                expires: jwtExpiresIn,
            },
            refresh: {
                token: refreshToken,
                expires: isoDate,
            }
        };
    }

    async verifyToken(token: string, type: TokenType) {
        const payload = this.jwtService.verifyToken(token) as JwtTokenPayload;
        const tokenRecord = await this.prismaService.token.findFirst({
            where: {
                token,
                type,
                blackList: false,
                userId: payload.userId,
            }
        });

        if (!tokenRecord) throw new NotFoundException('token not found');

        // update token to blacklisted
        await this.prismaService.token.update({
            where: { token },
            data: { blackList: true },
        });

        return tokenRecord;
    }

    async deleteToken(token: string, blackList: boolean, tokenType: TokenType) {
        const tokenRecord = await this.prismaService.token.findFirst({
            where: {
                token,
                type: tokenType,
                blackList,
            }
        });

        if (!tokenRecord) throw new NotFoundException('token not found');

        await this.prismaService.token.delete({
            where: { token },
        });
        return;
    };
}
