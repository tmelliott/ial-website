import type { SerializedEditorState } from "lexical";

export function extractTextFromRichText(
  richText: SerializedEditorState | null | undefined
): string {
  if (!richText || typeof richText !== "object") return "";

  const root = richText as { root?: { children?: Array<Record<string, unknown>> } };
  if (!root.root?.children) return "";

  return root.root.children
    .map((child) => {
      if (Array.isArray(child.children)) {
        return child.children
          .map((c) => (typeof c.text === "string" ? c.text : ""))
          .join("")
          .trim();
      }
      return typeof child.text === "string" ? child.text : "";
    })
    .join(" ")
    .trim();
}
