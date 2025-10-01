"use client";

import { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

export default function DataCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  console.log(inView);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0.4,
      }}
    >
      {children}
    </div>
  );
}
