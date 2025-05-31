import cn from "../../utils/cn";

export default function Button({
  children,
  type,
  variant,
  className,
  ...props
}: {
  children: React.ReactNode;
  type: "primary" | "secondary" | "alternate";
  variant?: "filled" | "outlined";
  className?: string;
  // [x: string]:
}) {
  // const btnVariant = variant ?? "filled";
  return (
    <button
      className={cn(
        className,
        "font-bold py-2 px-4 rounded-sm cursor-pointer shadow transition whitespace-nowrap flex justify-center items-center",
        variant === "filled" ? "" : "border",
        type === "primary" &&
          (variant === "filled"
            ? "bg-accent-600 text-accent-50 hover:bg-accent-700"
            : "border-accent-600 text-accent-600 hover:bg-accent-600 hover:text-accent-50"),
        type === "secondary" &&
          (variant === "filled"
            ? "bg-secondary-600 text-secondary-50 hover:bg-secondary-700"
            : "border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-secondary-50"),
        type === "alternate" &&
          (variant === "filled"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black")
      )}
      {...props}
    >
      {children}
    </button>
  );
}
