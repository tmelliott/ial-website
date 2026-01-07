import type { FieldAccess } from "payload";

type UserWithRoles = {
  roles?: string[];
  id: number;
};

export const fieldAdminsAndUser: FieldAccess = ({ req: { user }, id }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    const roles = (user as UserWithRoles).roles;
    if (roles?.includes("admin")) {
      return true;
    }

    // If any other type of user, only provide access to their own fields
    if (id && user.id === id) {
      return true;
    }
  }

  // Reject everyone else
  return false;
};
