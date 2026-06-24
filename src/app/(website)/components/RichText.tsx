import type { SerializedLinkNode } from "@payloadcms/richtext-lexical";
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as PayloadRichText,
} from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import type { ComponentProps } from "react";

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc;
  if (!doc) return "#";

  const { relationTo, value } = doc;
  if (typeof value !== "object" || !value) {
    throw new Error("Expected internal link value to be a populated object");
  }

  const slug =
    "slug" in value && typeof value.slug === "string" ? value.slug : null;

  switch (relationTo) {
    case "news":
      return `/news/${slug}`;
    case "projects":
      return `/projects/${slug}`;
    case "team":
      return `/team/${slug}`;
    case "keywords":
      return `/keywords/${slug}`;
    case "apps":
      return slug ? `/apps#${slug}` : "/apps";
    case "images":
    case "documents":
    case "data":
      return "url" in value && typeof value.url === "string" ? value.url : "#";
    default:
      return slug ? `/${relationTo}/${slug}` : "#";
  }
};

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
});

export type LexicalRichTextData = SerializedEditorState;

type RichTextProps = ComponentProps<typeof PayloadRichText>;

export function RichText(props: RichTextProps) {
  return <PayloadRichText converters={jsxConverters} {...props} />;
}
