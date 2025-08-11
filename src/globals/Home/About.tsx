import { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  label: "About",
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
  ],
};
