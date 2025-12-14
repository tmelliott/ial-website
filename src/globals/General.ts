import { revalidate } from "@/lib/revalidate";
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
    {
      name: "mainMenu",
      label: "Main Menu",
      type: "array",
      labels: {
        plural: "Main menu items",
        singular: "Menu item",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "label",
              label: "Label",
              type: "text",
              required: true,
            },
            {
              name: "location",
              label: "Location",
              type: "text",
              required: true,
            },
            {
              name: "tereo",
              label: "Te Reo",
              type: "text",
            },
          ],
        },
        {
          name: "submenu",
          label: "Submenu",
          type: "array",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "label",
                  label: "Label",
                  type: "text",
                  required: true,
                },
                {
                  name: "location",
                  label: "Location",
                  type: "text",
                  required: true,
                },
              ],
            },
          ],
          admin: {
            description: "Optionally add a sub-menu to the link.",
            initCollapsed: true,
            components: {
              RowLabel: "@/globals/components/Label",
            },
          },
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/globals/components/Label",
        },
      },
    },
    {
      name: "footerMenu",
      label: "Footer Menu",
      type: "array",
      labels: {
        plural: "Additional footer menu items",
        singular: "Footer menu item",
      },
      fields: [
        {
          name: "label",
          label: "Label",
          type: "text",
          required: true,
        },
        {
          name: "location",
          label: "Location",
          type: "text",
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/globals/components/Label",
        },
      },
    },

    {
      name: "socialLinks",
      label: "Social Links",
      type: "array",
      labels: {
        plural: "Social media links",
        singular: "Social media link",
      },
      fields: [
        {
          name: "url",
          label: "URL",
          type: "text",
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/globals/components/Label",
        },
      },
    },
    {
      name: "metadata",
      label: "Metadata",
      type: "group",
      admin: {
        position: "sidebar",
        description:
          "Default metadata for SEO and social media sharing. Used when page-specific metadata is not available.",
      },
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          admin: {
            description:
              "Default page title for SEO and browser tabs. Used as fallback when page-specific metadata is not set.",
          },
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          admin: {
            description:
              "Default meta description for SEO and social media previews. Used as fallback when page-specific metadata is not set.",
          },
        },
        {
          name: "image",
          label: "Image",
          type: "upload",
          relationTo: "images",
          admin: {
            description:
              "Default Open Graph image for social media sharing. Used as fallback when page-specific image is not set.",
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        // General affects all pages, so revalidate everything
        revalidate.global("general");
        // Revalidate all collection tags
        const { revalidateTag } = require("next/cache");
        const { CACHE_TAGS } = require("@/lib/payload-cache");
        revalidateTag(CACHE_TAGS.projects);
        revalidateTag(CACHE_TAGS.news);
        revalidateTag(CACHE_TAGS.team);
        revalidateTag(CACHE_TAGS.apps);
        revalidateTag(CACHE_TAGS.keywords);
        revalidateTag(CACHE_TAGS.home);
      },
    ],
  },
};
