import { getPayload } from "payload";
import config from "@payload-config";
import ProjectCard from "../../../../components/ProjectCard";
import ActionCard from "../../../../components/ActionCard";
import CTA from "../../../../components/CTA";
import PageHeader from "../../../../components/PageHeader";
import cn from "../../../../utils/cn";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

const N_PER_PAGE = 7;

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "projects",
    pagination: true,
    limit: N_PER_PAGE,
  });

  return Array.from({ length: result.totalPages }).map((_, index) => ({
    page: String(index + 1),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const payload = await getPayload({ config });
  const page = parseInt((await params).page);

  const { heading } = await payload.findGlobal({
    slug: "projectsPage",
  });
  const {
    docs: projects,
    hasNextPage,
    hasPrevPage,
    totalPages,
  } = await payload.find({
    collection: "projects",
    pagination: true,
    limit: N_PER_PAGE,
    page: page,
  });

  return (
    <div className="">
      <PageHeader primary="Kaupapa" secondary="Projects" />

      <div className="px-8 relative z-10">
        <section className="-mt-24 mb-24 flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-6 lg:gap-12 max-w-6xl mx-auto">
          {page === 1 && (
            <div className="md:col-span-2 lg:col-span-4 h-full">
              <ActionCard
                title=""
                description={heading}
                variant="bright"
                button={{
                  text: "Highlight button",
                  url: "",
                }}
              />
            </div>
          )}
          {projects.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "lg:col-span-2",
                page > 1 && index < 4 && "lg:col-span-3"
              )}
            >
              <ProjectCard
                id={item.id}
                direction={page > 1 && index < 4 ? "horizontal" : "vertical"}
              />
            </div>
          ))}
          <div className="flex justify-center items-center col-span-full gap-4">
            {hasPrevPage && (
              <Link
                href={page === 2 ? "/projects" : `/projects?page=${page - 1}`}
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
                    p + 1 === page && " text-white bg-accent-600"
                  )}
                >
                  {p + 1}
                </div>
              </Link>
            ))}
            {hasNextPage && (
              <Link href={`/projects?page=${page + 1}`}>
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
