type UserWithRoles = {
  roles?: string[] | null;
};

export const checkRole = (
  roles: string[],
  user: UserWithRoles | null | undefined
): boolean => {
  if (user?.roles) {
    return roles.some((role) => user.roles?.includes(role));
  }
  return false;
};
