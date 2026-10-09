import { useEffect, useState } from "react";
import { buttonClasses } from "./cn";

export default function CTA({
  text1,
  text2,
  text3,
  url,
}: {
  text1: string;
  text2: string;
  text3: string;
  url: string;
}) {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const fn = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 100,
        y: event.clientY,
      });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <div className="text-white md:h-96 -mx-8 px-8 py-12 overflow-clip relative bg-black">
      <div
        className="absolute w-full aspect-square bg-radial from-[-50%] from-bg-gradient-end to-80% to-transparent -translate-x-1/2 transition top-0 left-0 duration-[3s] ease-linear"
        style={{
          transform: `translate(${mousePosition.x}%, -${mousePosition.x / 5}%)`,
        }}
      />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center md:justify-between md:items-center h-full gap-12 z-10 relative">
        <p className="text-3xl">
          {text1}{" "}
          <span className="text-accent-500 whitespace-nowrap">{text2}</span>
        </p>
        <a href={url} className={buttonClasses("alternate", undefined, "text-3xl ")}>
          {text3}
        </a>
      </div>
    </div>
  );
}
