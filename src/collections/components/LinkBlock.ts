import { Block } from "payload";

const LinkBlock: Block = {
  slug: "Link",
  interfaceName: "LinkBlock",
  fields: [
    {
      name: "linkText",
      type: "text",
      required: true,
    },
    {
      name: "linkURL",
      label: "Link URL",
      type: "text",
      required: true,
    },
  ],
};

export default LinkBlock;
