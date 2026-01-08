type UserWithRole = {
  role?: string | null;
};

export const checkRole = (
  roles: string[],
  user: UserWithRole | null | undefined
): boolean => {
  if (user?.role) {
    return roles.includes(user.role);
  }
  return false;
};
