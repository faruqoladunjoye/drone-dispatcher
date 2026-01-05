import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export type SortOrder = 'asc' | 'desc';

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationOptions {
  @IsNotEmpty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => (value === undefined ? 1 : parseInt(value, 10)), {
    toClassOnly: true,
  })
  page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sortField?: string;

  @IsOptional()
  @IsEnum(SortOrderEnum)
  @IsNotEmpty()
  sortOrder?: SortOrder;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  filters?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  notFilters?: Record<string, any>;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dateField?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  endDate?: string;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  include?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  select?: Record<string, any>;

  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  where?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
