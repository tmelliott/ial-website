import type { Access } from "payload";

type UserWithRole = {
  role?: string;
  id: number;
};

export const adminsOrManagers: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    const role = (user as UserWithRole).role;
    // If user has role of 'admin' or 'manager'
    if (role === "admin" || role === "manager") {
      return true;
    }
  }

  // Reject everyone else
  return false;
};
