import type { FieldHook } from "payload";

export const validatePassword: FieldHook = ({ value, operation }) => {
  // On create, password is required
  if (operation === "create" && !value) {
    throw new Error("Password is required when creating a new user.");
  }

  // On update, password is optional (can be left blank to keep current password)
  // If a value is provided, it will be hashed by Payload
  return value;
};
