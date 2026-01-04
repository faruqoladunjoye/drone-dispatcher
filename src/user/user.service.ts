import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from '../auth/dto/auth.dto';
import { exclude } from '../common/utils/exclude-field';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async findUserByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: { email },
        })
    }

    async findUserById(id: string) {
        if (!id) {
            return null
        }
        const user = await this.prismaService.user.findUnique({ where: { id } })
        return user;
    }

    async createUser(payload: SignupDto) {
        const user = await this.prismaService.user.create({
            data: {
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                password: payload.password,
            }
        });
        return exclude(user, ['password']);
    }
}
