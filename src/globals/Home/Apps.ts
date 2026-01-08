import { GlobalConfig } from "payload";
import refreshHome from "./hooks/refreshHome";
import { adminsOrManagers } from "@/collections/access/adminsOrManagers";

export const HomeApps: GlobalConfig = {
  slug: "homeApps",
  label: "Home page apps",
  access: {
    read: () => true,
    update: adminsOrManagers,
  },
  fields: [
    {
      name: "apps",
      label: "Apps",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              label: "Title",
              type: "text",
              required: true,
            },
            {
              name: "url",
              label: "URL",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "logo",
          type: "upload",
          relationTo: "images",
          required: true,
        },
      ],
    },
  ],
  admin: {
    group: "Home page",
    description:
      "Apps displayed on the landing page. Keep this as few as possible.",
  },
  hooks: {
    afterChange: [refreshHome],
  },
};
