import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedResponse, PaginationOptions } from './types';

@Injectable()
export class PaginationService {
  async paginate<T>(
    model: any,
    {
      page = 1,
      limit = 10,
      sortField = 'createdAt',
      sortOrder = 'desc',
      filters = {},
      dateField = 'createdAt',
      startDate,
      endDate,
      include,
      select,
    }: PaginationOptions,
  ): Promise<PaginatedResponse<T>> {
    const skip = (page - 1) * limit;
    const where: any = {};

    // Build filters
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'OR') {
        where[key] = value;
      } else if (Array.isArray(value)) {
        where[key] = { in: value };
      } else if (typeof value === 'string' && value.includes('%')) {
        where[key] = {
          contains: value.replace(/%/g, ''),
          mode: 'insensitive',
        };
      } else {
        where[key] = value;
      }
    }

    // Date range filtering
    if (startDate || endDate) {
      where[dateField] = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    // Prisma query options
    const queryOptions: any = {
      where,
      skip,
      take: limit,
      orderBy: { [sortField]: sortOrder },
    };

    if (include && select) {
      queryOptions.select = {
        ...select,
        ...this.includeToSelect(include),
      };
    } else if (include) {
      queryOptions.include = this.buildIncludeObject(include);
    } else if (select) {
      queryOptions.select = select;
    }

    const [totalItems, data] = await Promise.all([
      model.count({ where }),
      model.findMany(queryOptions),
    ]);

    return {
      data,
      meta: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  private includeToSelect(include: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(include).map(([key, value]) => [
        key,
        typeof value === 'object' && value !== null
          ? { select: this.includeToSelect(value) }
          : value,
      ]),
    );
  }

  private buildIncludeObject(include: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(include).map(([key, value]) => [
        key,
        typeof value === 'object' && value !== null
          ? { select: this.buildIncludeObject(value) }
          : value,
      ]),
    );
  }
}
