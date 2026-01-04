export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

export function excludeArray<User, Key extends keyof User>(
  users: User[],
  keys: Key[],
): Omit<User, Key>[] {
  return users.map((user) => {
    const userCopy = { ...user };
    for (const key of keys) {
      delete userCopy[key];
    }
    return userCopy;
  });
}
