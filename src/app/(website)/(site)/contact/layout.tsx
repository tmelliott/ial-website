export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <header className="bg-accent-800 p-4 text-white">
        <div className="max-w-4xl flex flex-col gap-8 mx-auto mt-8 lg:mt-48 lg:mb-12 ">
          <h1 className="text-5xl font-display pb-4 border-b">Contact Us</h1>
        </div>
      </header>

      <div className="p-4">
        <section className="py-8 lg:my-24 max-w-4xl mx-auto">
          {children}
        </section>
      </div>
    </div>
  );
}
