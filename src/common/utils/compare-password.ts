import * as bycrypt from 'bcryptjs';

export function isPasswordMatch(password: string, dbPassword: string) {
  const comp = bycrypt.compareSync(password, dbPassword);
  return comp;
}
