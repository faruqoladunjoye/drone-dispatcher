import { Body, Post, Controller, UseGuards } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserTypeGuard } from '../common/guards/user-type.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AllowedUserType } from '../common/decorators/user-type.decorator';
import { CreateMedicationDto } from './dto/medication.dto';
import { UserType } from '@prisma/client';
import type { User } from '@prisma/client';

@Controller('medication')
export class MedicationController {
    constructor(private medicationService: MedicationService) {}

    @Post()
    @UseGuards(AuthGuard, UserTypeGuard)
    @AllowedUserType(UserType.ADMIN)
    async createMedication(@Body() body: CreateMedicationDto, @CurrentUser() user: User) {
        return await this.medicationService.createMedication(body);
    }
}
