import type { CollectionConfig, Field } from "payload";

import { admins } from "./access/admins";
import { adminsAndUser } from "./access/adminsAndUser";
import { fieldAdmins } from "./access/fieldAdmins";
import { fieldAdminsAndUser } from "./access/fieldAdminsAndUser";
import { protectRoles } from "./hooks/protectRoles";

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
    defaultColumns: ["email", "firstName", "lastName", "roles"],
  },
  access: {
    read: adminsAndUser,
    create: admins,
    update: adminsAndUser,
    delete: admins,
    unlock: admins,
    admin: ({ req: { user } }) => Boolean(user),
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
      required: true,
      admin: {
        description: "Leave blank to keep the current password.",
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
      name: "roles",
      type: "select",
      hasMany: true,
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
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};
