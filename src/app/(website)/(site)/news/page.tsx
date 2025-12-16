import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import NewsCard from "../../components/NewsCard";
import cn from "../../utils/cn";
import PageHeader from "../../components/PageHeader";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config });
  const { metadata } = await payload.findGlobal({ slug: "newsPage" });
  const { metadata: generalMetadata } = await payload.findGlobal({
    slug: "general",
  });

  const title =
    metadata?.title ||
    generalMetadata?.title ||
    "News - iNZight Analytics Ltd";
  const description =
    metadata?.description ||
    generalMetadata?.description ||
    "Latest news and updates from iNZight Analytics Ltd.";

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

  const { docs: news } = await payload.find({
    collection: "news",
    pagination: false,
    where: {
      _status: {
        equals: "published",
      },
    },
    sort: "-date",
  });

  return (
    <div className="">
      <PageHeader primary="Ngā Pānui" secondary="Latest news" />

      <div className="px-8">
        <section className="-mt-24 mb-24 flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
          {news.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                index > 3 || index === 0 ? "col-span-full" : "",
                index === 1 && "md:col-span-2 lg:col-span-1"
              )}
            >
              <NewsCard
                id={item.id}
                featured={index === 1}
                display={index > 3 ? "row" : "card"}
              />
            </div>
          ))}
        </section>
      </div>

      <div className="bg-linear-355 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-4 h-68"></div>
    </div>
  );
}
