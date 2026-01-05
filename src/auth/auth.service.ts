import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { isPasswordMatch } from '../common/utils/compare-password';
import { UserType } from '@prisma/client';
import { TokenService } from '../token/token.service';
import * as bcryptjs from 'bcryptjs';
import { exclude } from '../common/utils/exclude-field';
@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name);
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private tokenService: TokenService,
    ) {}

    private async checkEmail(email: string) {
        return !!(await this.userService.findUserByEmail(email));
    }

    async signUp(payload: SignupDto) {
        const checkEmail = await this.checkEmail(payload.email);

        if (checkEmail) throw new BadRequestException('Email already exists');

        const saltRounds = Number(this.configService.get('PASSWORD_SALT')) || 10;

        const salt = bcryptjs.genSaltSync(saltRounds);
        const hashedPassword = bcryptjs.hashSync(
            payload.password,
            salt,
        );

        const user = await this.userService.createUser({
            password: hashedPassword,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
        });

        return user;
    }

    async login(body: LoginDto) {
        const user = await this.userService.findUserByEmail(body.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await isPasswordMatch(body.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('invalid credentials');

        const token = await this.tokenService.generateAuthToken(user.id);

        if (user.userType === UserType.ADMIN) {
            return {
                ...exclude(user, ['password']),
                accessToken: token.access.token,
                refreshToken: token.refresh.token,
                tokenType: 'Bearer',
            };
        }
        return {
            ...exclude(user, ['password']),
            token,
        };
    }
}
