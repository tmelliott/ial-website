"use client";

import { useScroll } from "motion/react";
import { useRef } from "react";

export default function HeroData() {
  const containerRef = useRef(null);
  const scrollYProgress = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  return (
    <div
      ref={containerRef}
      className="bg-black flex flex-col items-center relative"
    >
      <div className="w-full h-screen max-w-6xl p-12 grid grid-cols-2 gap-12 z-10 items-center ">
        <div className="flex items-center flex-col bg-accent-600 rounded aspect-video">
          IMAGE
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="text-4xl font-display">Data design</h5>
          <p className="text-xl">
            We design research projects that are efficient, effective and
            tailored to your information needs, and can advise on, supervise, or
            review projects &mdash; including through a Māori research lens.
          </p>
        </div>
      </div>
      <div className="h-screen w-full"></div>
      <div className="h-screen w-full"></div>
      <div className="h-screen w-full"></div>
      <div className="h-screen w-full"></div>
      <div className="h-screen w-full"></div>
    </div>
  );
}
