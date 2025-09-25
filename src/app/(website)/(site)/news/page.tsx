import { getPayload } from "payload";
import config from "@payload-config";
import NewsCard from "../../components/NewsCard";
import cn from "../../utils/cn";

export default async function Page() {
  const payload = await getPayload({ config });

  const { docs: news } = await payload.find({
    collection: "news",
    pagination: false,
    sort: "-date",
  });

  return (
    <div className="">
      <header className="bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-4 text-white shadow-sm">
        <div className="max-w-6xl flex flex-col gap-8 mx-auto mt-8 lg:mt-36 mb-28">
          <h1 className="text-5xl font-display pb-12 flex gap-8">
            <strong>Ngā Pānui</strong>
            <div className="text-white/75">Latest news</div>
          </h1>
        </div>
      </header>

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
