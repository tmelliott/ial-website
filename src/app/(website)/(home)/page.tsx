import { getPayload } from "payload";
import config from "@payload-config";

import LandingPage from "./components/01-landing";

import Footer from "../components/Footer";
import Data from "./components/02-data";

export default async function Home() {
  const payload = await getPayload({ config });
  const { titleGroup } = await payload.findGlobal({
    slug: "homeHero",
  });
  // const projectsText = await payload.findGlobal({
  //   slug: "homeProjects",
  // });
  // const projects = await payload.find({
  //   collection: "projects",
  //   where: {
  //     featured: {
  //       equals: true,
  //     },
  //   },
  // });
  // const collaborators = await payload.findGlobal({
  //   slug: "homeCollaborators",
  // });
  const { apps } = await payload.findGlobal({
    slug: "homeApps",
  });
  const news = await payload.find({
    collection: "news",
    sort: ["-date"],
    limit: 1,
  });

  return (
    <div className="text-white">
      <LandingPage title={titleGroup.title} news={news.docs[0]} apps={apps} />
      <Data />

      {/* <HeroIntro title={heroGroup.heroTitle} desc={heroGroup.heroDescription} />
      <HeroData items={heroGroup.heroItems} />
      <Projects text={projectsText} projects={projects.docs} />
      <Collboaration collaborators={collaborators} /> */}
      <Footer />
    </div>
  );
}
