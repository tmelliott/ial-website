import { getPayload } from "payload";
import config from "@payload-config";
import HeroIntro from "./components/Home/Hero/01-intro";
import SmoothScroll from "./components/SmoothScroll";
import HeroData from "./components/Home/Hero/02-data";

import bgImage from "./bg.jpg";
import Image from "next/image";
import Projects from "./components/Home/Projects";
import Collboaration from "./components/Home/Collaboration";
import Footer from "./components/Footer";
import PayloadImage from "./components/PayloadImage";
import Link from "next/link";

export default async function Home() {
  const payload = await getPayload({ config });
  const { titleGroup, heroGroup } = await payload.findGlobal({
    slug: "homeHero",
  });
  const projectsText = await payload.findGlobal({
    slug: "homeProjects",
  });
  const projects = await payload.find({
    collection: "projects",
    where: {
      featured: {
        equals: true,
      },
    },
  });
  const collaborators = await payload.findGlobal({
    slug: "homeCollaborators",
  });
  const { apps } = await payload.findGlobal({
    slug: "homeApps",
  });

  return (
    <SmoothScroll>
      <div className="text-white">
        <div className="absolute h-full mt-[var(--header-height)] w-full opacity-50">
          <Image
            src={bgImage}
            alt="Bg image"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="h-screen pt-[var(--header-height)] flex flex-col items-center justify-end text-white pb-[10vh] relative">
          <h1 className="text-4xl p-8 lg:text-7xl leading-tight max-w-6xl z-2 font-display">
            {titleGroup.title}
          </h1>
        </div>

        {apps && (
          <div className="absolute top-[var(--header-height)] right-12 text-white space-y-4 text-sm lg:text-md">
            {apps.map((app) => (
              <Link
                href={app.url}
                key={app.id}
                className="p-2 border-white/30 border text-white flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/30"
              >
                {typeof app.logo !== "number" && (
                  <PayloadImage img={app.logo} className="size-12" />
                )}
                <div className="w-32">{app.title}</div>
              </Link>
            ))}
          </div>
        )}
        <HeroIntro
          title={heroGroup.heroTitle}
          desc={heroGroup.heroDescription}
        />
        <HeroData items={heroGroup.heroItems} />
        <Projects text={projectsText} projects={projects.docs} />
        <Collboaration collaborators={collaborators} />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
