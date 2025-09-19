import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import cn from "../../utils/cn";
import NextImage from "next/image";
import dayjs from "dayjs";
import { asImage } from "../../utils/asImage";

export default async function Page() {
  const payload = await getPayload({ config });

  const { heading } = await payload.findGlobal({
    slug: "newsPage",
  });
  const { docs: news } = await payload.find({
    collection: "news",
    pagination: false,
    sort: "-date",
  });

  return (
    <div className="">
      <header className="bg-accent-800 p-4 text-white">
        <div className="max-w-4xl flex flex-col gap-8 mx-auto mt-8 lg:mt-48 lg:mb-12 ">
          <h1 className="text-5xl font-display pb-4 border-b">
            News and Updates
          </h1>

          {heading && (
            <div className="flex-1 text-lg lg:text-xl">
              <RichText data={heading} />
            </div>
          )}
        </div>
      </header>

      <div className="p-4 bg-gray-100">
        <section className="my-8 lg:my-24 flex flex-col gap-8 lg:gap-12 max-w-4xl mx-auto">
          {news.map((item, i) => {
            const banner = asImage(item.gallery && item.gallery[0]);
            return (
              <div
                key={item.id}
                className={cn(
                  "w-full gap-2",
                  i > 0 ? "grid grid-cols-4" : "flex flex-col"
                )}
              >
                <div className="space-y-2 col-start-2 col-span-4">
                  <div className="text-sm text-gray-500">
                    {dayjs(item.date).format("DD MMMM YYYY")}
                  </div>
                  <Link
                    href={"/news/" + item.slug}
                    className={cn(
                      "text-accent-600 text-2xl",
                      i > 0 && "text-lg"
                    )}
                  >
                    {item.title}
                  </Link>
                </div>
                {/* {banner && ( */}
                <div
                  className={cn(
                    "w-full relative row-span-2 row-start-1",
                    i === 0 ? "aspect-video" : "h-full bg-gray-300/10 rounded"
                  )}
                >
                  {banner && (
                    <NextImage
                      src={banner.url ?? ""}
                      fill
                      alt={banner.description ?? ""}
                      className="object-cover"
                    />
                  )}
                </div>
                {/* )} */}
                <div className="space-y-2 col-start-2 col-span-3">
                  <div
                    className={cn(
                      "text-sm line-clamp-3 lg:line-clamp-6 overflow-ellipsis",
                      i === 0 && "line-clamp-6 lg:line-clamp-[10]"
                    )}
                  >
                    <RichText data={item.content} />
                  </div>
                  {item.keywords && (
                    <div className="flex flex-wrap gap-x-4 text-xs pt-2">
                      {item.keywords.map((kw) => {
                        if (typeof kw === "number") return <></>;
                        return (
                          <div key={kw.id} className="text-gray-500">
                            #{kw.title}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
