import { revalidatePath } from "next/cache";
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
  hooks: {
    afterChange: [
      // revalidate ALL pages ...
      () => revalidatePath("/", "layout"),
    ],
  },
};
