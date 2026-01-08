import type { FieldAccess } from "payload";

type UserWithRole = {
  role?: string;
};

export const fieldAdmins: FieldAccess = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    const role = (user as UserWithRole).role;
    if (role === "admin") {
      return true;
    }
  }

  // Reject everyone else
  return false;
};
