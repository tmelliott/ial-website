import { revalidatePath } from "next/cache";
import { GlobalConfig } from "payload";

export const AppsPage: GlobalConfig = {
  slug: "appsPage",
  label: "Apps",
  fields: [
    {
      name: "heading",
      label: "Heading",
      type: "richText",
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidatePath(`/`, "layout");
      },
    ],
  },
};
