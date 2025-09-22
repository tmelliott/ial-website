import { getPayload } from "payload";
import config from "@payload-config";
import Button from "../../components/Button";
import Link from "next/link";
import NewsCard from "../../components/NewsCard";

export default async function LatestNews() {
  const payload = await getPayload({ config });
  const { teamTitle, card } = await payload.findGlobal({
    slug: "homeNews",
  });
  const news = await payload.find({
    collection: "news",
    limit: card?.label ? 3 : 4,
    sort: "-date",
  });

  return (
    <div className="px-8 py-24 text-black">
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-12 w-full">
          <h3 className="text-2xl">{teamTitle}</h3>

          <div className="flex items-center gap-12">
            <p className="text-sm hidden md:block">
              {/* Want to see more of our work? */}
            </p>
            <Link href="/news">
              <Button
                type="primary"
                className="text-sm text-gray-600 border-gray-600"
              >
                All news
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {news.docs
            .filter((x) => typeof x !== "number")
            .map((item) => (
              <div key={item.id} className="first:col-span-full">
                <NewsCard id={item.id} />
              </div>
            ))}

          {card?.label && (
            <div className="grid grid-cols-1 gap-12 md:row-start-2">
              <div className="bg-linear-150 from-15 from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)] first:from-[#E83150] first:to-[#C42943] p-8 flex flex-col gap-4 justify-between rounded shadow text-white">
                <h4 className="text-lg lg:text-3xl font-semibold">
                  {card.label}
                </h4>
                <Link href={card.linkUrl ?? ""}>
                  <Button type="alternate">{card.linkText}</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
