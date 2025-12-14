import { formatSlug } from "@/lib/slugs";
import { revalidate } from "@/lib/revalidate";
import { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  slug: "news",
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return {
        _status: {
          equals: "published",
        },
      };
    },
  },
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
      type: "array",
      maxRows: 1,
      fields: [
        {
          name: "label",
          label: "Link text",
          type: "text",
          required: true,
        },
        {
          name: "url",
          label: "Link URL",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "newstype",
      label: "Type of release",
      type: "text",
      defaultValue: "Publication",
      required: true,
      admin: {
        position: "sidebar",
      },
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
    drafts: {
      // autosave: true,
      schedulePublish: true,
    },
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date"],
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        // Only revalidate if published
        if (doc._status === "published") {
          revalidate.news(doc.slug);

          // Revalidate keyword pages if this news item has keywords
          if (doc.keywords && Array.isArray(doc.keywords)) {
            doc.keywords
              .filter((kw) => typeof kw !== "number" && kw.slug)
              .forEach((kw) => {
                if (typeof kw !== "number") {
                  revalidate.keyword(kw.slug);
                }
              });
          }

          revalidate.global("homeNews");
        }
      },
    ],
  },
};
