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
  ],
  hooks: {
    afterChange: [
      // revalidate ALL pages ...
      () => revalidatePath("/", "layout"),
    ],
  },
};
