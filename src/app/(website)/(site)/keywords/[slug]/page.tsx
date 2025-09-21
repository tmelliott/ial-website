import { getPayload } from "payload";
import config from "@payload-config";
// import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
// import Link from "next/link";
import Button from "@/app/(website)/components/Button";

import bgImage from "../../../bg.jpg";
import ProjectCard from "@/app/(website)/components/ProjectCard";
import PersonCard from "@/app/(website)/components/PersonCard";
import NewsCard from "@/app/(website)/components/NewsCard";
import AppCard from "@/app/(website)/components/AppCard";

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "keywords",
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
    collection: "keywords",
    where: {
      slug: {
        equals: slug,
      },
    },
    joins: {
      apps: {
        count: false,
      },
      projects: {
        count: false,
      },
      team: {
        count: false,
      },
      news: {
        count: false,
      },
    },
  });

  const item = result.docs[0];
  const apps = item.apps?.docs?.filter((d) => typeof d !== "number");
  const projects = item.projects?.docs?.filter((d) => typeof d !== "number");
  const team = item.team?.docs?.filter((d) => typeof d !== "number");
  const news = item.news?.docs?.filter((d) => typeof d !== "number");

  return (
    <div className="">
      <header className="lg:h-96 bg-black flex justify-center items-end relative">
        <div className="absolute h-full w-full opacity-50">
          <Image
            src={bgImage}
            fill
            alt="Bg image"
            className="h-full w-full object-cover object-top"
          />
        </div>
        <hgroup className="max-w-6xl w-full z-10 py-8 mx-8">
          <h1 className="text-white pt-4 lg:pt-6 lg:pb-4 text-2xl lg:text-4xl font-display leading-tight flex flex-col lg:flex-row gap-8 lg:items-center">
            Everything tagged with
            <Button className="border-4" type="alternate">
              {item.title}
            </Button>
          </h1>
        </hgroup>
      </header>

      <div className="flex justify-center items-end">
        <div className="max-w-6xl mx-4 flex flex-col w-full gap-24 py-12">
          {apps && apps.length > 0 && (
            <section className="flex flex-col gap-8">
              <h3 className="flex gap-8 text-gray-600">
                <strong>Apps</strong> tagged with &apos;{item.title}&apos;
              </h3>
              <div className="flex flex-col gap-6 md:gap-12">
                {apps.map((app, i) => (
                  <AppCard
                    key={app.id}
                    id={app.id}
                    variant={i % 2 == 0 ? "left" : "right"}
                  />
                ))}
              </div>
            </section>
          )}

          {projects && projects.length > 0 && (
            <section className="flex flex-col gap-8">
              <h3 className="flex gap-8 text-gray-600">
                <strong>Projects</strong> tagged with &apos;{item.title}&apos;
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    direction="vertical"
                  />
                ))}
              </div>
            </section>
          )}

          {team && team.length > 0 && (
            <section className="flex flex-col gap-8">
              <h3 className="flex gap-8 text-gray-600">
                <strong>People</strong> tagged with &apos;{item.title}&apos;
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {team.map((person) => (
                  <PersonCard key={person.id} id={person.id} />
                ))}
              </div>
            </section>
          )}

          {news && news.length > 0 && (
            <section className="flex flex-col gap-8">
              <h3 className="flex gap-8 text-gray-600">
                <strong>News</strong> tagged with &apos;{item.title}&apos;
              </h3>
              <div className="flex flex-col gap-4 md:gap-12">
                {news.map((item) => (
                  <NewsCard key={item.id} id={item.id} display="row" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
