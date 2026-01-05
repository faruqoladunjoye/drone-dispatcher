import { TokenType } from '@prisma/client';

export type SaveTokenDto = {
  token: string;
  expiresAt: string | Date;
  type: TokenType;
  userId: string;
  blackList?: boolean;
};
