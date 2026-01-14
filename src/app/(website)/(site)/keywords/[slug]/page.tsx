import { getPayload } from "payload";
import config from "@payload-config";

import ProjectCard from "@/app/(website)/components/ProjectCard";
import PersonCard from "@/app/(website)/components/PersonCard";
import NewsCard from "@/app/(website)/components/NewsCard";
import AppCard from "@/app/(website)/components/AppCard";
import { RichText } from "@payloadcms/richtext-lexical/react";

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
      <header className="lg:h-56 bg-black flex justify-center items-end relative">
        <hgroup className="max-w-6xl w-full z-10 py-8 mx-8">
          <h1 className="text-white pt-4 lg:pt-6 lg:pb-4 text-6xl leading-tight">
            {item.heading || item.title}
          </h1>
        </hgroup>
      </header>
      {item.description && (
        <div className="flex items-center flex-col">
          <section className="max-w-6xl mx-4 py-12 w-full">
            <RichText data={item.description} />
          </section>

          <div className="h-48 w-full bg-gradient-to-b from-white to-[#F0F0F0]"></div>
        </div>
      )}

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
