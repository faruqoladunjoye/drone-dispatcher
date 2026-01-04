import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DroneModule } from './drone/drone.module';
import { MedicationModule } from './medication/medication.module';

@Module({
  imports: [UserModule, AuthModule, DroneModule, MedicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
