import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";

export default async function Page() {
  const payload = await getPayload({ config });

  const { heading } = await payload.findGlobal({
    slug: "projectsPage",
  });
  const { docs: projects } = await payload.find({
    collection: "projects",
    pagination: false,
  });

  return (
    <div className="">
      <header className="bg-accent-800 p-4 text-white">
        <div className="max-w-4xl flex flex-col gap-8 mx-auto mt-8 lg:mt-48 lg:mb-12 ">
          <h1 className="text-5xl font-display pb-4 border-b">Our work</h1>

          {heading && (
            <div className="flex-1 text-lg lg:text-xl">
              <RichText data={heading} />
            </div>
          )}
        </div>
      </header>

      <div className="p-4 bg-gray-100">
        <section className="my-8 lg:my-24  grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Link
              href={"/projects/" + project.slug}
              key={project.id}
              className="w-full space-y-4 bg-gray-300/10 p-2 rounded shadow hover:bg-gray-300/20"
            >
              <div className="w-full aspect-video bg-gray-300 relative">
                {project.banner && typeof project.banner !== "number" && (
                  <Image
                    src={project.banner.url ?? ""}
                    fill
                    alt={project.title}
                  />
                )}
              </div>
              <div className="space-y-2">
                <div className="text-accent-600">{project.title}</div>
                <div className="text-sm line-clamp-3 lg:line-clamp-6 overflow-ellipsis">
                  <RichText data={project.content} />
                </div>
                {project.keywords && (
                  <div className="flex flex-wrap gap-x-4 text-xs pt-2">
                    {project.keywords.map((kw) => {
                      if (typeof kw === "number") return <></>;
                      return (
                        <div key={kw.id} className="text-gray-500">
                          #{kw.title}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
