import { getPayload } from "payload";
import config from "@payload-config";
import HeroIntro from "../components/Home/Hero/01-intro";
import HeroData from "../components/Home/Hero/02-data";

import Projects from "../components/Home/Projects";
import Collboaration from "../components/Home/Collaboration";
import Footer from "../components/Footer";

import Link from "next/link";
import Button from "../components/Button";
import { HomeApp, News } from "@payload-types";
import dayjs from "dayjs";

export default async function Home() {
  const payload = await getPayload({ config });
  const { titleGroup, heroGroup } = await payload.findGlobal({
    slug: "homeHero",
  });
  const projectsText = await payload.findGlobal({
    slug: "homeProjects",
  });
  const projects = await payload.find({
    collection: "projects",
    where: {
      featured: {
        equals: true,
      },
    },
  });
  const collaborators = await payload.findGlobal({
    slug: "homeCollaborators",
  });
  const { apps } = await payload.findGlobal({
    slug: "homeApps",
  });
  const news = await payload.find({
    collection: "news",
    sort: ["-date"],
    limit: 1,
  });

  return (
    <div className="text-white">
      <LandingPage title={titleGroup.title} news={news.docs[0]} apps={apps} />
      <HeroIntro title={heroGroup.heroTitle} desc={heroGroup.heroDescription} />
      <HeroData items={heroGroup.heroItems} />
      <Projects text={projectsText} projects={projects.docs} />
      <Collboaration collaborators={collaborators} />
      <Footer />
    </div>
  );
}

function LandingPage({
  title,
  news,
  apps,
}: {
  title: string;
  news: News;
  apps: HomeApp["apps"];
}) {
  title = title.replaceAll("|", "<br/> ");
  return (
    <div className="h-screen text-white pt-[var(--header-height)] flex flex-col">
      <div className="flex-1 relative bg-[url(/bg.jpg)] bg-cover">
        <div className="h-full backdrop-brightness-40 px-8">
          <div className="max-w-6xl mx-auto flex flex-col justify-end h-full pt-24 pb-12 lg:py-24 gap-4 md:gap-12">
            <h1
              className="text-2xl leading-tight sm:text-5xl md:text-7xl xl:text-8xl max-w-6xl z-2 font-display"
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            {/* {title}
            </h1> */}
            {/* <div className="flex md:text-2xl">
              <Button type="alternate" className="">
                Find out how
              </Button>
            </div> */}
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
                {dayjs(news.date).format("DD/MM/YY")}
              </strong>
              {news.title}
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
