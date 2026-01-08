import type { Access } from "payload";

type UserWithRole = {
  role?: string;
  id: number;
};

export const teamMembers: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    const role = (user as UserWithRole).role;
    // If user has role of 'admin', 'manager', or 'team'
    if (role === "admin" || role === "manager" || role === "team") {
      return true;
    }
  }

  // Reject everyone else
  return false;
};
