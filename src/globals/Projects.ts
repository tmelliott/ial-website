import { revalidate } from "@/lib/revalidate";
import { GlobalConfig } from "payload";

export const Projects: GlobalConfig = {
  slug: "projectsPage",
  label: "Projects",
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
        revalidate.global("projectsPage");
      },
    ],
  },
};
