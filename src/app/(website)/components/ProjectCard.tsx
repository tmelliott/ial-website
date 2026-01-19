import { getPayload } from "payload";
import config from "@payload-config";

import { RichText } from "@payloadcms/richtext-lexical/react";
import Card from "./Card";

export default async function ProjectCard({
  id,
  direction = "horizontal",
  featured = false,
}: {
  id: number;
  direction?: "horizontal" | "vertical";
  featured?: boolean;
}) {
  const payload = await getPayload({ config });
  const project = await payload.findByID({
    collection: "projects",
    id: id,
  });

  return (
    <Card
      title={project.title}
      banner={project.banner}
      url={`/projects/${project.slug}`}
      type="project"
      keywords={project.keywords}
      featured={featured}
      direction={direction}
    >
      <RichText data={project.content} />
    </Card>
  );
}
