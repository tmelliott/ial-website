import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/(website)/components/Button";
import { asImage } from "@/app/(website)/utils/asImage";
import getPlaceholder from "@/app/(website)/utils/getPlaceholder";
import cn from "@/app/(website)/utils/cn";
import ProjectCard from "@/app/(website)/components/ProjectCard";
import CTA from "@/app/(website)/components/CTA";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextFromRichText(richText: any): string {
  if (!richText || typeof richText !== "object") return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = richText as { root?: { children?: Array<any> } };
  if (root.root?.children) {
    return (
      root.root.children
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((child: any) => {
          if (child.children) {
            return (
              child.children
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: any) => c.text || "")
                .join("")
                .trim()
            );
          }
          return child.text || "";
        })
        .join(" ")
        .trim()
    );
  }
  return "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "projects",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  if (result.docs.length === 0) {
    return {
      title: "Project - iNZight Analytics Ltd",
    };
  }

  const project = result.docs[0];
  const { metadata: generalMetadata } = await payload.findGlobal({
    slug: "general",
  });

  const title = `${project.title} - iNZight Analytics Ltd`;
  const contentText = extractTextFromRichText(project.content);
  const description =
    contentText.slice(0, 160) ||
    generalMetadata?.description ||
    `Learn more about ${project.title} project.`;

  const banner = asImage(project.banner);
  const imageUrl =
    (banner && typeof banner !== "number" && banner.url) ||
    (generalMetadata?.image &&
      typeof generalMetadata.image !== "number" &&
      generalMetadata.image.url) ||
    undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: project.title,
            },
          ]
        : undefined,
    },
  };
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "projects",
    pagination: false,
  });

  return result.docs.map((project) => ({
    slug: project.slug,
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
    collection: "projects",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });
  const project = result.docs[0];
  const banner = asImage(project.banner);
  const placeholderImg = await getPlaceholder(banner?.url);

  // related projects
  const kws = project.keywords
    ?.filter((x) => typeof x !== "number")
    .map((kw) => kw.id);
  const keywords = await payload.find({
    collection: "keywords",
    where: {
      id: {
        in: kws,
      },
    },
    pagination: false,
  });

  // Get all related projects with their keyword counts
  const projectKeywordMap = new Map<number, number>();
  keywords.docs.forEach((kw) => {
    kw.projects?.docs?.forEach((proj) => {
      const projId = typeof proj === "number" ? proj : proj.id;
      if (projId !== undefined && projId !== project.id) {
        const currentCount = projectKeywordMap.get(projId) || 0;
        projectKeywordMap.set(projId, currentCount + 1);
      }
    });
  });

  // Sort by keyword match count and take top 3
  const relatedProjects = Array.from(projectKeywordMap.entries())
    .map(([id, matchCount]) => ({ id, matchCount }))
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3)
    .map((item) => ({ id: item.id }));

  return (
    <div className="">
      {/* header */}
      <header className="pt-24 px-8 pb-12 lg:pb-32 bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 lg:gap-24">
          <div className="col-span-3">
            <div className="text-gray-400 pb-2 text-3xl">
              <Link href="/projects/">Project</Link>
            </div>
            <h1 className="text-6xl leading-tight lg:pb-12 text-white">
              {project.title}
            </h1>
          </div>
          {/* keywords */}
          <div className="col-span-2 pt-8 lg:pt-12 pb-24 -mb-24 flex flex-col">
            <div className="flex gap-4 flex-wrap">
              {project.keywords
                ?.filter((kw) => typeof kw !== "number")
                .map((kw) => (
                  <Link key={kw.id} href={`/keywords/${kw.slug}`}>
                    <Button
                      type="alternate"
                      className="text-white/70 border-white/70 text-xs lg:text-sm"
                    >
                      {kw.title}
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </header>
      <div className={cn("pt-8 px-8", banner && "lg:-mt-36")}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 lg:gap-24">
          <div className="col-span-3">
            <div className="flex justify-center">
              {banner && typeof banner !== "number" && (
                <div className="relative rounded shadow mb-12 w-full aspect-video bg-gray-500 overflow-clip">
                  <Image
                    src={banner.url ?? ""}
                    sizes="700px"
                    fill
                    alt={banner.description ?? project.title}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={placeholderImg}
                  />
                </div>
              )}
            </div>

            <div className="[&_p]:first:text-lg [&_p]:first:font-semibold [&_p]:pb-2 lg:pb-8 prose">
              <RichText data={project.content} />
            </div>
          </div>
          <div className="col-span-2 lg:mt-36 pt-8 lg:pt-0 flex flex-col gap-8 text-sm">
            {project.linkGroups?.map((group) => (
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
                      <Button type={group.featured ? "alternate" : "primary"}>
                        {link.description}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {/* team */}
            {project.team && project.team.filter((t) => typeof t !== "number").length > 0 && (
              <div className="border border-gray-100 shadow-sm p-8 rounded">
                <h5 className="font-semibold pb-4">Team</h5>
                <div className="flex flex-col gap-4">
                  {project.team
                    ?.filter((t) => typeof t !== "number")
                    .map((person) => {
                      const photo = person.photo && typeof person.photo !== "number" ? person.photo : null;
                      const fullName = `${person.name.first} ${person.name.last}`;
                      return (
                        <Link
                          href={`/team/${person.slug}`}
                          key={person.id}
                          className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                        >
                          <div className="h-12 w-12 rounded-full overflow-clip shadow flex-shrink-0">
                            {photo?.url ? (
                              <Image
                                src={photo.url}
                                alt={fullName}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <div className="text-lg flex items-center justify-center h-full w-full bg-gray-100">
                                {person.name.first.substring(0, 1)}
                                {person.name.last.substring(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="font-medium">{fullName}</div>
                            {/* <div className="text-sm text-gray-600">
                              {person.role || "\u00A0"}
                            </div> */}
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn("h-48 bg-gradient-to-b from-white to-[#F0F0F0]")}
      ></div>

      <div className="pt-8 md:-mt-36 px-8 ">
        <div className="max-w-6xl mx-auto">
          {relatedProjects.length > 0 && (
            <div className="mb-12 lg:mb-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg">Related projects</h3>
                <div>
                  <Button type="secondary" className="text-sm">
                    Back to all projects
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {relatedProjects.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    id={proj.id}
                    direction="vertical"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <CTA
          text1="Got a project idea?"
          text2="Let's work together"
          text3="Get in touch"
          url="/contact"
        />
      </div>
    </div>
  );
}
