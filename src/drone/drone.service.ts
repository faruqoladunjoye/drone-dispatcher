import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDroneDto } from './dto/drone.dto';
import { DroneModel, DroneState } from '@prisma/client';
import { PaginationService } from '../common/utils/paginator';
import { PaginationOptions } from '../common/utils/types';

@Injectable()
export class DroneService {
    constructor(
        private prismaService: PrismaService,
        private paginationService: PaginationService
    ) {}

    private getDroneModelByWeight(weightLimit: number): DroneModel {
        if (weightLimit <= 200) return DroneModel.LIGHTWEIGHT;
        if (weightLimit <= 300) return DroneModel.MIDDLEWEIGHT;
        if (weightLimit <= 400) return DroneModel.CRUISERWEIGHT;
        if (weightLimit <= 500) return DroneModel.HEAVYWEIGHT;
        throw new BadRequestException('Weight exceeds maximum allowed limit (500g)');
    }

    async registerDrone(body: CreateDroneDto) {
        const existingDrone = await this.prismaService.drone.findFirst({ where: { serialNumber: body.serialNumber } });
        if (existingDrone) throw new BadRequestException('Drone with this serial number already exists');

        const model = this.getDroneModelByWeight(body.weightLimit);

        const drone = await this.prismaService.drone.create({
            data: {
                serialNumber: body.serialNumber,
                model: model,
                weightLimit: body.weightLimit,
                batteryCapacity: body.batteryCapacity,
                state: DroneState.IDLE,
            }
        });
        return drone;
    }

    async getLoadedMedications(droneId: string) {
        const drone = await this.prismaService.drone.findUnique({
            where: { id: droneId },
            include: {
                medications: {
                    include: {
                        medication: true
                    }
                }
            }
        });

        if (!drone) {
            throw new NotFoundException('Drone not found');
        }

        return drone.medications.map((item) => ({
            ...item.medication,
            quantity: item.quantity
        }));
    }

    async getAvailableDrones(options: PaginationOptions) {
        options.filters = {
            ...options.filters,
            state: DroneState.IDLE,
            batteryCapacity: { gt: 25 }
        };

        return await this.paginationService.paginate(
            this.prismaService.drone,
            options
        );
    }

    async getBatteryLevel(droneId: string) {
        const drone = await this.prismaService.drone.findUnique({
            where: { id: droneId },
        });
        if (!drone) throw new NotFoundException('Drone not found');

        return {
            droneId: drone.id,
            serialNumber: drone.serialNumber,
            batteryCapacity: drone.batteryCapacity,
            model: drone.model
        }
    }
}
