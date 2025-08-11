import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";

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
  });
  const project = result.docs[0];

  return (
    <div className="">
      <div className="w-full h-36 lg:h-96 bg-gray-300 relative">
        {project.banner && typeof project.banner !== "number" && (
          <Image
            src={project.banner.url ?? ""}
            fill
            alt={project.title}
            className="shadow object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <section className="max-w-4xl mx-auto space-y-4 pb-12 lg:pb-24">
          <h1 className="text-accent-600 pt-4 lg:pt-6 lg:pb-4 text-3xl lg:text-5xl font-display">
            {project.title}
          </h1>
          <div className="flex-1 space-y-4 col-span-2">
            <div className="border-b border-gray-300 pb-2">
              <RichText data={project.content} />
            </div>
            {project.keywords && project.keywords.length > 0 && (
              <div className="border-b border-gray-300 pb-4 space-y-2 text-sm">
                <div className="flex flex-wrap gap-4 text-xs">
                  {project.keywords.map((kw) => {
                    if (typeof kw === "number") return <></>;
                    return (
                      <div
                        key={kw.id}
                        className="border px-2 p-1 rounded border-gray-300 bg-gray-200/60"
                      >
                        {kw.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {project.linkGroups && project.linkGroups.length > 0 && (
              <div className="border-b border-gray-300 pb-6">
                <h4 className="text-lg font-display pb-4">Project links</h4>

                <div className="space-y-4">
                  {project.linkGroups.map((lg) => (
                    <div key={lg.id}>
                      <div className="">
                        <strong className="font-bold">{lg.label}</strong>
                        <ul className="list-disc list-inside">
                          {lg.groupLinks.map((link) => (
                            <li key={link.id}>
                              <Link href={link.link}>{link.description}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
