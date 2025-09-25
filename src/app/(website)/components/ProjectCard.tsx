import { getPayload } from "payload";
import config from "@payload-config";

import { RichText } from "@payloadcms/richtext-lexical/react";
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
    <Card
      title={project.title}
      image={project.banner}
      url={`/projects/${project.slug}`}
      keywords={project.keywords}
      featured={featured}
      direction={direction}
    >
      <RichText data={project.content} />
    </Card>
  );
}
