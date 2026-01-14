import { revalidatePath } from "next/cache";
import { GlobalConfig } from "payload";
import { adminsOrManagers } from "@/collections/access/adminsOrManagers";

export const Projects: GlobalConfig = {
  slug: "projectsPage",
  label: "Projects",
  access: {
    read: () => true,
    update: adminsOrManagers,
  },
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
          "Metadata for SEO and social media sharing for the Projects page.",
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
    {
      name: "workstreams",
      label: "Workstreams",
      type: "relationship",
      relationTo: "keywords",
      hasMany: true,
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
