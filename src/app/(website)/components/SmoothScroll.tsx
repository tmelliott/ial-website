"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
// import Snap from "lenis/snap";

export default function SmoothScroll({
  children,
  // snapAt,
}: {
  children: ReactNode;
  // snapAt?: string[];
}) {
  useEffect(() => {
    const lenis = new Lenis();

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // const snap = new Snap(lenis, {
    //   type: "mandatory",
    //   // distanceThreshold: "5%",
    //   debounce: 500,
    // });

    // snap.add(0);
    // snapAt?.forEach((id) => {
    //   const el = document.getElementById(id);
    //   console.log(id, ":", el);
    //   if (!el) return;
    //   snap.add(el.offsetTop);
    // });
  }, []);
  return <>{children}</>;
}
