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
import Avatar from "@/app/(website)/components/media/Avatar";

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

  const relatedProjects = keywords.docs
    .flatMap((kw) => kw.projects?.docs)
    .filter((proj) => proj !== undefined && typeof proj !== "number")
    .filter((p, i, s) => s.indexOf(p) === i)
    .filter((p) => p.id !== project.id)
    .filter((_, i) => i < 3);

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
                  <Button
                    key={kw.id}
                    type="alternate"
                    className="text-white/70 border-white/70 text-xs lg:text-sm"
                  >
                    {kw.title}
                  </Button>
                ))}
            </div>
            {/* team */}
            <div className="relative h-full">
              <div className="mb-4 flex gap-4 lg:absolute lg:top-full lg:h-24 mt-8 lg:mt-4">
                {project.team
                  ?.filter((t) => typeof t !== "number")
                  .map((person) => (
                    <Link href={`/team/${person.slug}`} key={person.id}>
                      <Avatar person={person} />
                    </Link>
                  ))}
              </div>
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

            <div className="[&_p]:first:text-lg [&_p]:first:font-semibold [&_p]:pb-2 lg:pb-8">
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
