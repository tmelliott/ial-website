import { GlobalConfig } from "payload";

export const General: GlobalConfig = {
  slug: "general",
  label: "General",
  fields: [
    {
      name: "logo",
      required: true,
      label: "Logo",
      type: "upload",
      relationTo: "images",
    },
  ],
};
