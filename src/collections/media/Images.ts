import type { CollectionConfig } from "payload";
import { teamMembers } from "../access/teamMembers";

export const Images: CollectionConfig = {
  slug: "images",
  access: {
    read: () => true,
    create: teamMembers,
    update: teamMembers,
    delete: teamMembers,
  },
  upload: {
    staticDir: "media/images",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
      {
        name: "square",
        width: 1024,
        height: 1024,
        position: "center",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ],
  admin: {
    group: "Media",
  },
};
