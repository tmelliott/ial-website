import { GlobalConfig } from "payload";
import refreshHome from "./hooks/refreshHome";

export const HomeCollaborators: GlobalConfig = {
  slug: "homeCollaborators",
  label: "Collaborators",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      defaultValue: "We've worked with ...",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "richText",
      required: true,
    },
    {
      name: "feature",
      label: "Featured item (e.g., Horizon Europe)",
      type: "group",
      fields: [
        {
          name: "title",
          label: "Feature title",
          type: "text",
        },
        {
          name: "description",
          label: "Description",
          type: "richText",
        },
        {
          name: "buttonText",
          label: "Button Text",
          type: "text",
        },
        {
          name: "buttonURL",
          label: "Button URL",
          type: "text",
        },
      ],
    },
    {
      name: "collaborators",
      label: "Collaborators",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              label: "Name",
              type: "text",
              required: true,
            },
            {
              name: "url",
              label: "URL",
              type: "text",
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "type",
              label: "NZ or International",
              type: "radio",
              required: true,
              options: ["Aotearoa", "International"],
            },
            {
              name: "image",
              label: "Image",
              type: "upload",
              relationTo: "images",
            },
          ],
        },
      ],

      admin: {
        // position: "sidebar",
        initCollapsed: true,
        components: {
          RowLabel: {
            path: "@/globals/components/Label",
            clientProps: {
              labelProp: "name",
            },
          },
        },
      },
    },
  ],
  admin: {
    group: "Home page",
  },
  hooks: {
    afterChange: [refreshHome],
  },
};
