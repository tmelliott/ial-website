import type { ReactNode } from "react";
import { cn } from "./cn";

export default function Button({
  children,
  type,
  variant,
  className,
  href,
}: {
  children: ReactNode;
  type: "primary" | "secondary" | "alternate";
  variant?: "filled" | "outlined";
  className?: string;
  href?: string;
}) {
  const isOutlined = variant !== "filled";

  const classes = cn(
    "min-h-11 py-2 px-4 cursor-pointer shadow-card transition flex justify-center items-center rounded",
    isOutlined && "border",
    type === "primary" &&
      (isOutlined
        ? "border-accent-stripe text-accent-text hover:bg-accent-fill hover:border-accent-fill hover:text-white"
        : "bg-accent-fill text-white hover:bg-accent-fill-hover"),
    type === "secondary" &&
      (isOutlined
        ? "border-black text-black hover:bg-black hover:text-white"
        : "bg-black text-white hover:bg-white hover:text-black"),
    type === "alternate" &&
      (isOutlined
        ? "border-white text-white hover:bg-white hover:text-black dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        : "bg-black text-white dark:bg-white dark:text-black"),
    className,
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return <button className={classes}>{children}</button>;
}
