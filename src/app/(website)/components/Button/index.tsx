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
        "font-bold py-2 px-4 cursor-pointer shadow transition  flex justify-center items-center",
        variant === "filled" ? "" : "border",

        type === "primary" &&
          (variant === "filled"
            ? "bg-accent-600 text-accent-50 hover:bg-accent-700"
            : "border-[#E83150] text-[#E83150] hover:bg-[#E83150] hover:text-accent-50"),
        type === "secondary" &&
          (variant === "filled"
            ? "bg-secondary-600 text-secondary-50 hover:bg-secondary-700"
            : "border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-secondary-50"),
        type === "alternate" &&
          (variant === "filled"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "border-white text-white hover:bg-white hover:text-black dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
