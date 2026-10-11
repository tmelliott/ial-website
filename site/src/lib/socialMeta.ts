export type SocialMetaTag = {
  property?: string;
  name?: string;
  content: string;
};

export type SocialMetaInput = {
  title: string;
  description: string;
  pathname: string;
  origin: string;
  type?: "website" | "article";
  image?: unknown;
  imageAlt?: string | null;
  fallbackImage?: unknown;
  logo?: unknown;
};

const SITE_NAME = "iNZight Analytics Ltd";

function httpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("https://")) return undefined;
  return value;
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

export function socialExcerpt(value: unknown): string {
  if (typeof value !== "string") return "";
  return stripHtmlTags(value).slice(0, 160);
}

function pageUrl(pathname: string, origin: string): string {
  const url = new URL(pathname, origin);
  url.search = "";
  url.hash = "";
  return url.href;
}

export function socialMetaTags(input: SocialMetaInput): SocialMetaTag[] {
  const title = input.title;
  const description = stripHtmlTags(input.description);
  const type = input.type === "article" ? "article" : "website";
  const image =
    httpsUrl(input.image) ?? httpsUrl(input.fallbackImage) ?? httpsUrl(input.logo);
  const imageAlt =
    typeof input.imageAlt === "string" && input.imageAlt.length > 0
      ? input.imageAlt
      : title;

  const tags: SocialMetaTag[] = [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: pageUrl(input.pathname, input.origin) },
    { property: "og:site_name", content: SITE_NAME },
    {
      name: "twitter:card",
      content: image ? "summary_large_image" : "summary",
    },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (image) {
    tags.push(
      { property: "og:image", content: image },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:image", content: image },
    );
  }

  return tags;
}
