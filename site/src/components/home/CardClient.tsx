import { useState, type ReactNode } from "react";
import Button from "./Button";
import { cn } from "./cn";
import type { KeywordLink, MediaImage } from "./types";

export default function CardClient({
  title,
  image,
  banner,
  keywords,
  url,
  type,
  linkType = "title",
  variant = "left",
  featured = false,
  direction = "horizontal",
  children,
  contentHtml,
  bannerBlur,
}: {
  title: string;
  image?: number | MediaImage | null | undefined;
  banner?: number | MediaImage | null | undefined;
  keywords?: (number | KeywordLink)[] | null;
  url: string;
  type: "project" | "app";
  linkType?: "title" | "button";
  variant?: "left" | "right";
  featured?: boolean;
  direction?: "horizontal" | "vertical";
  children?: ReactNode;
  contentHtml?: string;
  bannerBlur?: string;
}) {
  const [bannerReady, setBannerReady] = useState(false);
  const Title = () => (
    <h4
      className={cn(
        "text-lg @lg:text-xl @4xl:text-3xl font-semibold mb-2 @lg:mb-4 hover:underline",
        featured ? "text-white" : "text-accent-600",
        direction === "vertical" && "mb-4",
      )}
    >
      {title}
    </h4>
  );

  const imageSrc =
    (direction === "horizontal" &&
      image &&
      typeof image !== "number" &&
      image.sizes?.square?.url) ??
    (image && typeof image !== "number" && image.sizes?.card?.url) ??
    (image && typeof image !== "number" && image.url) ??
    null;

  const bannerSrc =
    (direction === "horizontal" &&
      banner &&
      typeof banner !== "number" &&
      banner.sizes?.square?.url) ??
    (banner && typeof banner !== "number" && banner.sizes?.card?.url) ??
    (banner && typeof banner !== "number" && banner.url) ??
    null;

  return (
    <div
      className={cn(
        "@container rounded shadow overflow-clip bg-white grid grid-cols-4 h-full",
        direction === "horizontal" ? "" : "md:flex md:flex-col",
        type === "app" && "flex flex-col md:grid",
      )}
    >
      <div
        className={cn(
          "w-full relative",
          direction === "horizontal"
            ? "@lg:aspect-square @lg:col-span-2 h-full"
            : "md:aspect-[3] lg:aspect-[2]",
          type === "app" && "@max-2xl:aspect-[2]!",
        )}
      >
        {bannerSrc ? (
          <div
            className="h-full w-full relative overflow-hidden bg-cover bg-center"
            style={
              bannerBlur && !bannerReady
                ? { backgroundImage: `url("${bannerBlur}")` }
                : undefined
            }
          >
            <img
              src={bannerSrc}
              alt={
                banner && typeof banner !== "number" ? (banner.alt ?? "") : ""
              }
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={() => setBannerReady(true)}
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
        {imageSrc && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="max-w-2/3 max-h-1/2 relative w-full h-full">
              <img
                src={imageSrc}
                className="absolute inset-0 h-full w-full object-contain"
                alt={
                  image && typeof image !== "number" ? (image.alt ?? "") : ""
                }
              />
            </div>
          </div>
        )}
      </div>
      <div
        className={cn(
          "p-4 @lg:p-8 h-full col-span-3 @lg:col-span-2 flex flex-col ",
          featured ? "card-gradient-dark text-white" : "bg-white text-black",
          variant === "left" && direction === "horizontal" && "@lg:order-first",
          direction === "vertical" && "md:p-8",
        )}
      >
        {linkType === "title" ? (
          <a href={url}>
            <Title />
          </a>
        ) : (
          <div className="flex items-start justify-between">
            <Title />
            <a href={url}>
              <Button
                type="primary"
                className="text-xs md:text-sm py-1 md:py-2 whitespace-nowrap"
              >
                Open app
              </Button>
            </a>
          </div>
        )}
        <div className="flex-1 pb-4 md:pb-8">
          <div
            className={cn(
              "text-sm @2xl:text-base @4xl:text-lg line-clamp-3 overflow-ellipsis",
              direction === "vertical"
                ? "md:line-clamp-6"
                : "@lg:line-clamp-6 @4xl:line-clamp-[8] @6xl:line-clamp-[10] @lg:mb-6",
            )}
          >
            {contentHtml ? (
              <div
                className="payload-richtext"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              children
            )}
          </div>
        </div>
        {keywords && (
          <div
            className={cn(
              "hidden  flex-wrap gap-2",
              direction === "horizontal" ? "@4xl:flex" : "lg:flex",
            )}
          >
            {keywords
              .filter((kw): kw is KeywordLink => typeof kw !== "number")
              .slice(0, 5)
              .map((kw) => (
                <a
                  href={`/keywords/${kw.slug}`}
                  key={kw.slug}
                  className={cn(
                    "rounded border px-2 py-1  text-xs @lg:text-base",
                    featured
                      ? "text-gray-300 border-gray-500 hover:bg-gray-500 hover:text-white"
                      : "text-gray-600 border-gray-400 hover:bg-gray-200 hover:text-gray-800",
                  )}
                >
                  {kw.title}
                </a>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
