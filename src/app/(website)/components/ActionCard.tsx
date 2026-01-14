import Link from "next/link";
import Button from "./Button";
import cn from "../utils/cn";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Keyword } from "@payload-types";

type RichTextProps = Parameters<typeof RichText>[0]["data"];

export default function ActionCard({
  title,
  description,
  variant = "bright",
  button,
  workstreams,
}: {
  title?: string;
  description?: RichTextProps | null;
  variant: "bright" | "feature" | "feature-rev";
  button?: {
    text: string;
    url: string;
  };
  workstreams?: (number | Keyword)[];
}) {
  return (
    <div className="@container rounded shadow text-white h-full overflow-clip">
      <div
        className={cn(
          "p-8 hidden @3xs:flex flex-col gap-4 justify-between h-full",
          variant === "bright"
            ? "card-gradient-bright"
            : "card-gradient-feature",
          variant === "feature-rev" && "bg-linear-330"
        )}
      >
        {title && (
          <h4 className="text-lg lg:text-3xl font-semibold">{title}</h4>
        )}
        {description && (
          <div
            className={cn(
              "",
              title
                ? "text-sm"
                : "text-lg lg:text-2xl font-semibold pr-12 leading-normal"
            )}
          >
            <RichText data={description} />
          </div>
        )}
        {workstreams && workstreams.length > 0 ? (
          <div className="mt-4 lg:mt-6">
            <h5 className="text-lg @lg:text-xl font-semibold mb-2">
              Explore our workstreams
            </h5>
            <div className="flex flex-wrap gap-2">
              {workstreams
                .filter((kw) => typeof kw !== "number")
                .map((kw) => {
                  const keyword = kw as Keyword;
                  return (
                    <Link
                      key={keyword.id}
                      href={`/keywords/${keyword.slug}`}
                      className="rounded border border-white text-white px-3 py-1.5 text-sm @lg:text-base hover:bg-white hover:text-black transition"
                    >
                      {keyword.title}
                    </Link>
                  );
                })}
            </div>
          </div>
        ) : (
          button && (
            <Link href={button.url} className="mt-4 lg:mt-6">
              <Button type="alternate" className="rounded border-white/75">
                {button.text}
              </Button>
            </Link>
          )
        )}
      </div>
      {(button || (workstreams && workstreams.length > 0)) && (
        <div className={cn("@3xs:hidden p-4")}>
          {workstreams && workstreams.length > 0 ? (
            <div>
              <h5 className="text-xs font-semibold mb-2">Our workstreams</h5>
              <div className="flex flex-wrap gap-2">
                {workstreams
                  .filter((kw) => typeof kw !== "number")
                  .map((kw) => {
                    const keyword = kw as Keyword;
                    return (
                      <Link
                        key={keyword.id}
                        href={`/keywords/${keyword.slug}`}
                        className="rounded border border-white bg-white px-2 py-1 text-xs text-black hover:bg-gray-100 transition"
                      >
                        {keyword.title}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ) : (
            button && (
              <Link href={button.url}>
                <div
                  className={cn(
                    "h-full text-xs",
                    variant === "bright"
                      ? "card-gradient-bright"
                      : "card-gradient-feature"
                  )}
                >
                  {title}
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
