import type { LexicalData } from "../../lib/payload";

export function extractTextFromRichText(
  richText: LexicalData | null | undefined,
): string {
  if (!richText || typeof richText !== "object") return "";

  const root = richText as {
    root?: { children?: Array<Record<string, unknown>> };
  };
  if (!root.root?.children) return "";

  return root.root.children
    .map((child) => {
      if (Array.isArray(child.children)) {
        return child.children
          .map((node) => {
            if (typeof node !== "object" || node === null) return "";
            return typeof (node as { text?: unknown }).text === "string"
              ? (node as { text: string }).text
              : "";
          })
          .join("")
          .trim();
      }
      return typeof child.text === "string" ? child.text : "";
    })
    .join(" ")
    .trim();
}
