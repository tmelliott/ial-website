import Link from "next/link";
import cn from "../utils/cn";

import BannerImage from "./media/BannerImage";
import { Image, Keyword } from "@payload-types";
import { ReactNode } from "react";
import Button from "./Button";

export default async function Card({
  title,
  image,
  keywords,
  url,
  type,
  linkType = "title",
  variant = "left",
  featured = false,
  direction = "horizontal",
  children,
}: {
  title: string;
  image?: number | Image | null | undefined;
  keywords?: (number | Keyword)[] | null;
  url: string;
  type: "project" | "app";
  linkType?: "title" | "button";
  variant?: "left" | "right";
  featured?: boolean;
  direction?: "horizontal" | "vertical";
  children: ReactNode;
}) {
  const Title = () => (
    <h4
      className={cn(
        "text-lg @lg:text-xl @4xl:text-3xl font-semibold mb-2 @lg:mb-4 hover:underline",
        featured ? "text-white" : "text-accent-500",
        direction === "vertical" && "mb-4"
      )}
    >
      {title}
    </h4>
  );
  return (
    <div
      className={cn(
        "@container rounded shadow overflow-clip bg-white grid grid-cols-4 h-full",
        direction === "horizontal" ? "" : "md:flex md:flex-col",
        type === "app" && "flex flex-col md:grid"
        // "grid-rows-2 grid-cols-1 md:grid-cols-4 md:grid-rows-1"
      )}
    >
      <div
        className={cn(
          "w-full",
          direction === "horizontal"
            ? "@lg:aspect-square @lg:col-span-2 h-full"
            : "md:aspect-[3] lg:aspect-[2]",
          type === "app" && "@max-2xl:aspect-[2]!"
        )}
      >
        <BannerImage
          image={image}
          variant={direction === "horizontal" ? "square" : "card"}
        />
      </div>
      <div
        className={cn(
          "p-4 @lg:p-8 h-full col-span-3 @lg:col-span-2 flex flex-col",
          featured ? "card-gradient-dark text-white" : "bg-white text-black",
          variant === "left" && direction === "horizontal" && "@lg:order-first",
          direction === "vertical" && "md:p-8"
        )}
      >
        {linkType === "title" ? (
          <Link href={url}>
            <Title />
          </Link>
        ) : (
          <div className="flex items-start justify-between">
            <Title />
            <Link href={url}>
              <Button
                type="primary"
                className="text-xs md:text-sm py-1 md:py-2"
              >
                Open app
              </Button>
            </Link>
          </div>
        )}
        <div className="flex-1 pb-4 md:pb-8">
          <div
            className={cn(
              "text-sm @2xl:text-base @4xl:text-lg line-clamp-3 overflow-ellipsis",
              direction === "vertical"
                ? "md:line-clamp-6"
                : "@lg:line-clamp-6 @4xl:line-clamp-[8] @6xl:line-clamp-[10] @lg:mb-6"
            )}
          >
            {children}
          </div>
        </div>
        {keywords && (
          <div
            className={cn(
              "hidden  flex-wrap gap-2",
              direction === "horizontal" ? "@4xl:flex" : "lg:flex"
            )}
          >
            {keywords.map((kw, index) => {
              if (typeof kw === "number") return;
              if (index > 4 && keywords.length > 5) return;

              return (
                <Link
                  href={`/keywords/${kw.slug}`}
                  key={kw.slug}
                  className={cn(
                    "rounded border px-2 py-1  text-xs @lg:text-base",
                    featured
                      ? "text-gray-400 border-gray-500 hover:bg-gray-500 hover:text-gray-50"
                      : "text-gray-400 border-gray-300 hover:bg-gray-300 hover:text-gray-800"
                  )}
                >
                  {index === 4 && keywords.length > 5
                    ? `+${keywords.length - 4} more`
                    : kw.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
