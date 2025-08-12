import { formatSlug } from "@/lib/slugs";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  slug: "news",
  fields: [
    {
      name: "title",
      label: "Title",
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
        description: "The slug is used to identify the news item in the URL.",
        // readOnly: true,
      },
      hooks: {
        beforeValidate: [formatSlug("title")],
      },
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        date: {
          displayFormat: "d MMMM yyy",
        },
      },
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      required: true,
    },
    {
      name: "link",
      label: "External link",
      type: "text",
    },
    {
      name: "keywords",
      label: "Keywords",
      type: "relationship",
      relationTo: "keywords",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "team",
      label: "Team members",
      type: "relationship",
      relationTo: "team",
      hasMany: true,
      admin: {
        position: "sidebar",
        allowCreate: false,
      },
    },
    {
      name: "gallery",
      label: "Gallery images",
      type: "upload",
      relationTo: "images",
      hasMany: true,
      admin: {
        description:
          "Upload multiple, and reorder as needed. The first image will be used as the main image.",
        //   position: "sidebar",
      },
    },
  ],
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date"],
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath("/news");
        revalidatePath(`/news/${doc.slug}`);
      },
    ],
  },
};
