import type { FieldHook } from "payload";

type UserWithRoles = {
  roles?: string[] | null;
  id: number;
};

export const protectRoles: FieldHook = ({ req, operation, value, data }) => {
  // Prevent non-admins from changing roles
  if (operation === "update" || operation === "create") {
    const userRoles = (req.user as UserWithRoles)?.roles;
    if (req.user && !userRoles?.includes("admin")) {
      // If user is not admin, return the existing roles
      if (operation === "update" && data?.id && req.user.id === data.id) {
        return userRoles;
      }
      // Prevent non-admins from setting roles
      return [];
    }
  }
  return value;
};
