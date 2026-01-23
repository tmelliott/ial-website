import { Block } from "payload";

const ContributorBlock: Block = {
  slug: "Contributor",
  interfaceName: "ContributorBlock",
  fields: [
    {
      name: "contributorType",
      label: "Contributor Type",
      type: "radio",
      options: [
        {
          label: "Team Member",
          value: "teamMember",
        },
        {
          label: "Name and URL",
          value: "nameAndUrl",
        },
      ],
      defaultValue: "teamMember",
      required: true,
      admin: {
        layout: "horizontal",
      },
    },
    {
      name: "teamMember",
      label: "Team Member",
      type: "relationship",
      relationTo: "team",
      required: true,
      admin: {
        condition: (data, siblingData) => {
          const type = siblingData?.contributorType ?? data?.contributorType ?? "teamMember";
          return type === "teamMember";
        },
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      admin: {
        condition: (data, siblingData) => {
          const type = siblingData?.contributorType ?? data?.contributorType ?? "teamMember";
          return type === "nameAndUrl";
        },
      },
    },
    {
      name: "url",
      label: "URL",
      type: "text",
      required: true,
      admin: {
        condition: (data, siblingData) => {
          const type = siblingData?.contributorType ?? data?.contributorType ?? "teamMember";
          return type === "nameAndUrl";
        },
      },
    },
    {
      name: "role",
      label: "Role",
      type: "text",
      required: true,
    },
  ],
};

export default ContributorBlock;
