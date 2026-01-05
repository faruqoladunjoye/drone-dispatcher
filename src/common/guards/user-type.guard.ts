import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredUserTypes = this.reflector.get<string[]>(
      'userTypes',
      context.getHandler(),
    );

    if (!requiredUserTypes) {
      return true; // If no userType is specified, allow access
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('This User Cannot Perform This Action');
    }

    // Check if the user's type matches any of the required user types
    if (!requiredUserTypes.includes(user.userType)) {
      throw new ForbiddenException('Access Denied: Invalid user type');
    }

    return true;
  }
}
