import { getPayload } from "payload";
import config from "@payload-config";

import cn from "../utils/cn";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { asImage } from "../(site)/news/page";
import { News } from "@payload-types";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

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
    <div className="@container rounded shadow overflow-clip">
      <Link href={"/news/" + newsItem.slug}>
        <div className="w-full aspect-video relative hidden md:block">
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
            "p-4 md:p-8 h-full",
            featured
              ? "bg-gradient-to-bl from-black to-accent-950 text-white"
              : "bg-white text-black"
          )}
        >
          <h4
            className={cn(
              "text-lg font-semibold mb-2 md:mb-4",
              featured ? "text-white" : "text-accent-500"
            )}
          >
            {newsItem.title}
          </h4>
          <div className="text-sm line-clamp-3 lg:line-clamp-6 overflow-ellipsis md:mb-6 flex-1">
            <RichText data={newsItem.content} />
          </div>
          {newsItem.keywords && (
            <div className="hidden md:flex flex-wrap gap-2 text-xs">
              {newsItem.keywords.map((kw) => {
                if (typeof kw === "number") return <></>;
                return (
                  <div
                    key={kw.slug}
                    className={cn(
                      " rounded border px-2 py-1",
                      featured
                        ? "text-gray-300 border-gray-300"
                        : "text-gray-600 border-gray-600"
                    )}
                  >
                    {kw.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Link>
    </div>
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
