import { getPayload } from "payload";
import config from "@payload-config";
import HeroIntro from "./components/Home/Hero/01-intro";
import SmoothScroll from "./components/SmoothScroll";
import HeroData from "./components/Home/Hero/02-data";

import bgImage from "./bg.jpg";
import Image from "next/image";
import Projects from "./components/Home/Projects";
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

  return (
    <SmoothScroll>
      <div className="text-white">
        <div className="absolute h-full mt-[var(--header-height)] w-full opacity-50 ">
          <Image
            src={bgImage}
            alt="Bg image"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="h-screen pt-[var(--header-height)] flex flex-col items-center justify-end text-white pb-[10vh] relative">
          <h1 className="text-4xl p-8 lg:text-7xl leading-tight max-w-6xl z-10 font-display">
            {titleGroup.title}
          </h1>
        </div>
        <HeroIntro
          title={heroGroup.heroTitle}
          desc={heroGroup.heroDescription}
        />
        <HeroData items={heroGroup.heroItems} />
        <Projects text={projectsText} projects={projects.docs} />

        <div className="flex flex-col items-center justify-center pb-48">
          <div className="max-w-4xl h-1/2 bg-white text-accent-600 w-full flex flex-col items-center justify-center gap-8 py-24">
            <h4 className="text-4xl font-display">Have a project idea?</h4>
            <Link href="">
              <p className="text-xl font-bold">Get in touch &gt;</p>
            </Link>
          </div>
        </div>
      </div>
    </SmoothScroll>
  );
}
