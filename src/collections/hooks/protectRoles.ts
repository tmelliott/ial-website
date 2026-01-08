import type { FieldHook } from "payload";

type UserWithRole = {
  role?: string | null;
  id: number;
};

export const protectRoles: FieldHook = ({ req, operation, value, data }) => {
  // Prevent non-admins from changing roles
  if (operation === "update" || operation === "create") {
    const userRole = (req.user as UserWithRole)?.role;
    if (req.user && userRole !== "admin") {
      // If user is not admin, return the existing role
      if (operation === "update" && data?.id && req.user.id === data.id) {
        return userRole;
      }
      // Prevent non-admins from setting roles
      return null;
    }
  }
  return value;
};
