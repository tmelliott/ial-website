import { GlobalConfig } from "payload";
import refreshHome from "./hooks/refreshHome";

export const HomeHero: GlobalConfig = {
  slug: "homeHero",
  label: "Hero",
  fields: [
    {
      name: "titleGroup",
      label: "Landing page",
      type: "group",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "text",
          required: true,
          defaultValue:
            "Analytics, research, and data visualisation that make a difference",
        },
      ],
    },
    {
      name: "heroGroup",
      label: "Hero",
      type: "group",
      fields: [
        {
          name: "heroTitle",
          label: "Hero Title",
          type: "text",
          required: true,
          defaultValue: "We help people tell stories with data",
        },
        {
          name: "heroDescription",
          label: "Hero Description",
          type: "richText",
          required: true,
        },
        // TODO: this gets moved to ABOUT - PURPOSE
        {
          name: "heroItems",
          label: "Items",
          type: "group",
          fields: [
            {
              name: "heroDataDesign",
              label: "Data Design",
              type: "richText",
              required: true,
            },
            {
              name: "heroDataCollection",
              label: "Data Collection",
              type: "richText",
              required: true,
            },
            {
              name: "heroDataAnalysis",
              label: "Data Analysis",
              type: "richText",
              required: true,
            },
            {
              name: "heroDataVisualisation",
              label: "Data Visualisation",
              type: "richText",
              required: true,
            },
            {
              name: "heroTraining",
              label: "Training",
              type: "richText",
              required: true,
            },
            {
              name: "heroDataSovereignty",
              label: "Data Sovereignty",
              type: "richText",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "metaTitle",
      label: "Meta Title",
      type: "text",
      defaultValue: "iNZight Analytics Ltd",
      required: true,
      admin: {
        position: "sidebar",
        description:
          "This title will be used for SEO purposes, and displayed in the browser tab.",
      },
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "textarea",
      required: true,
      defaultValue:
        "iNZight Analytics Ltd is a New Zealand-based company that provides data analysis and visualisation services.",
      admin: {
        position: "sidebar",
        description:
          "This description will be used for SEO purposes (e.g., shown in search results and on social media cards).",
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
