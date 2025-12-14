"use client";

import * as topojson from "topojson-client";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import topoData from "./nz_mesh_centroids.json";

export default function MeshblockBg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<[number, number]>([1920, 1080]);

  useEffect(() => {
    // Update dimensions on mount and resize
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions([rect.width, rect.height]);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    // Parse the topojson data
    const topology = topoData as unknown as Parameters<
      typeof topojson.feature
    >[0];
    const features = topojson.feature(topology, topology.objects.foo);

    // Get bbox from topojson (already projected coordinates)
    const bbox = topology.bbox || [
      1094476.1089915, 4752925.3434013, 2087671.0068373, 6219777.5222351,
    ];
    const [minX, minY, maxX, maxY] = bbox;

    // Create scales to map from projected coordinates to SVG coordinates
    const xScale = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([0, dimensions[0]]);

    const yScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([dimensions[1], 0]); // Invert Y axis for SVG

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create gradient definitions
    const defs = svg.append("defs");

    // Main gradient (similar to pattern components)
    const gradient = defs
      .append("linearGradient")
      .attr("id", "meshblock-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#e83150");
    gradient.append("stop").attr("offset", "26%").attr("stop-color", "#941f33");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#51111b");
    gradient.append("stop").attr("offset", "66%").attr("stop-color", "#27080d");
    gradient.append("stop").attr("offset", "75%").attr("stop-color", "#180508");
    gradient.append("stop").attr("offset", "85%").attr("stop-color", "#080102");
    gradient.append("stop").attr("offset", "93%").attr("stop-color", "#000");

    // Radial gradient for points
    const radialGradient = defs
      .append("radialGradient")
      .attr("id", "point-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    radialGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#e83150")
      .attr("stop-opacity", "0.8");
    radialGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e83150")
      .attr("stop-opacity", "0");

    // Create main group
    const g = svg.append("g");

    // Color interpolator from #e83150 (red) to #fff (white)
    const colorInterpolator = d3.interpolateRgb("#e83150", "#fff");

    // Draw points
    if (features.type === "FeatureCollection" && features.features) {
      const featurePoints = features.features.filter(
        (f) => f.geometry.type === "Point"
      );
      // sample 100 points
      const sampledPoints = d3
        .shuffle(featurePoints)
        .slice(0, 500)
        .map((feature) => {
          return feature.geometry.type === "Point"
            ? {
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
              }
            : null;
        })
        .filter((feature) => feature !== null);

      // add in some random noisy points within the bounding box
      const noisyPoints = d3.range(100).map(() => {
        return {
          x: Math.random() * (maxX - minX) + minX,
          y: Math.random() * (maxY - minY) + minY,
        };
      });

      g.selectAll(".noisy-point")
        .data(noisyPoints)
        .enter()
        .append("circle")
        .attr("class", "noisy-point")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", () => 5 + Math.random() * 2)
        .attr("stroke", "#e83150")
        .attr("stroke-width", 1)
        .attr("fill", "#e83150")
        .attr("opacity", () => 0.1 + Math.random() * 0.4);

      g.selectAll(".data-point")
        .data(sampledPoints)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", () => 2 + Math.random() * 10)
        .attr("stroke", "#e83150")
        .attr("stroke-width", 1)
        .attr("fill", () => colorInterpolator(Math.pow(Math.random(), 2)))
        .attr("opacity", 0) // Start invisible
        .transition()
        .duration(500)
        .delay((_, i) => i * 10)
        .attr("opacity", () => 0.4 + Math.random() * 0.2);
    }

    // Create a radial gradient for soft edges on the hole
    // In SVG masks: white = visible, black = hidden/transparent
    // For soft edge: black (center, hidden) -> white (edges, visible)
    const holeGradient = defs
      .append("radialGradient")
      .attr("id", "hole-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    holeGradient.append("stop").attr("offset", "0%").attr("stop-color", "#000"); // Black center (hidden)
    holeGradient
      .append("stop")
      .attr("offset", "60%")
      .attr("stop-color", "#000"); // Keep black in center
    holeGradient
      .append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#666"); // Start fading
    holeGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#fff"); // White edges (visible)

    // Create a mask to cut out a hole in the rectangle
    const mask = defs.append("mask").attr("id", "center-hole-mask");

    // White rectangle (visible everywhere)
    mask
      .append("rect")
      .attr("width", dimensions[0])
      .attr("height", dimensions[1])
      .attr("fill", "#fff");

    // Circle with radial gradient (creates soft-edged hole/cutout) - will follow cursor
    const holeCircle = mask
      .append("circle")
      .attr("r", 200)
      .attr("fill", "url(#hole-gradient)");

    // Add a layer of opaque black that covers the entire svg with a hole cut out
    svg
      .append("rect")
      .attr("class", "center-hole")
      .attr("width", dimensions[0])
      .attr("height", dimensions[1])
      .attr("fill", "#000")
      .attr("opacity", 0.4)
      .attr("mask", "url(#center-hole-mask)");

    // Track cursor position and update hole position
    const handleMouseMove = (event: MouseEvent) => {
      console.log("handleMouseMove");
      if (!svgRef.current) return;

      const svgElement = svgRef.current;
      const svgRect = svgElement.getBoundingClientRect();

      // Check if SVG is visible on screen (has non-zero size and is in viewport)
      const isVisible =
        svgRect.width > 0 &&
        svgRect.height > 0 &&
        svgRect.top < window.innerHeight &&
        svgRect.bottom > 0 &&
        svgRect.left < window.innerWidth &&
        svgRect.right > 0;

      if (!isVisible) return;

      // Convert mouse coordinates to SVG coordinate system
      const clientX = event.clientX - svgRect.left;
      const clientY = event.clientY - svgRect.top;

      // Scale to viewBox coordinates
      const svgWidth = svgRect.width;
      const svgHeight = svgRect.height;
      const mouseX = (clientX / svgWidth) * dimensions[0];
      const mouseY = (clientY / svgHeight) * dimensions[1];

      // Update circle position to follow cursor
      holeCircle.attr("cx", mouseX).attr("cy", mouseY);
      console.log({ mouseX, mouseY });
    };

    // Attach event listener
    // const svgElement = svgRef.current;
    // if (svgElement) {
    console.log("adding event listener");
    window.addEventListener("mousemove", handleMouseMove);
    // }

    // Cleanup function
    return () => {
      // if (svgElement) {
      window.removeEventListener("mousemove", handleMouseMove);
      // }
    };
  }, [dimensions]);

  return (
    <div className="bg-black absolute inset-0 overflow-clip">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions[0]} ${dimensions[1]}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full" // -rotate-x-[45deg] skew-4"
        style={{ background: "#000" }}
      />
    </div>
  );
}
