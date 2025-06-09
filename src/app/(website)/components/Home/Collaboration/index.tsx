"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const collaborators = {
  aotearoa: Array.from({ length: 16 }).map((x, i) => `Organisation ${i}`),
  international: Array.from({ length: 8 }).map((x, i) => `Organisation ${i}`),
};

export default function Collboaration() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.15, 0.25], [-40, 0]);

  const aotearoaOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.3, 0.6, 0.7],
    [0, 1, 1, 0]
  );
  const aotearoaY = useTransform(
    scrollYProgress,
    [0.25, 0.3, 0.6, 0.7],
    [20, 0, 0, -20]
  );

  const internationalOpacity = useTransform(
    scrollYProgress,
    [0.6, 0.7],
    [0, 1]
  );
  const internationalY = useTransform(scrollYProgress, [0.6, 0.7], [20, 0]);

  const n = [collaborators.aotearoa.length, collaborators.international.length];

  return (
    <section ref={containerRef} className="">
      <div className="flex flex-col h-[200vh]">
        <div className="flex flex-col items-center h-screen w-full sticky top-0 py-12 lg:py-24 gap-6 lg:gap-12">
          <div className="max-w-6xl w-full px-12">
            <motion.h2
              className="w-full text-4xl font-display"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              We have worked with &hellip;
            </motion.h2>
          </div>
          <motion.div
            style={{}}
            className="flex flex-col lg:grid lg:grid-cols-3 p-12 gap-16 flex-1 w-full max-w-6xl"
          >
            <div className="relative">
              <motion.h3
                className="text-3xl absolute font-display text-accent-700"
                style={{
                  y: aotearoaY,
                  opacity: aotearoaOpacity,
                }}
              >
                Aotearoa
              </motion.h3>
              <motion.h3
                className="text-3xl absolute font-display text-accent-700"
                style={{
                  y: internationalY,
                  opacity: internationalOpacity,
                }}
              >
                International
              </motion.h3>
            </div>
            <div className="w-full relative col-span-2 h-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full absolute">
                {collaborators.aotearoa.map((org, i) => (
                  <Collaborator
                    name={org}
                    progress={scrollYProgress}
                    range={[
                      0.3 + (i / n[0]) * 0.1,
                      0.4 + (i / n[0]) * 0.1,
                      0.6,
                      0.7,
                    ]}
                    key={i}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full absolute">
                {collaborators.international.map((org, i) => (
                  <Collaborator
                    name={org}
                    progress={scrollYProgress}
                    range={[0.65, 0.75, 1, 2]}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <div className=" h-1/2 bg-white text-accent-600 w-full flex flex-col items-center justify-center gap-8 py-24">
          <h4 className="text-4xl font-display">Want to collaborate?</h4>
          <Link href="">
            <p className="text-xl font-bold">Get in touch &gt;</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

const Collaborator = ({
  name,
  progress,
  range,
}: {
  name: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
}) => {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  return (
    <motion.div
      className="w-full h-full bg-white text-black flex justify-center items-center"
      style={{
        opacity,
      }}
    >
      {name}
    </motion.div>
  );
};
