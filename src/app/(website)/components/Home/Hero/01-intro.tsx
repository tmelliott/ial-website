"use client";

import { RichText } from "@payloadcms/richtext-lexical/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";

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
    offset: ["start end", "start start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const paraOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const paraY = useTransform(scrollYProgress, [0.8, 1], [20, 0]);

  const [windowSize, setWindowSize] = useState<[number, number]>();
  useEffect(() => {
    window.addEventListener("resize", (e) => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    });
    setWindowSize([window.innerWidth, window.innerHeight]);
  }, []);

  const [beamSize, setBeamSize] = useState(0);
  scrollYProgress.on("change", (e) => setBeamSize(e.valueOf()));

  const drawBeam = useCallback(() => {
    if (!windowSize) return;
    const isSmall = windowSize[0] < 1124;
    const beam: [number, number][] = [
      [0, 1 - beamSize / 2], // modify over scroll
      [0.9, 0.1],
      [isSmall ? 0.7 : beamSize / 2, 1], // modify over scroll
      [0, 1],
    ];

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, windowSize[0]]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([0, windowSize[1]]);

    const drawArea = d3
      .area()
      .x((p) => xScale(p[0]))
      .y0((p) => 0)
      .y1((p) => yScale(p[1]));
    return drawArea(beam);
  }, [windowSize, beamSize]);

  return (
    <section
      className="h-screen bg-black flex justify-center relative overflow-clip"
      ref={containerRef}
    >
      <div className="absolute z-0 w-full h-full">
        <svg id="beam" className="h-full w-full">
          {drawBeam && (
            <motion.path
              className=" fill-accent-700"
              d={drawBeam() ?? ""}
            ></motion.path>
          )}
        </svg>
      </div>

      <div className="w-full h-full max-w-6xl p-12 grid grid-cols-2 gap-12 z-10">
        <div className="absolute top-1/2 left-0 h-1/2 w-2/3 lg:w-1/2 flex-1 flex flex-col justify-center px-[5vw] gap-8 ">
          <motion.h2
            style={{ opacity: scrollYProgress, y: titleY }}
            className="text-3xl lg:text-5xl tracking-tight leading-tight font-display"
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
              className="text-xl lg:text-2xl leading-tight"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
