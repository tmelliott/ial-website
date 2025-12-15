import { formatSlug } from "@/lib/slugs";
import { revalidate } from "@/lib/revalidate";
import { CollectionConfig } from "payload";
import { Keyword } from "@payload-types";

export const Apps: CollectionConfig = {
  slug: "apps",
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
      },
      hooks: {
        beforeValidate: [formatSlug("title")],
      },
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      required: true,
    },
    // {
    //   name: "featured",
    //   label: "Featured",
    //   type: "checkbox",
    //   defaultValue: false,
    //   admin: {
    //     position: "sidebar",
    //     description: "Show this project on the homepage.",
    //   },
    // },
    {
      name: "banner",
      label: "Banner",
      type: "upload",
      relationTo: "images",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "images",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "link",
      label: "Link",
      type: "text",
      required: true,
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
  ],
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidate.app(doc.slug);

        // Revalidate keyword pages if this app has keywords
        if (doc.keywords && Array.isArray(doc.keywords)) {
          doc.keywords
            .filter((kw: Keyword | number) => typeof kw !== "number" && kw.slug)
            .forEach((kw: Keyword) => {
              if (typeof kw !== "number") {
                revalidate.keyword(kw.slug);
              }
            });
        }

        revalidate.global("homeApps");
      },
    ],
  },
};
