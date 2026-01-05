import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';


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
