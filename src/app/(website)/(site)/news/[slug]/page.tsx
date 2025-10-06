import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";
import { asImage } from "@/app/(website)/utils/asImage";
import dayjs from "dayjs";
import Button from "@/app/(website)/components/Button";
import getPlaceholder from "@/app/(website)/utils/getPlaceholder";
import cn from "@/app/(website)/utils/cn";

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "news",
    where: {
      _status: {
        equals: "published",
      },
    },
    pagination: false,
  });

  return result.docs.map((item) => ({
    slug: item.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "news",
    where: {
      slug: {
        equals: slug,
      },
      _status: {
        equals: "published",
      },
    },
    limit: 1,
  });
  const item = result.docs[0];
  const banner = asImage(item.gallery && item.gallery[0]);

  const news = await payload.find({
    collection: "news",
    where: {
      slug: {
        not_equals: slug,
      },
    },
    sort: "-date",
    limit: 3,
  });

  const placeholderImg = await getPlaceholder(banner?.url);

  return (
    <div className="">
      {/* header */}
      <header className="pt-24 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 lg:gap-24">
          <div className="col-span-3">
            <div className="text-gray-400 pb-4 font-semibold">
              News / {item.newstype}
            </div>
            <h1 className="text-4xl leading-tight pb-4">{item.title}</h1>
            <div className="text-accent-400 font-semibold">
              {dayjs(item.date).format("DD MMMM YYYY")}
            </div>
          </div>
          {/* keywords */}
          <div className="col-span-2 pt-12">
            <div className="flex gap-4 flex-wrap">
              {item.keywords
                ?.filter((kw) => typeof kw !== "number")
                .map((kw) => (
                  <Button
                    key={kw.id}
                    type="alternate"
                    className="text-gray-400 border-gray-400 text-xs lg:text-sm"
                  >
                    {kw.title}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </header>
      <div
        className={cn(
          "h-48 ",
          banner && "bg-gradient-to-b from-white to-[#F0F0F0]"
        )}
      ></div>
      <div className="-mt-36 px-8 mb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 lg:gap-24">
          <div className="col-span-3">
            <div className="flex justify-center">
              {banner && typeof banner !== "number" && (
                <div className="relative rounded shadow mb-12 w-full aspect-video bg-gray-500 overflow-clip">
                  <Image
                    src={banner.url ?? ""}
                    sizes="700px"
                    fill
                    alt={banner.description ?? item.title}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={placeholderImg}
                  />
                </div>
              )}
            </div>

            <div className="[&_p]:first:text-lg [&_p]:first:font-semibold [&_p]:pb-2 pb-12">
              <RichText data={item.content} />
            </div>

            <div className="flex flex-col gap-4">
              {item.link?.map((l) => (
                <Link key={l.id} href={l.url}>
                  <Button type="primary">{l.label}</Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="col-span-2 lg:mt-36 pt-12">
            <div className="text-lg font-bold text-gray-500 pb-4">
              Recent news
            </div>
            {news.docs.map((newsitem) => (
              <div key={newsitem.id} className="border-t border-gray-200 py-4">
                <h5 className="font-semibold text-lg pb-4">
                  <Link href={`/news/${newsitem.slug}`}>{newsitem.title}</Link>
                </h5>
                <p className="text-sm text-accent-400 font-semibold">
                  {dayjs(newsitem.date).format("DD MMMM YYYY")}
                </p>
                <p className="text-gray-400 text-sm">{newsitem.newstype}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
