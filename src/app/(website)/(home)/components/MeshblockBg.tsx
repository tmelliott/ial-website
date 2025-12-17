"use client";

import * as topojson from "topojson-client";
import * as d3 from "d3";
import { useEffect, useRef, useState, useMemo } from "react";
import topoData from "./nz_mesh_centroids.json";

export default function MeshblockBg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<[number, number]>([1920, 1080]);

  // Calculate map dimensions that maintain the NZ map's aspect ratio
  const mapDimensions = useMemo(() => {
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

    // Map should take up approximately the right half of the screen
    // Use container height as the base, maintain aspect ratio
    const mapHeight = dimensions[1];
    const mapWidth = mapHeight * dataAspectRatio;

    return {
      width: mapWidth,
      height: mapHeight,
      dataAspectRatio,
      bbox: [minX, minY, maxX, maxY] as [number, number, number, number],
    };
  }, [dimensions]);

  useEffect(() => {
    // Update dimensions to use viewport dimensions
    const updateDimensions = () => {
      setDimensions([window.innerWidth, window.innerHeight]);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const [containerWidth, containerHeight] = dimensions;
    const { width: mapWidth, height: mapHeight, bbox } = mapDimensions;
    const [minX, minY, maxX, maxY] = bbox;

    // Parse the topojson data
    const topology = topoData as unknown as Parameters<
      typeof topojson.feature
    >[0];
    const features = topojson.feature(topology, topology.objects.foo);

    // Position map on the right side of the container
    const mapX = containerWidth - mapWidth;
    const mapY = 0;

    // Create scales for map data (projected coordinates to map area)
    const mapXScale = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([0, mapWidth]);
    const mapYScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([mapHeight, 0]);

    // Create scales for noisy data (full container)
    const noisyXScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, containerWidth]);
    const noisyYScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, containerHeight]);

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

    // Create groups for noisy data and map data
    const noisyGroup = svg.append("g").attr("class", "noisy-group");
    const mapGroup = svg
      .append("g")
      .attr("class", "map-group")
      .attr("transform", `translate(${mapX}, ${mapY})`);

    // Color interpolator from #e83150 (red) to #fff (white)
    const colorInterpolator = d3.interpolateRgb("#e83150", "#fff");

    // Draw noisy points covering the full container
    const noisyPoints = d3.range(200).map(() => {
      return {
        x: Math.random(),
        y: Math.random(),
      };
    });

    noisyGroup
      .selectAll(".noisy-point")
      .data(noisyPoints)
      .enter()
      .append("circle")
      .attr("class", "noisy-point")
      .attr("cx", (d) => noisyXScale(d.x))
      .attr("cy", (d) => noisyYScale(d.y))
      .attr("r", () => 5 + Math.random() * 2)
      .attr("stroke", "#e83150")
      .attr("stroke-width", 1)
      .attr("fill", "#e83150")
      .attr("opacity", () => 0.4 + Math.random() * 0.4);

    // Draw map data points
    if (features.type === "FeatureCollection" && features.features) {
      const featurePoints = features.features.filter(
        (f) => f.geometry.type === "Point"
      );

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

      // Center point for lines (within the map area)
      const centerPoint = {
        x: mapWidth * 0.75,
        y: mapHeight * 0.75,
      };

      // Scale opacity based on radius (normalize radius from 2-12 to 0-1 range)
      const radiusScale = d3.scaleLinear().domain([2, 12]).range([0.3, 1]);

      // Draw lines first (so they appear behind points)
      sampledPoints.forEach((d, i) => {
        const x1 = mapXScale(d.x);
        const y1 = mapYScale(d.y);
        const x2 = centerPoint.x;
        const y2 = centerPoint.y;

        // Calculate midpoint (80% of the way)
        const pdist = 0.8;
        const midX = x1 + (x2 - x1) * pdist;
        const midY = y1 + (y2 - y1) * pdist;

        // Create a unique gradient for this line
        const lineGradient = defs
          .append("linearGradient")
          .attr("id", `line-gradient-${i}`)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", mapX + x1)
          .attr("y1", mapY + y1)
          .attr("x2", mapX + midX)
          .attr("y2", mapY + midY);

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

        // Create the line within the map group
        mapGroup
          .append("line")
          .attr("class", "data-point-line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", midX)
          .attr("y2", midY)
          .attr("stroke", `url(#line-gradient-${i})`)
          .attr("stroke-width", 1);
      });

      // Draw map data points
      mapGroup
        .selectAll(".data-point")
        .data(sampledPoints)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", (d) => mapXScale(d.x))
        .attr("cy", (d) => mapYScale(d.y))
        .attr("r", (d) => d.radius)
        .attr("stroke", "#e83150")
        .attr("stroke-width", 1)
        .attr("fill", (d) => d.z)
        .attr("opacity", 0) // Start invisible
        .transition()
        .duration(500)
        .attr("opacity", (d) => d.opacity);
    }
  }, [dimensions, mapDimensions]);

  return (
    <div className="bg-black absolute inset-0 overflow-clip">
      <svg
        ref={svgRef}
        width={dimensions[0]}
        height={dimensions[1]}
        viewBox={`0 0 ${dimensions[0]} ${dimensions[1]}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ background: "#000" }}
      />
    </div>
  );
}
