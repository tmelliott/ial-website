import {
  convertLexicalToHTML,
  LinkHTMLConverter,
  type HTMLConvertersFunction,
} from "@payloadcms/richtext-lexical/html";
import type { SerializedEditorState } from "lexical";
import type { LexicalData } from "./payload";

function internalDocToHref(args: {
  linkNode: {
    fields: {
      url?: string | null;
      doc?: {
        relationTo?: string;
        value?: unknown;
      } | null;
    };
  };
}): string {
  const doc = args.linkNode.fields.doc;
  if (!doc?.value || typeof doc.value !== "object") {
    return args.linkNode.fields.url || "#";
  }

  const value = doc.value as { slug?: string; url?: string };
  const slug = typeof value.slug === "string" ? value.slug : null;

  switch (doc.relationTo) {
    case "news":
      return `/news/${slug}`;
    case "projects":
      return `/projects/${slug}`;
    case "team":
      return `/team/${slug}`;
    case "keywords":
      return slug === "horizon-europe" ? "/horizon-europe" : `/keywords/${slug}`;
    case "apps":
      return slug ? `/apps#${slug}` : "/apps";
    case "images":
    case "documents":
    case "data":
      return typeof value.url === "string" ? value.url : "#";
    default:
      return slug ? `/${doc.relationTo}/${slug}` : "#";
  }
}

const converters: HTMLConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkHTMLConverter({
    internalDocToHref: internalDocToHref as never,
  }),
});

export function richTextToHtml(data: LexicalData | null | undefined): string {
  if (!data?.root) return "";
  return convertLexicalToHTML({
    data: data as SerializedEditorState,
    converters,
    disableContainer: true,
  });
}
