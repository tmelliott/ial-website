"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import type { HomeHero } from "@payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import useWindow from "@/app/(website)/hooks/useWindow";
import cn from "@/app/(website)/utils/cn";

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

type HeroProps = {
  items: HomeHero["heroGroup"]["heroItems"];
};

export default function HeroData({ items }: HeroProps) {
  const itemKeys = Object.keys(items) as (keyof typeof items)[];
  const itemArray = itemKeys.map((k) => ({ key: k, ...items[k] }));

  const [active, setActive] = useState(0);

  return (
    <section className="bg-black flex flex-col lg:grid lg:grid-cols-3  relative  md:h-screen text-white justify-start py-24 p-6 lg:p-12 gap-4 lg:gap-12 lg:py-48">
      {itemArray.map((item, i) => (
        <div key={item.key} className="">
          <h4
            className="text-3xl cursor-pointer lg:cursor-default"
            onClick={() => setActive(i)}
          >
            {heroMap[item.key]}
          </h4>
          <div
            className={cn(
              active === i ? "" : "h-0 opacity-0 pointer-events-none ",
              "lg:h-auto lg:opacity-100 lg:pointer-events-none"
            )}
          >
            <RichText className="text-md text-white/80" data={item} />
          </div>
        </div>
      ))}
    </section>
  );
}

export function FancierHeroData({ items }: HeroProps) {
  const itemKeys = Object.keys(items) as (keyof typeof items)[];
  const itemArray = itemKeys.map((k) => ({ key: k, ...items[k] }));

  return (
    <section
      id="section--hero-data"
      className="bg-black flex flex-col items-center relative"
    >
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
