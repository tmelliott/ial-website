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
    {
      name: "metadata",
      label: "Metadata",
      type: "group",
      admin: {
        position: "sidebar",
        description:
          "Metadata for SEO and social media sharing for the Apps page.",
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          admin: {
            description: "Page title for SEO and browser tabs.",
          },
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          admin: {
            description: "Meta description for SEO and social media previews.",
          },
        },
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "images",
          admin: {
            description: "Open Graph image for social media sharing.",
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      // revalidate ALL pages ...
      () => {
        revalidatePath("/apps");
      },
    ],
  },
};
