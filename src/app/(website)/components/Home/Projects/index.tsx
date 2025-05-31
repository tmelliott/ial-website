"use client";

import { HomeProject, Project } from "@payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function Projects({
  text,
  projects,
}: {
  text: HomeProject;
  projects: Project[];
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const bannerHeight = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="bg-black flex flex-col items-center justify-center pb-48"
    >
      <div className="flex flex-col items-center justify-center h-screen relative">
        <div className="max-w-6xl w-full flex flex-col justify-center relative z-10">
          <motion.div
            style={{
              scaleY: bannerHeight,
              skewY: -6,
            }}
            className="absolute h-full w-screen left-1/2 -translate-x-1/2  bg-accent-800 z-0 top-1/2 -translate-y-1/2"
          ></motion.div>
          <div className="flex flex-col items-center gap-8 z-10 py-24 px-12 ">
            <motion.h2
              style={{ opacity: headerOpacity }}
              className="text-4xl font-display"
            >
              {text.projectsTitle}
            </motion.h2>
            <motion.div
              style={{ opacity: textOpacity }}
              className="max-w-xl text-xl"
            >
              {text.projectsDescription && (
                <RichText data={text.projectsDescription} className="-mb-6" />
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl flex flex-col items-center gap-48 relative">
        {[...projects, ...projects].map((project, i) => (
          <div
            key={i}
            className=" bg-accent-700 w-full px-8 py-12 gap-12 flex flex-col"
          >
            <h1 className="text-4xl font-display">{project.title}</h1>

            <div className="line-clamp-6 overflow-ellipsis text-xl">
              <RichText data={project.content} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
