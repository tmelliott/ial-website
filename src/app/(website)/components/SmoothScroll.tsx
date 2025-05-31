"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";

export default function ({
  children,
  snapAt,
}: {
  children: ReactNode;
  snapAt?: string[];
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
    //   type: "proximity",
    //   velocityThreshold: 1,
    //   debounce: 0,
    // });
    // snapAt?.forEach((id) => {
    //   const el = document.querySelector<HTMLDivElement>(id);
    //   if (!el) return;
    //   snap.addElement(el, { align: ["center"] });
    // });
  }, []);
  return <>{children}</>;
}
