import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto } from './dto/medication.dto';

@Injectable()
export class MedicationService {
    constructor(private prismaService: PrismaService) {}

    async createMedication(body: CreateMedicationDto) {
        const med = await this.prismaService.medication.create({
            data: {
                name: body.name,
                weight: body.weight,
                code: body.code,
                image: body.image,
            }
        });
        return med;
    }
}
