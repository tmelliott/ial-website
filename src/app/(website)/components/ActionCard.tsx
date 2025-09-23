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
  title: string;
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
        "bg-linear-150 from-15 to-[125%] p-8 flex flex-col gap-4 justify-between rounded shadow text-white",
        variant === "bright"
          ? "from-[#E83150] to-[#C42943]"
          : "from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)]",
        variant === "feature-rev" && "bg-linear-330"
      )}
    >
      <h4 className="text-lg lg:text-3xl font-semibold">{title}</h4>
      {description && (
        <div className="text-sm">
          <RichText data={description} />
        </div>
      )}
      {button && (
        <Link href={button.url} className="mt-4 lg:mt-6">
          <Button type="alternate">{button.text}</Button>
        </Link>
      )}
    </div>
  );
}
