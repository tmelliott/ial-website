import { GlobalConfig } from "payload";
import refreshHome from "./hooks/refreshHome";
import { adminsOrManagers } from "@/collections/access/adminsOrManagers";

export const HomeTeam: GlobalConfig = {
  slug: "homeTeam",
  label: "Our Team",
  access: {
    read: () => true,
    update: adminsOrManagers,
  },
  fields: [
    {
      name: "teamTitle",
      label: "Team Title",
      type: "text",
      defaultValue: "We do data differently",
      required: true,
    },
    {
      name: "teamDescription",
      label: "Team Description",
      type: "richText",
      required: true,
    },
    {
      name: "buttonText",
      label: "Button text",
      type: "text",
      defaultValue: "Meet the team",
      required: true,
    },
    {
      name: "image",
      label: "Image",
      type: "upload",
      relationTo: "images",
      admin: {
        position: "sidebar",
      },
    },
  ],
  admin: {
    group: "Home page",
  },
  hooks: {
    afterChange: [refreshHome],
  },
};
