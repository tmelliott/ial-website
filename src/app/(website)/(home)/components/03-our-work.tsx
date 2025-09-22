import { getPayload } from "payload";
import config from "@payload-config";
import Button from "../../components/Button";
import ProjectCard from "../../components/ProjectCard";
import AppCard from "../../components/AppCard";
import Link from "next/link";

export default async function OurWork() {
  const payload = await getPayload({ config });
  const { featuredApps, featuredProjects, cards } = await payload.findGlobal({
    slug: "homeProjects",
  });

  return (
    <div className="px-8 text-white -mt-80 mb-30 pt-36 z-10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 w-full">
          <h3 className="text-2xl">Our work</h3>

          <div className="flex items-center gap-12">
            <p className="text-sm hidden md:block">
              Want to see more of our work?
            </p>
            <Button type="alternate" className="text-sm">
              View all work
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {featuredApps && typeof featuredApps !== "number" && (
            <div className="col-span-full h-full">
              <AppCard id={featuredApps.id} />
            </div>
          )}
          {featuredProjects &&
            featuredProjects
              .filter((x) => typeof x !== "number")
              .map((project) => (
                <div key={project.id}>
                  <ProjectCard id={project.id} direction="vertical" />
                </div>
              ))}

          <div className="grid grid-cols-1 gap-12">
            {cards?.map((card) => (
              <div
                key={card.id}
                className="bg-linear-150 from-15 from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)] first:from-[#E83150] first:to-[#C42943] p-8 flex flex-col justify-between rounded shadow"
              >
                <h4 className="text-3xl font-semibold">{card.label}</h4>
                <Link href={card.linkUrl}>
                  <Button type="alternate">{card.linkText}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
