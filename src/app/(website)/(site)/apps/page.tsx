import { getPayload } from "payload";
import config from "@payload-config";
import AppCard from "../../components/AppCard";
import Button from "../../components/Button";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";

export default async function Page() {
  const payload = await getPayload({ config });

  const { docs: apps } = await payload.find({
    collection: "apps",
  });

  return (
    <div className="">
      <PageHeader primary="Taupānga" secondary="iNZight apps">
        <div className="flex flex-wrap gap-2">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`#${app.slug}`}
              className="rounded border border-white bg-white px-3 py-1.5 text-sm @lg:text-base text-black hover:bg-gray-100 transition"
            >
              {app.title}
            </Link>
          ))}
        </div>
      </PageHeader>

      <section className="-mt-24 mb-24 flex flex-col gap-8 lg:gap-12 max-w-6xl mx-auto">
        {apps.map((item, index) => (
          <AppCard
            key={item.id}
            id={item.id}
            variant={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </section>
      <div className="bg-linear-245 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  px-8 py-24 lg:py-36 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 place-items-end gap-12 md:gap-24">
          <div className="col-span-2">
            <h4 className="text-2xl mb-8 md:mb-12">Want better apps?</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.{" "}
            </p>
          </div>
          <div className="w-full">
            <Link href="/contact" className="flex flex-col">
              <Button type="alternate">Get in touch</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
