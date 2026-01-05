import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationOptions } from '../utils/types';

export const Paginate = createParamDecorator(
  (defaults: Partial<PaginationOptions> = {}, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const {
      page = defaults.page ?? 1,
      limit = defaults.limit ?? 10,
      sortField = defaults.sortField || 'createdAt',
      sortOrder = defaults.sortOrder || 'desc',
      dateField = defaults.dateField || 'createdAt',
      startDate,
      endDate,
      ...filters
    } = request.query;

    return {
      page: +page,
      limit: +limit,
      sortField,
      sortOrder: sortOrder.toLowerCase(),
      dateField,
      startDate,
      endDate,
      filters,
    };
  },
);
