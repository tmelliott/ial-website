"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function MeshblockBg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [dimensions, setDimensions] = useState<[number, number]>([1920, 1080]);

  useEffect(() => {
    // Update dimensions to use viewport dimensions
    const updateDimensions = () => {
      setDimensions([window.innerWidth, window.innerHeight]);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      // Cleanup style element on unmount
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const [containerWidth, containerHeight] = dimensions;

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Extend viewBox to 2x width to show duplicated content
    svg.attr("viewBox", `0 0 ${containerWidth * 2} ${containerHeight}`);

    // Create scales for noisy data (2x container width)
    const noisyXScale = d3
      .scaleLinear()
      .domain([0, 2])
      .range([0, containerWidth * 2]);
    const noisyYScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, containerHeight]);

    // Create group for noisy data with animation
    // This group will contain content that extends 2x width for seamless looping
    const noisyGroup = svg.append("g").attr("class", "noisy-group");

    // Create dots that fill the middle 2/3 vertically, positioned higher up
    const numPoints = 200;
    const beltTop = 0.1; // Top of belt (10% from top)
    const beltBottom = 0.8; // Bottom of belt (50% from top) - belt is 40% of viewport height
    const fadeHeight = 0.1; // Fade zone at top and bottom of belt (10% each)

    // Create base pattern of points (in 0-1 coordinate space)
    const basePoints = d3.range(numPoints).map(() => ({
      x: Math.random(), // Random x across full width (0-1)
      y: beltTop + Math.random() * (beltBottom - beltTop), // Random y in middle 2/3
    }));

    // Duplicate the pattern 2 times for seamless looping
    // Place them at x positions: 0-1 and 1-2 (in viewBox coordinates)
    const noisyPoints = d3.range(2).flatMap((offset) =>
      basePoints.map((p) => ({
        x: p.x + offset, // Offset by 0 and 1x width
        y: p.y,
      }))
    );

    // Function to calculate opacity with fade at top and bottom of belt
    const calculateOpacity = (y: number, baseOpacity: number) => {
      const beltHeight = beltBottom - beltTop;
      const fadeZone = beltHeight * fadeHeight;

      // Fade at top of belt
      if (y < beltTop + fadeZone) {
        return baseOpacity * ((y - beltTop) / fadeZone);
      }
      // Fade at bottom of belt
      if (y > beltBottom - fadeZone) {
        return baseOpacity * ((beltBottom - y) / fadeZone);
      }
      // Full opacity in the middle
      return baseOpacity;
    };

    noisyGroup
      .selectAll(".noisy-point")
      .data(noisyPoints)
      .enter()
      .append("circle")
      .attr("class", "noisy-point")
      .attr("cx", (d) => noisyXScale(d.x))
      .attr("cy", (d) => noisyYScale(d.y))
      .attr("r", () => 5 + Math.random() * 2)
      .attr("stroke", "#916D73")
      .attr("stroke-width", 1)
      .attr("fill", "#E59FAB")
      .attr("opacity", (d) => {
        const baseOpacity = 0.4 + Math.random() * 0.4;
        return calculateOpacity(d.y, baseOpacity);
      });

    // Apply animation - drift to the left (negative translateX)
    noisyGroup.style("animation", `noisy-dots-drift 180s linear infinite`);

    // Update or create style element for keyframes
    // For seamless looping: translate by exactly 1 viewport width
    // Since SVG is 2x width and we offset it by -containerWidth,
    // translating by -containerWidth pixels moves it back to the start position
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = `
      @keyframes noisy-dots-drift {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-${containerWidth}px);
        }
      }
    `;
  }, [dimensions]);

  return (
    <div className="bg-black absolute inset-0 overflow-clip">
      {/* Pre-rendered map animation - positioned relative to content container */}
      <div
        className="h-full max-w-6xl mx-auto flex justify-end"
      >
        <Image
          src="/meshblock-bg.webp"
          alt="Meshblock background animation"
          width={771}
          height={1120}
          className="h-full w-auto object-contain"
          unoptimized
          priority
        />
      </div>
      {/* Noisy background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          ref={svgRef}
          width={dimensions[0] * 2}
          height={dimensions[1]}
          viewBox={`0 0 ${dimensions[0] * 2} ${dimensions[1]}`}
          preserveAspectRatio="none"
          className="h-full"
          style={{
            background: "transparent",
            width: `${dimensions[0] * 2}px`,
          }}
        />
      </div>
    </div>
  );
}
