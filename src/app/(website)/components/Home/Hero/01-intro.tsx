"use client";

import { RichText } from "@payloadcms/richtext-lexical/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

export default function HeroIntro({
  title,
  desc,
}: {
  title: string;
  desc: any;
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.5", "start start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const paraOpacity = useTransform(scrollYProgress, [0.5, 1], [0, 1]);
  const paraY = useTransform(scrollYProgress, [0.5, 1], [20, 0]);

  return (
    <div className="h-screen bg-black flex justify-center">
      <div
        className="w-full h-full border border-white max-w-6xl p-12 grid grid-cols-2 gap-12"
        ref={containerRef}
      >
        <div className="flex-1 flex flex-col justify-center gap-8">
          <motion.h2
            style={{ opacity: scrollYProgress, y: titleY }}
            className="text-5xl tracking-tight leading-tight"
          >
            {title}
          </motion.h2>
          <motion.div
            style={{
              opacity: paraOpacity,
              y: paraY,
            }}
          >
            <RichText
              data={desc}
              className="text-white text-2xl leading-tight"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
