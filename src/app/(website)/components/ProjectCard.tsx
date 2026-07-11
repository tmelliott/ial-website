import { getPayload } from "payload";
import config from "@payload-config";

import { RichText } from "./RichText";
import Card from "./Card";
import type { Project } from "@payload-types";
import { needsProjectHydration } from "../utils/needsMediaHydration";

async function fetchProject(id: number) {
  const payload = await getPayload({ config });
  return payload.findByID({
    collection: "projects",
    id,
    depth: 2,
  });
}

async function resolveProject(projectProp?: Project, id?: number) {
  if (projectProp && !needsProjectHydration(projectProp)) {
    return projectProp;
  }
  const projectId = projectProp?.id ?? id;
  if (projectId === undefined) return undefined;
  return fetchProject(projectId);
}

export default async function ProjectCard({
  id,
  project: projectProp,
  direction = "horizontal",
  featured = false,
}: {
  id?: number;
  project?: Project;
  direction?: "horizontal" | "vertical";
  featured?: boolean;
}) {
  const project = await resolveProject(projectProp, id);
  if (!project) return null;

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
