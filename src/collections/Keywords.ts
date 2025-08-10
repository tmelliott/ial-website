import { CollectionConfig } from "payload";

export const Keywords: CollectionConfig = {
  slug: "keywords",
  fields: [
    {
      name: "title",
      label: "Label",
      type: "text",
      required: true,
    },
  ],
  admin: {
    useAsTitle: "title",
  },
};
