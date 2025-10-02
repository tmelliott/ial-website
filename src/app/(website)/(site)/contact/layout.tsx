export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <div className="bg-linear-200 from-15% from-[var(--color-bg-gradient-start)] to-[150%] to-[var(--color-bg-gradient-end)]  p-8 text-white shadow-sm pb-12 lg:pb-24">
        <div className="max-w-6xl flex flex-col lg: justify-between gap-8 mx-auto pt-12 lg:pt-36">
          <header>
            <h1 className="text-6xl font-display pb-12 flex flex-col gap-4">
              <div>Whakapā Mai</div>
              <div className="text-white/75">Contact us</div>
            </h1>
            <div className="text-2xl"></div>
          </header>
          <section className="">{children}</section>
        </div>
      </div>
    </div>
  );
}
