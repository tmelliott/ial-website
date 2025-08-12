import { revalidatePath } from "next/cache";
import { GlobalConfig } from "payload";

export const NewsPage: GlobalConfig = {
  slug: "newsPage",
  label: "News",
  fields: [
    {
      name: "heading",
      label: "Heading",
      type: "richText",
    },
  ],
  hooks: {
    afterChange: [
      // revalidate ALL pages ...
      () => {
        revalidatePath("/news");
      },
    ],
  },
};
