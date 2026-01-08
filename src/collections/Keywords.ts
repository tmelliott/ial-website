import { formatSlug } from "@/lib/slugs";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";
import { teamMembers } from "./access/teamMembers";

export const Keywords: CollectionConfig = {
  slug: "keywords",
  access: {
    read: () => true,
    create: teamMembers,
    update: teamMembers,
    delete: teamMembers,
  },
  fields: [
    {
      name: "title",
      label: "Label",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
      },
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
      name: "heading",
      label: "Heading",
      type: "text",
      admin: {
        description:
          "Optional, will override the default heading 'Everything tagged with'.",
      },
    },
    {
      name: "description",
      label: "Description",
      type: "richText",
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
      () => {
        revalidatePath(`/`, "layout");
      },
    ],
  },
};
