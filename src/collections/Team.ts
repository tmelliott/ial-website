import { formatNameSlug } from "@/lib/slugs";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

export const Team: CollectionConfig = {
  slug: "team",
  labels: {
    singular: "Team Member",
    plural: "Team",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "group",
      required: true,
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "title",
              label: "Title",
              type: "text",
            },
            {
              name: "first",
              label: "First",
              type: "text",
              required: true,
            },
            {
              name: "last",
              label: "Last",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "fullname",
      label: "Fullname",
      type: "text",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "order",
      label: "Order",
      type: "number",
      defaultValue: 10,
      admin: {
        position: "sidebar",
        description:
          "Use ties for similarly-leveled people, who will be sorted alphabetically.",
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
      },
      hooks: {
        beforeValidate: [formatNameSlug()],
      },
    },
    {
      name: "role",
      label: "Role",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "iwi",
      label: "Iwi affiliations",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "bio",
      label: "Biography",
      type: "richText",
      required: true,
    },
    {
      name: "photo",
      label: "Profile photo",
      type: "upload",
      relationTo: "images",
      admin: {
        position: "sidebar",
      },
    },

    {
      name: "socialMedia",
      label: "Social media links",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "url",
              label: "URL",
              type: "text",
              required: false,
            },
            {
              name: "name",
              label: "Username/handle",
              type: "text",
            },
          ],
        },
      ],
      admin: {
        position: "sidebar",
        initCollapsed: true,
        components: {
          RowLabel: {
            path: "@/collections/components/ArrayRowLabel",
            clientProps: {
              label: "Link",
            },
          },
        },
      },
    },
    {
      name: "keywords",
      label: "Keywords / research areas and specialisations",
      type: "relationship",
      relationTo: "keywords",
      hasMany: true,
    },
    {
      name: "projects",
      type: "join",
      collection: "projects",
      on: "team",
    },
    {
      name: "news",
      type: "join",
      collection: "news",
      on: "team",
    },
  ],
  admin: {
    useAsTitle: "fullname",
    defaultColumns: ["fullname", "role", "email", "order"],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const name = data?.name;
        if (!name) return data;
        data.fullname = name.first + " " + name.last;
        return data;
      },
    ],
    afterChange: [
      () => {
        revalidatePath(`/`, "layout");
      },
    ],
  },
};
