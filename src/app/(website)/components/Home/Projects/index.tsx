"use client";

import useWindow from "@/app/(website)/hooks/useWindow";
import { HomeProject, Project } from "@payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import PayloadImage from "../../PayloadImage";

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

  const [active, setActive] = useState(1);
  const { width } = useWindow();
  const largeScreen = width >= 1024;

  return (
    <section
      ref={containerRef}
      className="bg-black flex flex-col items-center justify-center lg:pb-48"
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
      <div className="w-full px-12 flex flex-col lg:items-stretch gap-12 relative pb-12 lg:flex-row py-12 lg:h-screen">
        {[...projects, ...projects].map((project, i) => (
          <motion.div
            key={i}
            className="w-full lg:w-auto bg-white text-black gap-8 lg:gap-8 flex flex-col lg:cursor-pointer relative"
            animate={{
              flex: largeScreen && active === i ? 5 : 1,
            }}
            onClick={() => setActive(i)}
          >
            {project.banner && typeof project.banner !== "number" && (
              <motion.div
                className="absolute h-full w-full"
                animate={
                  {
                    // opacity: largeScreen ? (active === i ? 0.5 : 1) : 0.3,
                  }
                }
              >
                <PayloadImage
                  img={project.banner}
                  className="h-full w-full object-cover z-0"
                />
              </motion.div>
            )}
            {(!largeScreen || active === i) && (
              <motion.div
                style={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                  duration: 1,
                }}
                className="p-8 lg:p-12 z-10"
              >
                <div className="p-2 lg:p-4 flex flex-col gap-6 lg:gap-12 bg-white/50 backdrop-blur-lg shadow-lg rounded">
                  <h1 className="text-2xl lg:text-4xl font-display">
                    {project.title}
                  </h1>

                  <motion.div
                    style={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.6,
                      duration: 0.5,
                    }}
                    className="line-clamp-6 overflow-ellipsis text-lg lg:text-2xl"
                  >
                    <RichText data={project.content} />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
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
