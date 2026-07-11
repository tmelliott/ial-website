import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";

import ProjectCard from "@/app/(website)/components/ProjectCard";
import PersonCard from "@/app/(website)/components/PersonCard";
import NewsCard from "@/app/(website)/components/NewsCard";
import AppCard from "@/app/(website)/components/AppCard";
import Button from "@/app/(website)/components/Button";
import { RichText } from "@/app/(website)/components/RichText";
import cn from "@/app/(website)/utils/cn";

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function KeywordEmptyState({ title }: { title: string }) {
  return (
    <div className="">
      <header className="lg:h-56 bg-black flex justify-center items-end relative">
        <hgroup className="max-w-6xl w-full z-10 py-8 mx-8">
          <h1 className="text-white pt-4 lg:pt-6 lg:pb-4 text-6xl leading-tight">
            {title}
          </h1>
        </hgroup>
      </header>
      <div className="pt-8 px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-lg text-gray-700">
            There&apos;s no content for this keyword yet.
          </p>
        </div>
      </div>
    </div>
  );
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "keywords",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    pagination: false,
  });

  const item = result.docs[0];
  const title = item?.heading || item?.title || formatSlug(slug);

  return {
    title,
    description: item?.title
      ? `Content tagged with ${item.title}`
      : `Content for ${formatSlug(slug)}`,
  };
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
    limit: 1,
    pagination: false,
    depth: 2,
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

  if (!item) {
    return <KeywordEmptyState title={formatSlug(slug)} />;
  }

  const apps = item.apps?.docs?.filter((d) => typeof d !== "number");
  const projects = item.projects?.docs?.filter((d) => typeof d !== "number");
  const team = item.team?.docs?.filter((d) => typeof d !== "number");
  const news = item.news?.docs?.filter((d) => typeof d !== "number");

  const hasContent =
    item.description ||
    (item.linkGroups && item.linkGroups.length > 0) ||
    (apps && apps.length > 0) ||
    (projects && projects.length > 0) ||
    (team && team.length > 0) ||
    (news && news.length > 0);

  if (!hasContent) {
    return <KeywordEmptyState title={item.heading || item.title} />;
  }

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
                    app={app}
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
                    project={project}
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
                  <PersonCard key={person.id} person={person} />
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
                {news.map((newsItem) => (
                  <NewsCard key={newsItem.id} newsItem={newsItem} display="row" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
