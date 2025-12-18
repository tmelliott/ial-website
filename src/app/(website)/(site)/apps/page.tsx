import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import AppCard from "../../components/AppCard";
import Button from "../../components/Button";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import { RichText } from "@payloadcms/richtext-lexical/react";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config });
  const { metadata } = await payload.findGlobal({ slug: "appsPage" });
  const { metadata: generalMetadata } = await payload.findGlobal({
    slug: "general",
  });

  const title =
    metadata?.title || generalMetadata?.title || "Apps - iNZight Analytics Ltd";
  const description =
    metadata?.description ||
    generalMetadata?.description ||
    "Explore iNZight apps for data analysis and visualisation.";

  const imageUrl =
    (metadata?.image &&
      typeof metadata.image !== "number" &&
      metadata.image.url) ||
    (generalMetadata?.image &&
      typeof generalMetadata.image !== "number" &&
      generalMetadata.image.url) ||
    undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

export default async function Page() {
  const payload = await getPayload({ config });

  const { heading, description } = await payload.findGlobal({
    slug: "appsPage",
  });

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
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 place-items-start gap-12 md:gap-24 items-end">
          <div className="col-span-2">
            <h4 className="text-2xl mb-8 md:mb-12">{heading}</h4>
            {description && <RichText data={description} />}
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
