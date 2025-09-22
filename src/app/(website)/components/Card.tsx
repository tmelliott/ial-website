import cn from "../utils/cn";

import BannerImage from "./media/BannerImage";
import { Image, Keyword } from "@payload-types";
import { ReactNode } from "react";

export default async function Card({
  title,
  image,
  keywords,
  variant = "left",
  featured = false,
  direction = "horizontal",
  children,
}: {
  title: string;
  image?: number | Image | null | undefined;
  keywords?: (number | Keyword)[] | null;
  variant?: "left" | "right";
  featured?: boolean;
  direction?: "horizontal" | "vertical";
  children: ReactNode;
}) {
  void featured;
  return (
    <div
      className={cn(
        "@container rounded shadow overflow-clip bg-white grid grid-cols-4 h-full",
        direction === "horizontal" ? "" : "md:flex md:flex-col"
      )}
    >
      <div
        className={cn(
          "w-full relative",
          direction === "horizontal"
            ? "@lg:aspect-square @lg:col-span-2"
            : "md:aspect-[3] lg:aspect-[2]"
        )}
      >
        <BannerImage
          image={image}
          size={direction === "horizontal" ? "square" : "card"}
        />
      </div>
      <div
        className={cn(
          "p-4 @lg:p-8 h-full bg-white text-black col-span-3 @lg:col-span-2 flex flex-col",
          variant === "left" && direction === "horizontal" && "@lg:order-first",
          direction === "vertical" && "md:p-8"
        )}
      >
        <h4
          className={cn(
            "text-lg @lg:text-xl @4xl:text-3xl font-semibold mb-2 @lg:mb-4 text-accent-500",
            direction === "vertical" && "mb-4"
          )}
        >
          {title}
        </h4>
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
                <div
                  key={kw.slug}
                  className={cn(
                    "rounded border px-2 py-1 text-gray-400 border-gray-400 text-xs @lg:text-base"
                  )}
                >
                  {index === 4 && keywords.length > 5
                    ? `+${keywords.length - 4} more`
                    : kw.title}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
