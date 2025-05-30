"use client";

import { motion } from "motion/react";
import { letters } from "./letters";

export default function ScrollingNumbers({ numbers }: { numbers: string[][] }) {
  return (
    <div className="absolute top-0 h-full w-full z-0 opacity-50 overflow-clip ">
      <div className="h-full w-full flex gap-4 skew-24 scale-150">
        {numbers.map((col, i) => (
          <NumberCol col={col} key={i} />
        ))}
        <div className="absolute w-full h-full mask-b-from-0 bg-black skew"></div>
      </div>
    </div>
  );
}

const NumberCol = ({ col }: { col: string[] }) => {
  const range = [0, -100];
  const speed = Math.log(letters.indexOf(col[0]) + 10) * 100;
  return (
    <motion.div
      initial={{
        translateY: range[0] + "vh",
      }}
      whileInView={{ translateY: range[1] + "vh" }}
      transition={{
        type: "tween",
        duration: speed + 10,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex-1 flex flex-col items-center"
    >
      {col.map((num, j) => (
        <div key={j} className="text-accent-600 text-3xl">
          {num}
        </div>
      ))}
    </motion.div>
  );
};
