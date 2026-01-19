import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import ProjectCard from "../../../../components/ProjectCard";
import ActionCard from "../../../../components/ActionCard";
import CTA from "../../../../components/CTA";
import PageHeader from "../../../../components/PageHeader";
import cn from "../../../../utils/cn";
import { sortProjects } from "../../utils/sortProjects";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

const N_PER_PAGE = 7;

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config });
  const { metadata } = await payload.findGlobal({ slug: "projectsPage" });
  const { metadata: generalMetadata } = await payload.findGlobal({
    slug: "general",
  });

  const title =
    metadata?.title ||
    generalMetadata?.title ||
    "Projects - iNZight Analytics Ltd";
  const description =
    metadata?.description ||
    generalMetadata?.description ||
    "Explore our data analysis and visualisation projects.";

  const imageUrl =
    (metadata?.image &&
      typeof metadata.image !== "number" &&
      metadata.image.url) ||
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
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { docs: allProjects } = await payload.find({
    collection: "projects",
    pagination: false,
    limit: 1000,
    sort: ["-priority", "-endDate", "-startDate", "-createdAt"],
  });

  const sortedProjects = sortProjects(allProjects);
  const totalPages = Math.ceil(sortedProjects.length / N_PER_PAGE);
  return Array.from({ length: totalPages }).map((_, index) => ({
    page: String(index + 1),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const payload = await getPayload({ config });
  const pageNum = parseInt((await params).page);

  const { heading, workstreams } = await payload.findGlobal({
    slug: "projectsPage",
  });

  // Fetch all projects and sort them with custom logic
  const { docs: allProjects } = await payload.find({
    collection: "projects",
    pagination: false,
    limit: 1000, // Large limit to get all projects
    sort: ["-priority", "-endDate", "-startDate", "-createdAt"],
  });

  const sortedProjects = sortProjects(allProjects);

  // Manual pagination
  const totalPages = Math.ceil(sortedProjects.length / N_PER_PAGE);
  const startIndex = (pageNum - 1) * N_PER_PAGE;
  const endIndex = startIndex + N_PER_PAGE;
  const projects = sortedProjects.slice(startIndex, endIndex);
  const hasNextPage = endIndex < sortedProjects.length;
  const hasPrevPage = pageNum > 1;

  return (
    <div className="">
      <PageHeader primary="Kaupapa" secondary="Projects" />

      <div className="px-8 relative z-10">
        <section className="-mt-24 mb-24 flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-6 lg:gap-12 max-w-6xl mx-auto">
          {pageNum === 1 && (
            <div className="md:col-span-2 lg:col-span-4 h-full">
              <ActionCard
                title=""
                description={heading}
                variant="bright"
                workstreams={workstreams ?? undefined}
              />
            </div>
          )}
          {projects.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "lg:col-span-2",
                pageNum > 1 && index < 4 && "lg:col-span-3"
              )}
            >
              <ProjectCard
                id={item.id}
                direction={pageNum > 1 && index < 4 ? "horizontal" : "vertical"}
                featured={index === 0}
              />
            </div>
          ))}
          <div className="flex justify-center items-center col-span-full gap-4">
            {hasPrevPage && (
              <Link
                href={pageNum === 2 ? "/projects" : `/projects?page=${pageNum - 1}`}
              >
                <FiChevronLeft />
              </Link>
            )}
            {Array.from({ length: totalPages }).map((_, p) => (
              <Link
                href={p === 0 ? "/projects" : `/projects?page=${p + 1}`}
                key={p}
              >
                <div
                  className={cn(
                    "size-8 flex justify-center items-center bg-gray-50 rounded shadow-sm",
                    p + 1 === pageNum && " text-white bg-accent-600"
                  )}
                >
                  {p + 1}
                </div>
              </Link>
            ))}
            {hasNextPage && (
              <Link href={`/projects?page=${pageNum + 1}`}>
                <FiChevronRight />
              </Link>
            )}
          </div>
        </section>
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
