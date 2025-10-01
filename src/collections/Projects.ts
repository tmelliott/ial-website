import { formatSlug } from "@/lib/slugs";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
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
      name: "content",
      label: "Content",
      type: "richText",
      required: true,
    },
    // list of files
    // gallery
    // is featured?
    {
      name: "featured",
      label: "Featured",
      type: "checkbox",
      defaultValue: false,
      required: true,
      admin: {
        position: "sidebar",
        description: "Featured projects get different styling.",
      },
    },
    {
      name: "banner",
      label: "Banner",
      type: "upload",
      relationTo: "images",
      admin: {
        position: "sidebar",
      },
    },
    // links
    {
      name: "linkGroups",
      label: "Links",
      type: "array",
      fields: [
        {
          name: "label",
          label: "Group heading",
          type: "text",
          admin: {
            description:
              "Optional, if left blank no group heading will be used.",
          },
        },
        {
          name: "featured",
          label: "Featured",
          type: "checkbox",
        },
        {
          name: "groupLinks",
          label: "Links",
          type: "array",
          required: true,
          fields: [
            {
              name: "link",
              label: "Link",
              type: "text",
              required: true,
            },
            {
              name: "description",
              label: "Description",
              type: "text",
              required: false,
            },
          ],
        },
      ],
      admin: {
        // position: "sidebar",
        initCollapsed: true,
        components: {
          RowLabel: {
            path: "@/collections/components/ArrayRowLabel",
            serverProps: {
              label: "Group",
            },
          },
        },
      },
    },
    {
      name: "files",
      label: "Files",
      type: "relationship",
      relationTo: "documents",
      hasMany: true,
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
        revalidatePath("/about");
        revalidatePath(`/projects/${doc.slug}`);
        revalidatePath("/keywords/[slug]");
      },
    ],
  },
};
