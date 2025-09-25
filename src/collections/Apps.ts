import { formatSlug } from "@/lib/slugs";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

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
      // revalidate ALL pages ...
      ({ doc }) => {
        // revalidatePath("/about");
        revalidatePath(`/apps/${doc.slug}`);
        revalidatePath("/keywords/[slug]");
      },
    ],
  },
};
