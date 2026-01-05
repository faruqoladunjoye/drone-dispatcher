import { Module } from '@nestjs/common';
import { DroneController } from './drone.controller';
import { DroneService } from './drone.service';
import { UserModule } from '../user/user.module';
import { PaginationService } from '../common/utils/paginator';

@Module({
  imports: [UserModule],
  controllers: [DroneController],
  providers: [DroneService, PaginationService],
  exports: [DroneService]
})
export class DroneModule {}
