import { getPayload } from "payload";
import config from "@payload-config";

import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import Card from "./Card";

export default async function ProjectCard({
  id,
  featured = false,
  direction = "horizontal",
}: {
  id: number;
  featured?: boolean;
  direction?: "horizontal" | "vertical";
}) {
  const payload = await getPayload({ config });
  const project = await payload.findByID({
    collection: "projects",
    id: id,
  });

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card
        title={project.title}
        image={project.banner}
        keywords={project.keywords}
        featured={featured}
        direction={direction}
      >
        <RichText data={project.content} />
      </Card>
    </Link>
  );

  // return (
  //   <div className="@container rounded shadow overflow-clip">
  //     <Link href={"/projects/" + project.slug}>
  //       <div className="w-full aspect-video relative hidden md:block">
  //         {project.banner && typeof project.banner !== "number" && (
  //           <Image
  //             src={project.banner.url ?? ""}
  //             fill
  //             alt={project.title}
  //             className="h-full w-full shadow object-cover"
  //           />
  //         )}
  //       </div>
  //       <div
  //         className={cn(
  //           "p-4 md:p-8 h-full",
  //           featured
  //             ? "bg-gradient-to-bl from-black to-accent-950 text-white"
  //             : "bg-white text-black"
  //         )}
  //       >
  //         <h4
  //           className={cn(
  //             "text-lg font-semibold mb-2 md:mb-4",
  //             featured ? "text-white" : "text-accent-500"
  //           )}
  //         >
  //           {project.title}
  //         </h4>

  //         {project.keywords && (
  //           <div className="hidden md:flex flex-wrap gap-2 text-xs">
  //             {project.keywords.map((kw) => {
  //               if (typeof kw === "number") return <></>;
  //               return (
  //                 <div
  //                   key={kw.slug}
  //                   className={cn(
  //                     " rounded border px-2 py-1",
  //                     featured
  //                       ? "text-gray-300 border-gray-300"
  //                       : "text-gray-600 border-gray-600"
  //                   )}
  //                 >
  //                   {kw.title}
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         )}
  //       </div>
  //     </Link>
  //   </div>
  // );
}
