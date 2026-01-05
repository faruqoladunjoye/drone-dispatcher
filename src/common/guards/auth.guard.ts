import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../modules/jwt/jwt.service';
import { UserType } from '@prisma/client';
import { UserService } from '../../user/user.service';
import { exclude } from '../utils/exclude-field';

type VerifyTokenType = {
  userId: string;
  type: UserType;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('User not authenticated');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const decoded = this.jwtService.verifyToken<VerifyTokenType>(token);
      
      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userService.findUserById(decoded.userId);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Remove sensitive data
      const sanitizedUser = exclude(user, ['password']);
      request.user = sanitizedUser;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
