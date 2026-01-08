import { revalidatePath } from "next/cache";
import { GlobalConfig } from "payload";
import { adminsOrManagers } from "@/collections/access/adminsOrManagers";

export const About: GlobalConfig = {
  slug: "about",
  label: "About",
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
      type: "group",
      name: "purpose",
      label: "Purpose",
      fields: [
        {
          name: "heading",
          label: "Heading",
          type: "text",
        },
        {
          name: "description",
          label: "Description",
          type: "richText",
        },
      ],
    },
    {
      type: "array",
      name: "pillars",
      label: "Pillars",
      fields: [
        {
          name: "heading",
          label: "Heading",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "richText",
          required: true,
        },
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "images",
        },
        {
          name: "url",
          label: "URL",
          type: "text",
          required: true,
        },
      ],
      admin: {
        description:
          "Core pillars shown on the About page, and in details on the landing page.",
        initCollapsed: true,
        components: {
          RowLabel: {
            path: "@/globals/components/Label",
            clientProps: {
              label: "Pillar",
            },
          },
        },
      },
    },
    {
      name: "team",
      label: "Team",
      type: "group",
      fields: [
        {
          name: "heading",
          label: "Heading",
          type: "text",
        },
        {
          name: "description",
          label: "Description",
          type: "richText",
        },
      ],
    },
    {
      name: "metadata",
      label: "Metadata",
      type: "group",
      admin: {
        position: "sidebar",
        description:
          "Metadata for SEO and social media sharing for the About page.",
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
      () => {
        revalidatePath(`/`, "layout");
      },
    ],
  },
};
