import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";

import ProjectCard from "@/app/(website)/components/ProjectCard";
import PersonCard from "@/app/(website)/components/PersonCard";
import NewsCard from "@/app/(website)/components/NewsCard";
import AppCard from "@/app/(website)/components/AppCard";
import Button from "@/app/(website)/components/Button";
import { RichText } from "@payloadcms/richtext-lexical/react";
import cn from "@/app/(website)/utils/cn";

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
      {(item.description ||
        (item.linkGroups && item.linkGroups.length > 0)) && (
        <>
          <div className="pt-8 px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 lg:gap-24">
              {item.description && (
                <div className="col-span-3">
                  <div className="[&_p]:first:text-lg [&_p]:first:font-semibold [&_p]:pb-2 lg:pb-8 prose">
                    <RichText data={item.description} />
                  </div>
                </div>
              )}
              {item.linkGroups && item.linkGroups.length > 0 && (
                <div
                  className={cn(
                    "flex flex-col gap-8 text-sm",
                    item.description
                      ? "col-span-2"
                      : "col-span-full lg:col-span-2 lg:col-start-4"
                  )}
                >
                  {item.linkGroups.map((group) => (
                    <div
                      key={group.id}
                      className={cn(
                        "border border-gray-100 shadow-sm p-8 rounded",
                        group.featured && "card-gradient-feature text-white"
                      )}
                    >
                      {group.label && (
                        <h5 className="font-semibold pb-4">{group.label}</h5>
                      )}
                      <div className="flex flex-col gap-4">
                        {group.groupLinks.map((link) => (
                          <Link
                            href={link.link}
                            key={link.id}
                            className="flex flex-col"
                          >
                            <Button
                              type={group.featured ? "alternate" : "primary"}
                            >
                              {link.description || link.link}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="h-48 w-full bg-gradient-to-b from-white to-[#F0F0F0]"></div>
        </>
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
