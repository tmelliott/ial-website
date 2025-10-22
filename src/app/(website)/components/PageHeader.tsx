export default function PageHeader({
  primary,
  secondary,
  children,
}: {
  primary: string;
  secondary?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-8 text-white shadow-sm">
      <div className="max-w-6xl grid lg:grid-cols-2 gap-8 mx-auto pt-12 lg:pt-36 mb-20">
        <h1 className="text-6xl font-display pb-12 flex flex-col gap-4">
          <div>{primary}</div>
          {secondary && <div className="text-white/75">{secondary}</div>}
        </h1>
        <div className="text-2xl">{children}</div>
      </div>
    </header>
  );
}
