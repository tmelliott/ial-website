import { getPayload } from "payload";
import config from "@payload-config";

import cn from "../utils/cn";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { News } from "@payload-types";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { asImage } from "../utils/asImage";

dayjs.extend(advancedFormat);

export default async function NewsCard({
  id,
  featured,
  display,
}: {
  id: number;
  featured?: boolean;
  display?: "card" | "row";
}) {
  featured = featured ?? false;
  display = display ?? "card";

  const payload = await getPayload({ config });
  const newsItem = await payload.findByID({
    collection: "news",
    id: id,
  });

  if (display === "row") return <NewsRow newsItem={newsItem} />;

  const banner = asImage(newsItem.gallery && newsItem.gallery[0]);

  return (
    <Link href={"/news/" + newsItem.slug} className="h-full">
      <div className="@container rounded shadow overflow-clip h-full bg-white">
        <div className="flex flex-col @lg:grid @lg:grid-cols-3 @lg:gap-12 h-full @lg:h-96">
          <div className="w-full aspect-[2.5] @lg:aspect-auto relative hidden md:block @lg:order-last">
            {banner && (
              <Image
                src={banner.url ?? ""}
                fill
                alt={newsItem.title}
                className="h-full w-full shadow object-cover"
              />
            )}
          </div>

          <div
            className={cn(
              "p-8 h-full @lg:col-span-2 just flex flex-col @max-lg:justify-between @lg:flex-col-reverse @lg:justify-end",
              featured
                ? "bg-gradient-to-bl from-black to-accent-950 text-white"
                : "bg-white text-black"
            )}
          >
            <div className="flex flex-col">
              <h4
                className={cn(
                  "text-lg font-semibold mb-2 @lg:mb-4 @lg:mt-8 @lg:text-2xl leading-snug @lg:leading-normal",
                  featured ? "text-white" : "text-black"
                )}
              >
                {newsItem.title}
              </h4>
              <div className="text-sm line-clamp-4 overflow-ellipsis @md:mb-6 flex-1 @max-md:hidden">
                <RichText data={newsItem.content} />
              </div>
            </div>

            <div className="flex text-sm gap-8 justify-between @lg:justify-start order-last pt-8 @lg:pt-0">
              <div className="text-accent-400">
                {dayjs(newsItem.date).format("DD MMMM YYYY")}
              </div>
              <div className={cn(featured ? "text-gray-300" : "text-gray-500")}>
                Publication
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function NewsRow({ newsItem }: { newsItem: News }) {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="grid grid-cols-2 md:grid-cols-6">
        <div className="font-semibold text-gray-700 md:col-span-2 text-sm md:text-base">
          {dayjs(newsItem.date).format("Do MMMM YYYY")}
        </div>
        <div className="text-gray-400 pb-2 text-sm md:text-base text-right md:text-left">
          Miscellaneous
        </div>
        <div className="col-span-2 md:col-span-3 hover:underline">
          <Link href={"/news/" + newsItem.slug}>{newsItem.title}</Link>
        </div>
      </div>
    </div>
  );
}
