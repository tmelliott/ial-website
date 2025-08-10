import { GlobalConfig } from "payload";
import refreshHome from "./hooks/refreshHome";

export const HomeCollaborators: GlobalConfig = {
  slug: "homeCollaborators",
  label: "Collaborators",
  fields: [
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
          name: "type",
          label: "NZ or International",
          type: "radio",
          required: true,
          options: ["Aotearoa", "International"],
        },
      ],
    },
  ],
  admin: {
    group: "Home page",
  },
  hooks: {
    afterChange: [refreshHome],
  },
};
