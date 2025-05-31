"use client";

import {
  cubicBezier,
  easeIn,
  easeInOut,
  easeOut,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { HomeHero } from "@payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { easeLinear } from "d3";
import useWindow from "@/app/(website)/hooks/useWindow";

const heroMap = {
  heroDataDesign: "Data Design",
  heroDataCollection: "Data Collection",
  heroDataAnalysis: "Data Analysis",
  heroDataVisualisation: "Data Visualisation",
  heroTraining: "Training",
  heroDataSovereignty: "Data Sovereignty",
} as const;

type HeroItems = HomeHero["heroGroup"]["heroItems"];
type HeroItem = HeroItems[keyof HeroItems];

export default function HeroData({
  items,
}: {
  items: HomeHero["heroGroup"]["heroItems"];
}) {
  const itemKeys: (keyof typeof items)[] = Object.keys(items) as any;
  const itemArray = itemKeys.map((k) => ({ key: k, ...items[k] }));

  return (
    <section className="bg-black flex flex-col items-center relative">
      {itemArray.map((item) => (
        <Item key={item.key} title={heroMap[item.key]} item={item} />
      ))}
    </section>
  );
}

const Item = ({ title, item }: { title: string; item: HeroItem }) => {
  const { height } = useWindow();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yp = 0.7;
  const yoffset = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    [-height * yp, height * yp]
  );
  const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen max-w-6xl p-12 grid grid-cols-2 gap-12 z-10 items-center text-white"
    >
      <div className="flex items-center flex-col bg-accent-600 rounded aspect-video">
        IMAGE
      </div>
      <div className="relative">
        <motion.div
          style={{
            y: yoffset,
            opacity,
          }}
          className="flex flex-col gap-4 absolute top-1/2 -translate-y-1/2"
        >
          <h5 className="text-4xl font-display">{title}</h5>
          <motion.div>
            <RichText className="text-xl" data={item} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
