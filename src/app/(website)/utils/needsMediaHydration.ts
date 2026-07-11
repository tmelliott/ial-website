import type { App, News, Project, Team } from "@payload-types";

export function needsProjectHydration(project: Project): boolean {
  return typeof project.banner === "number";
}

export function needsAppHydration(app: App): boolean {
  return typeof app.banner === "number" || typeof app.logo === "number";
}

export function needsPersonHydration(person: Team): boolean {
  return typeof person.photo === "number";
}

export function needsNewsHydration(news: News): boolean {
  const first = news.gallery?.[0];
  return first !== undefined && typeof first === "number";
}
