import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, ForgotPassword, ResetPassword,ChangePasswordDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() body: SignupDto) {
        return await this.authService.signUp(body);
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return await this.authService.login(body);
    }
}
