// import useWindow from "@/app/(website)/hooks/useWindow";
import { HomeProject, Image, Project } from "@payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
// import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
// import { useRef, useState } from "react";
// import PayloadImage from "../../PayloadImage";

export default function Projects({
  text,
  projects,
}: {
  text: HomeProject;
  projects: Project[];
}) {
  // const containerRef = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start end", "start start"],
  // });

  // const bannerHeight = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  // const headerOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  // const textOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  // const [active, setActive] = useState(1);
  // const { width } = useWindow();
  // const largeScreen = width >= 1024;

  return (
    <section
      // ref={containerRef}
      className="bg-black flex flex-col items-center justify-center pb-12 lg:pb-24"
    >
      <div className="flex flex-col items-center justify-center  relative">
        <div className="max-w-6xl w-full flex flex-col justify-center relative z-10">
          <div
            // style={{
            //   scaleY: 1, //bannerHeight,
            //   skewY: -6,
            // }}
            className="absolute h-full w-screen left-1/2 -translate-x-1/2  bg-accent-800 z-0 top-1/2 -translate-y-1/2 -skew-y-6"
          ></div>
          <div className="flex flex-col items-center gap-8 z-10 py-24 px-12 ">
            <h2
              // style={{ opacity: headerOpacity }}
              className="text-4xl font-display"
            >
              {text.projectsTitle}
            </h2>
            <div
              // style={{ opacity: textOpacity }}
              className="max-w-xl text-xl"
            >
              {text.projectsDescription && (
                <RichText data={text.projectsDescription} className="-mb-6" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex pt-24 lg:pt-48 py-12 lg:py-24 text-3xl lg:text-5xl font-display text-center">
        Featured projects
      </div>
      <div className="w-full px-12 pb-24 lg:pb-44 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
        {projects.map((proj) => (
          <ProjectCard project={proj} key={proj.id} />
        ))}
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <div className=" h-1/2 bg-white text-accent-600 w-full flex flex-col items-center justify-center gap-8 py-24">
          <h4 className="text-4xl font-display">Have a project idea?</h4>
          <Link href="">
            <p className="text-xl font-bold">Get in touch &gt;</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={"/projects/" + project.slug}
      className=" shadow rounded overflow-clip flex bg-accent-700/30"
    >
      <div
        className="w-12 bg-accent-700"
        style={{
          backgroundImage: `url(${bannerUrl(project.banner)})`,
        }}
      ></div>
      <div className="flex-1 p-2 lg:p-4 flex flex-col gap-4">
        <h4 className="text-xl lg:text-3xl">{project.title}</h4>
        <div className="line-clamp-3 lg:line-clamp-6 overflow-ellipsis text-md lg:text-lg">
          <RichText data={project.content} />
        </div>
      </div>
    </Link>
  );
}

function bannerUrl(banner: number | Image | null | undefined) {
  if (banner && typeof banner !== "number") {
    return banner.url;
  }
  return undefined;
}
