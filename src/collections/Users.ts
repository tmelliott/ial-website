import type { CollectionConfig, Field } from "payload";

import { admins } from "./access/admins";
import { adminsOrManagers } from "./access/adminsOrManagers";
import { adminsOrManagersAndUser } from "./access/adminsOrManagersAndUser";
import { fieldAdmins } from "./access/fieldAdmins";
import { fieldAdminsAndUser } from "./access/fieldAdminsAndUser";
import { protectRoles } from "./hooks/protectRoles";
import { validatePassword } from "./hooks/validatePassword";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      sameSite: "None",
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "firstName", "lastName", "role"],
  },
  access: {
    read: adminsOrManagersAndUser,
    create: adminsOrManagers,
    update: adminsOrManagersAndUser,
    delete: admins,
    unlock: admins,
    admin: ({ req: { user } }) => {
      // Only allow access to admin if user has a role
      if (user) {
        const role = (user as { role?: string }).role;
        return role === "admin" || role === "manager" || role === "team";
      }
      return false;
    },
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      access: {
        read: fieldAdminsAndUser,
        update: fieldAdminsAndUser,
      },
    },
    {
      name: "password",
      type: "password",
      required: false,
      admin: {
        description: "Leave blank to keep the current password.",
      },
      hooks: {
        beforeValidate: [validatePassword],
      },
    } as Field,
    {
      name: "resetPasswordToken",
      type: "text",
      hidden: true,
    },
    {
      name: "resetPasswordExpiration",
      type: "date",
      hidden: true,
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "role",
      type: "radio",
      required: true,
      defaultValue: "admin",
      saveToJWT: true,
      access: {
        read: fieldAdmins,
        update: fieldAdmins,
        create: fieldAdmins,
      },
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Manager",
          value: "manager",
        },
        {
          label: "Team",
          value: "team",
        },
      ],
    },
  ],
};
