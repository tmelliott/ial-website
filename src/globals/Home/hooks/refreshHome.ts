import { revalidate } from "@/lib/revalidate";

export default function refreshHome() {
  revalidate.global("homeHero");
  revalidate.global("homeProjects");
  revalidate.global("homeTeam");
  revalidate.global("homeCollaborators");
  revalidate.global("homeNews");
  revalidate.global("homeApps");
}
