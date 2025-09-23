import { getPayload } from "payload";
import config from "@payload-config";
import AppCard from "../../components/AppCard";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default async function Page() {
  const payload = await getPayload({ config });

  const appsPage = await payload.findGlobal({
    slug: "appsPage",
  });
  const { docs: apps } = await payload.find({
    collection: "apps",
  });

  return (
    <div className="">
      <header className="bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-4 text-white shadow-sm">
        <div className="max-w-6xl flex flex-col gap-8 mx-auto mt-8 lg:grid lg:grid-cols-2 lg:mt-48 lg:mb-24 pb-12">
          <h1 className="text-5xl font-display">iNZight apps</h1>
          {appsPage.heading && <RichText data={appsPage.heading} />}
        </div>
      </header>

      <section className="-mt-24 mb-24 flex flex-col gap-8 lg:gap-12 max-w-6xl mx-auto">
        {apps.map((item, index) => (
          <AppCard
            key={item.id}
            id={item.id}
            variant={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </section>

      <div className="bg-linear-355 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-4 h-68"></div>
    </div>
  );
}
