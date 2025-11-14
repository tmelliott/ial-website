import { GlobalConfig } from "payload";
import refreshHome from "./hooks/refreshHome";

export const HomeProjects: GlobalConfig = {
  slug: "homeProjects",
  label: "Our Work",
  fields: [
    {
      name: "projectsTitle",
      label: "Projects Title",
      type: "text",
      defaultValue: "We do data differently",
    },
    {
      name: "projectsDescription",
      label: "Projects Description",
      type: "richText",
    },
    {
      name: "featuredApps",
      type: "relationship",
      relationTo: "apps",
      hasMany: true,
    },
    {
      name: "featuredProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      maxRows: 2,
    },
    {
      name: "cards",
      type: "array",
      fields: [
        { name: "label", label: "Title", type: "text", required: true },
        { name: "linkText", label: "Link text", type: "text", required: true },
        { name: "linkUrl", label: "Link URL", type: "text", required: true },
      ],
      maxRows: 2,
    },
  ],
  admin: {
    group: "Home page",
  },
  hooks: {
    afterChange: [refreshHome],
  },
};
