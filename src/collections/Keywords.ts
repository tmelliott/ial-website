import { formatSlug } from "@/lib/slugs";
import { revalidate } from "@/lib/revalidate";
import { CollectionConfig } from "payload";

export const Keywords: CollectionConfig = {
  slug: "keywords",
  fields: [
    {
      name: "title",
      label: "Label",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description:
          "The slug is used to identify the news item in the URL. It is generated automatically from the label.",
        readOnly: true,
      },
      hooks: {
        beforeValidate: [formatSlug("title")],
      },
    },
    {
      name: "apps",
      type: "join",
      collection: "apps",
      on: "keywords",
    },
    {
      name: "projects",
      type: "join",
      collection: "projects",
      on: "keywords",
    },
    {
      name: "team",
      type: "join",
      collection: "team",
      on: "keywords",
    },
    {
      name: "news",
      type: "join",
      collection: "news",
      on: "keywords",
    },
  ],
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidate.keyword(doc.slug);
      },
    ],
  },
};
