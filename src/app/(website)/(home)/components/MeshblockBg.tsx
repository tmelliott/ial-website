"use client";

import * as topojson from "topojson-client";
import * as d3 from "d3";
import { useEffect, useRef, useState, useMemo } from "react";
import topoData from "./nz_mesh_centroids.json";

export default function MeshblockBg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<[number, number]>([1920, 1080]);

  // Calculate SVG dimensions that maintain the data's aspect ratio
  const svgDimensions = useMemo(() => {
    const topology = topoData as unknown as Parameters<
      typeof topojson.feature
    >[0];
    const bbox = topology.bbox || [
      1094476.1089915, 4752925.3434013, 2087671.0068373, 6219777.5222351,
    ];
    const [minX, minY, maxX, maxY] = bbox;

    // Calculate the aspect ratio of the projected data
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;
    const dataAspectRatio = dataWidth / dataHeight;

    // Calculate the aspect ratio of the container
    const containerAspectRatio = dimensions[0] / dimensions[1];

    // Determine the actual SVG dimensions that maintain the data's aspect ratio
    // while fitting within the container
    if (containerAspectRatio > dataAspectRatio) {
      // Container is wider than data aspect ratio - fit to height
      return [dimensions[1] * dataAspectRatio, dimensions[1]];
    } else {
      // Container is taller than data aspect ratio - fit to width
      return [dimensions[0], dimensions[0] / dataAspectRatio];
    }
  }, [dimensions]);

  const [svgWidth, svgHeight] = svgDimensions;

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
    const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, svgWidth]);

    const yScale = d3.scaleLinear().domain([minY, maxY]).range([svgHeight, 0]); // Invert Y axis for SVG

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
        .slice(0, 1000)
        .map((feature) => {
          return feature.geometry.type === "Point"
            ? {
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
                z: colorInterpolator(Math.pow(Math.random(), 2)),
                opacity: 0.4 + Math.random() * 0.6,
                radius: 2 + Math.random() * 10,
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

      // "target" the very center of the svg (for now)
      const centerPoint = {
        x: svgWidth * 0.75,
        y: svgHeight * 0.75,
      };

      // Scale opacity based on radius (normalize radius from 2-12 to 0-1 range)
      const radiusScale = d3.scaleLinear().domain([2, 12]).range([0.3, 1]);

      // Draw lines first (so they appear behind points)
      sampledPoints.forEach((d, i) => {
        const x1 = xScale(d.x);
        const y1 = yScale(d.y);
        const x2 = centerPoint.x;
        const y2 = centerPoint.y;

        // Calculate midpoint (50% of the way)
        const pdist = 0.8;
        const midX = x1 + (x2 - x1) * pdist;
        const midY = y1 + (y2 - y1) * pdist;

        // Create a unique gradient for this line
        const lineGradient = defs
          .append("linearGradient")
          .attr("id", `line-gradient-${i}`)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", midX)
          .attr("y2", midY);

        const scaledOpacity = d.opacity * radiusScale(d.radius);

        lineGradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", d.z)
          .attr("stop-opacity", scaledOpacity);

        lineGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", d.z)
          .attr("stop-opacity", 0);

        // Create the line
        g.append("line")
          .attr("class", "data-point-line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", midX)
          .attr("y2", midY)
          .attr("stroke", `url(#line-gradient-${i})`)
          .attr("stroke-width", 1);
      });

      // Draw points on top of lines
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
        .attr("opacity", () => 0.4 + Math.random() * 0.4);

      g.selectAll(".data-point")
        .data(sampledPoints)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", (d) => d.radius)
        .attr("stroke", "#e83150")
        .attr("stroke-width", 1)
        .attr("fill", (d) => d.z)
        .attr("opacity", 0) // Start invisible
        .transition()
        .duration(500)
        // .delay((_, i) => i * 10)
        .attr("opacity", (d) => d.opacity);
    }
  }, [dimensions, svgWidth, svgHeight]);

  return (
    <div className="bg-black absolute inset-0 overflow-clip">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full" // -rotate-x-[45deg] skew-4"
        style={{ background: "#000" }}
      />
    </div>
  );
}
