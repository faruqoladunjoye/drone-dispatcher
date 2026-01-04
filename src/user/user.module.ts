import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserType } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // create the admin if the admin does not exist
    const adminUser = await this.prismaService.user.findFirst({
      where: { userType: UserType.ADMIN },
    });
    if (!adminUser) {
      // create the admin user
      // Get the salt rounds
      const saltRounds = Number(this.configService.get('PASSWORD_SALT')) || 10;

      // Generate salt and hash password
      const salt = bcryptjs.genSaltSync(saltRounds);
      const hashedPassword = bcryptjs.hashSync(
        'Themilanes@2026',
        salt,
      );

      await this.prismaService.user.create({
        data: {
          email: 'admin@milanes.io',
          firstName: 'Milanes',
          lastName: 'Official',
          password: hashedPassword,
          userType: UserType.ADMIN,
        },
      });
    }
  }
}
