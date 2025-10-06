import { getPayload } from "payload";
import config from "@payload-config";

import dayjs from "dayjs";
import Link from "next/link";
import Button from "../../components/Button";

import bgImage from "./bg.jpg";
import Image from "next/image";

export default async function LandingPage() {
  const payload = await getPayload({ config });
  const { titleGroup } = await payload.findGlobal({
    slug: "homeHero",
  });
  const { apps } = await payload.findGlobal({
    slug: "homeApps",
  });
  const news = await payload.find({
    collection: "news",
    where: {
      _status: {
        equals: "published",
      },
    },
    sort: ["-date"],
    limit: 1,
  });

  const title = titleGroup.title.replaceAll("|", "<br/> ");
  return (
    <div className="h-screen text-white pt-[var(--header-height)] flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute h-full w-full">
          <Image src={bgImage} fill alt="bgimage" placeholder="blur" sizes="" />
        </div>
        <div className="h-full backdrop-brightness-40 px-8">
          <div className="max-w-6xl mx-auto flex flex-col justify-end h-full pt-24 pb-12 lg:py-24 gap-4 md:gap-12">
            <h1 className="text-4xl leading-tight sm:text-5xl md:text-7xl xl:text-8xl max-w-6xl z-2 font-display">
              <div
                dangerouslySetInnerHTML={{
                  __html: title,
                }}
                className="hidden md:block"
              ></div>
              <div className="md:hidden">
                {titleGroup.title.replaceAll("|", " ")}
              </div>
            </h1>
          </div>
        </div>
      </div>
      <div className="bg-black p-6 md:p-12">
        {/* info panel at the bottom */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 lg:gap-12 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-3">
            <h5 className="uppercase text-sm text-gray-300">Latest news</h5>
            <div>
              <strong className="font-bold mr-2">
                {dayjs(news.docs[0].date).format("DD/MM/YY")}
              </strong>
              {news.docs[0].title}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-4 w-full">
            <h5 className="uppercase text-sm text-gray-300">Quick links</h5>
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
              {apps &&
                apps.map((app) => (
                  <Link href={app.url} key={app.id}>
                    <Button
                      type="alternate"
                      className="lg:py-4 lg:px-4 text-sm lg:text-base w-full"
                    >
                      {app.title}
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
