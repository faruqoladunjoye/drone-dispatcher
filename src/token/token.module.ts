import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '../common/modules/jwt/jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [ConfigModule, JwtModule, UserModule]
})
export class TokenModule {}
