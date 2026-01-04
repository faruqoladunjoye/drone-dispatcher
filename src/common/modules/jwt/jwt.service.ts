import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private jwtService: NestJwtService,
    private configService: ConfigService,
  ) {}
  /**
   * Generates a JWT token.
   * @param payload The payload to encode in the token.
   * @param options Optional sign options.
   */
  generateToken(
    payload: Record<string, any>,
    options?: { expiresIn?: string | number },
  ): string {
    const signOptions: any = { ...options, algorithm: 'HS256' };
    return this.jwtService.sign(payload, signOptions);
  }

  /**
   * Verifies a JWT token.
   * @param token The token to verify.
   * @returns Decoded token if valid.
   */
  verifyToken<T>(token: string): T {
    try {
      return this.jwtService.verify(token) as T;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Decodes a JWT token without verification.
   * @param token The token to decode.
   * @returns Decoded payload.
   */
  decodeToken<T>(token: string): T {
    return this.jwtService.decode(token) as T;
  }
}