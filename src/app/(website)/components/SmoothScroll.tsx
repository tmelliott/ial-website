"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function ({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis();

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  return <>{children}</>;
}
