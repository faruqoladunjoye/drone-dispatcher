import { 
    IsNotEmpty, 
    IsString, 
    IsNumber, 
    IsPositive,
    Max,
    MaxLength
} from 'class-validator';

export class CreateDroneDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    serialNumber: string;

    @IsNumber()
    @IsPositive()
    @Max(500)
    weightLimit: number;

    @IsNumber()
    @IsPositive()
    @Max(100)
    batteryCapacity: number;
}