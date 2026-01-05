import { Body, Post, Controller, UseGuards, Get, Param } from '@nestjs/common';
import { DroneService } from './drone.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserTypeGuard } from '../common/guards/user-type.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AllowedUserType } from '../common/decorators/user-type.decorator';
import { CreateDroneDto } from './dto/drone.dto';
import { UserType } from '@prisma/client';
import type { User } from '@prisma/client';
import { Paginate } from '../common/decorators/paginator.decorator';
import { PaginationOptions } from '../common/utils/types';

@Controller('drone')
export class DroneController {
    constructor(private droneService: DroneService) {}

    @Post()
    @UseGuards(AuthGuard, UserTypeGuard)
    @AllowedUserType(UserType.ADMIN)
    async registerDrone(@Body() body: CreateDroneDto, @CurrentUser() user: User) {
        return await this.droneService.registerDrone(body);
    }

    @Get('available')
    @UseGuards(AuthGuard, UserTypeGuard)
    async getAvailableDrones(@Paginate() options: PaginationOptions) {
        return await this.droneService.getAvailableDrones(options);
    }

    @Get(':id/medications')
    @UseGuards(AuthGuard, UserTypeGuard)
    async getLoadedMedications(@Param('id') droneId: string) {
        return await this.droneService.getLoadedMedications(droneId);
    }

    @Get(':id/battery')
    @UseGuards(AuthGuard, UserTypeGuard)
    async getBatteryLevel(@Param('id') droneId: string) {
        return await this.droneService.getBatteryLevel(droneId)
    }
}
