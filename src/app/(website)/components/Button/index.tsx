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
  const btnVariant = variant ?? "filled";
  return (
    <button
      className={cn(
        className,
        "font-bold py-2 px-4 rounded-sm cursor-pointer shadow transition whitespace-nowrap flex justify-center items-center",
        variant === "filled" ? "" : "border",
        type === "primary" &&
          (variant === "filled"
            ? "bg-accent-800 text-accent-100"
            : "border-accent-800 text-accent-800 hover:bg-accent-800 hover:text-accent-100"),
        type === "secondary" &&
          (variant === "filled"
            ? "bg-secondary-800 text-secondary-100"
            : "border-secondary-800 text-secondary-800 hover:bg-secondary-800 hover:text-secondary-100"),
        type === "alternate" &&
          (variant === "filled"
            ? "bg-black text-white"
            : "border-black text-black hover:bg-black hover:text-white")
      )}
      {...props}
    >
      {children}
    </button>
  );
}
