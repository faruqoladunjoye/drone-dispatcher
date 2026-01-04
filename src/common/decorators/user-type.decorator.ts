import { SetMetadata } from '@nestjs/common';

export const AllowedUserType = (...userTypes: string[]) =>
  SetMetadata('userTypes', userTypes);
