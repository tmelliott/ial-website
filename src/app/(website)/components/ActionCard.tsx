import Link from "next/link";
import Button from "./Button";
import cn from "../utils/cn";
import { RichText } from "@payloadcms/richtext-lexical/react";

type RichTextProps = Parameters<typeof RichText>[0]["data"];

export default function ActionCard({
  title,
  description,
  variant = "bright",
  button,
}: {
  title?: string;
  description?: RichTextProps | null;
  variant: "bright" | "feature" | "feature-rev";
  button?: {
    text: string;
    url: string;
  };
}) {
  return (
    <div
      className={cn(
        "p-8 flex flex-col gap-4 justify-between rounded shadow text-white h-full",
        variant === "bright" ? "card-gradient-bright" : "card-gradient-feature",
        variant === "feature-rev" && "bg-linear-330"
      )}
    >
      {title && <h4 className="text-lg lg:text-3xl font-semibold">{title}</h4>}
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
      {button && (
        <Link href={button.url} className="mt-4 lg:mt-6">
          <Button type="alternate" className="rounded border-white/75">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
}
