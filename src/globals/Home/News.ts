import { GlobalConfig } from "payload";
import refreshHome from "./hooks/refreshHome";

export const HomeNews: GlobalConfig = {
  slug: "homeNews",
  label: "News",
  fields: [
    {
      name: "teamTitle",
      label: "News title",
      type: "text",
      defaultValue: "Latest news",
      required: true,
    },
    {
      name: "card",
      label: "Highlight card",
      type: "group",
      required: false,
      fields: [
        { name: "label", label: "Title", type: "text" },
        { name: "linkText", label: "Link text", type: "text" },
        { name: "linkUrl", label: "Link URL", type: "text" },
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
