import { 
    IsNotEmpty, 
    IsString, 
    IsNumber, 
    IsPositive, 
    Matches, 
    IsOptional 
} from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'Name can only contain letters, numbers, "-" and "_"',
  })
  name: string;

  @IsNumber()
  @IsPositive()
  weight: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Code can only contain uppercase letters, numbers, and "_"',
  })
  code: string;

  @IsOptional()
  @IsString()
  image: string;
}