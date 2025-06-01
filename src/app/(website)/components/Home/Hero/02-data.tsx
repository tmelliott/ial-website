"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { HomeHero } from "@payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
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
  const itemKeys = Object.keys(items) as (keyof typeof items)[];
  const itemArray = itemKeys.map((k) => ({ key: k, ...items[k] }));

  return (
    <section className="bg-black flex flex-col items-center relative">
      {itemArray.map((item, i) => (
        <Item
          key={item.key}
          title={heroMap[item.key]}
          item={item}
          last={i === 5}
        />
      ))}
    </section>
  );
}

const Item = ({
  title,
  item,
  last,
}: {
  title: string;
  item: HeroItem;
  last: boolean;
}) => {
  const { height } = useWindow();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yp = 0.7;
  const yoffset = useTransform(
    scrollYProgress,
    [0.2, last ? 0.5 : 0.8],
    [-height * yp, last ? 0 : height * yp]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.6, 0.7],
    [0, 1, 1, last ? 1 : 0]
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen max-w-6xl p-12 grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-12 z-10 items-center text-white"
    >
      <motion.div
        style={{ opacity }}
        className="flex items-center flex-col bg-accent-600 rounded aspect-video"
      >
        IMAGE
      </motion.div>
      <div className="relative">
        <motion.div
          style={{
            y: yoffset,
            opacity,
          }}
          className="flex flex-col gap-4 absolute top-1/2 -translate-y-1/2"
        >
          <h5 className="text-4xl font-display">{title}</h5>
          <div>
            <RichText className="text-xl" data={item} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
