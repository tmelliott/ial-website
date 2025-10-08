import { Keyword } from "@payload-types";
import Link from "next/link";
import cn from "../utils/cn";

export default function KeywordButton({
  kw,
  size = "md",
  variant = "light",
}: {
  kw: Keyword;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}) {
  return (
    <Link
      href={`/keywords/${kw.slug}`}
      key={kw.slug}
      className={cn(
        "rounded border px-2 py-1",
        variant === "dark"
          ? "text-gray-400 border-gray-500 hover:bg-gray-500 hover:text-gray-50"
          : "text-gray-400 border-gray-300 hover:bg-gray-300 hover:text-gray-800",
        //   handle size
        size === "sm" && "text-xs",
        size === "md" && "text-sm @lg:text-base",
        size === "lg" && "text-lg"
      )}
    >
      {kw.title}
    </Link>
  );
}
