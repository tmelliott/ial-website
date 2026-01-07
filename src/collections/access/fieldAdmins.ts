import type { FieldAccess } from "payload";

type UserWithRoles = {
  roles?: string[];
};

export const fieldAdmins: FieldAccess = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    const roles = (user as UserWithRoles).roles;
    if (roles?.includes("admin")) {
      return true;
    }
  }

  // Reject everyone else
  return false;
};
