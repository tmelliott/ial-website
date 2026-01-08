import type { Access } from "payload";

type UserWithRole = {
  role?: string;
  id: number;
  email?: string;
};

export const teamMemberOwnRecord: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    const role = (user as UserWithRole).role;
    // Admins and managers have full access
    if (role === "admin" || role === "manager") {
      return true;
    }

    // Team members can only edit their own record (matched by email)
    if (role === "team" && user.email) {
      return {
        email: {
          equals: user.email,
        },
      };
    }
  }

  // Reject everyone else
  return false;
};
