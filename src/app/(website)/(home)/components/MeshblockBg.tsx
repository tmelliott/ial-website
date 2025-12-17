"use client";

import * as topojson from "topojson-client";
import * as d3 from "d3";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import topoData from "./nz_mesh_centroids.json";

export default function MeshblockBg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const mapGroupRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const sampledPointsRef = useRef<Array<{
    x: number;
    y: number;
    z: string;
    opacity: number;
    radius: number;
  }> | null>(null);
  const featurePointsRef = useRef<Array<{
    geometry: { type: string; coordinates: [number, number] };
  }> | null>(null);
  const mapXScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);
  const mapYScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);
  const colorInterpolatorRef = useRef<((t: number) => string) | null>(null);
  const centerPointRef = useRef<{ x: number; y: number } | null>(null);
  const radiusScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);
  const mapXRef = useRef<number>(0);
  const mapYRef = useRef<number>(0);
  const defsRef = useRef<d3.Selection<
    SVGDefsElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // Helper function to create a point from a feature
  const createPointFromFeature = (feature: {
    geometry: { type: string; coordinates: [number, number] };
  }): {
    x: number;
    y: number;
    z: string;
    opacity: number;
    radius: number;
  } => {
    const colorInterpolator =
      colorInterpolatorRef.current || d3.interpolateRgb("#e83150", "#fff");
    return {
      x: feature.geometry.coordinates[0],
      y: feature.geometry.coordinates[1],
      z: colorInterpolator(Math.pow(Math.random(), 2)),
      opacity: 0.4 + Math.random() * 0.6,
      radius: 2 + Math.random() * 10,
    };
  };

  // Helper function to create a line gradient
  const createLineGradient = (
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
    point: { x: number; y: number; z: string; opacity: number; radius: number },
    x1: number,
    y1: number,
    midX: number,
    midY: number,
    gradientId: string
  ) => {
    const radiusScale =
      radiusScaleRef.current ||
      d3.scaleLinear().domain([2, 12]).range([0.3, 1]);
    const scaledOpacity = point.opacity * radiusScale(point.radius);
    const mapX = mapXRef.current;
    const mapY = mapYRef.current;

    const lineGradient = defs
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", mapX + x1)
      .attr("y1", mapY + y1)
      .attr("x2", mapX + midX)
      .attr("y2", mapY + midY);

    lineGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", point.z)
      .attr("stop-opacity", scaledOpacity);

    lineGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", point.z)
      .attr("stop-opacity", 0);

    return lineGradient;
  };

  // Function to replace points
  const startSizeUpdateInterval = useCallback(() => {
    if (
      !mapGroupRef.current ||
      !sampledPointsRef.current ||
      !featurePointsRef.current ||
      !mapXScaleRef.current ||
      !mapYScaleRef.current
    )
      return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up interval to replace points every 3 seconds
    intervalRef.current = setInterval(() => {
      if (
        !mapGroupRef.current ||
        !sampledPointsRef.current ||
        !featurePointsRef.current ||
        !mapXScaleRef.current ||
        !mapYScaleRef.current
      )
        return;

      const totalPoints = sampledPointsRef.current.length;
      const replaceCount = Math.max(1, Math.floor(totalPoints * 0.05)); // 5% of points

      // Randomly select indices to replace
      const indicesToReplace = d3
        .shuffle(d3.range(totalPoints))
        .slice(0, replaceCount);

      // Get currently used coordinates to avoid duplicates
      const usedCoordinates = new Set(
        sampledPointsRef.current.map((p) => `${p.x},${p.y}`)
      );

      // Get available feature points (not currently in use)
      const availableFeatures = featurePointsRef.current.filter(
        (f) =>
          f.geometry.type === "Point" &&
          !usedCoordinates.has(
            `${f.geometry.coordinates[0]},${f.geometry.coordinates[1]}`
          )
      );

      // If we don't have enough available, just use all features
      const featuresToUse =
        availableFeatures.length >= replaceCount
          ? availableFeatures
          : featurePointsRef.current.filter((f) => f.geometry.type === "Point");

      // Shuffle and take new points
      const newFeatures = d3.shuffle([...featuresToUse]).slice(0, replaceCount);

      // Replace points in the array
      indicesToReplace.forEach((index, i) => {
        if (newFeatures[i]) {
          sampledPointsRef.current![index] = createPointFromFeature(
            newFeatures[i]
          );
        }
      });

      if (
        !centerPointRef.current ||
        !radiusScaleRef.current ||
        !defsRef.current
      )
        return;

      const centerPoint = centerPointRef.current;
      const mapXScale = mapXScaleRef.current;
      const mapYScale = mapYScaleRef.current;
      const radiusScale = radiusScaleRef.current;
      const defs = defsRef.current;

      // Update the lines using D3's enter/exit/update pattern
      const lines = mapGroupRef.current
        .selectAll<
          SVGLineElement,
          {
            x: number;
            y: number;
            z: string;
            opacity: number;
            radius: number;
          }
        >(".data-point-line")
        .data(sampledPointsRef.current, (d) => `${d.x},${d.y}`);

      // Remove old lines
      lines.exit().transition().duration(500).attr("opacity", 0).remove();

      // Update existing lines
      lines.each(function (d) {
        const x1 = mapXScale(d.x);
        const y1 = mapYScale(d.y);
        const x2 = centerPoint.x;
        const y2 = centerPoint.y;
        const pdist = 0.8;
        const midX = x1 + (x2 - x1) * pdist;
        const midY = y1 + (y2 - y1) * pdist;

        // Use data coordinates as key for gradient ID
        const gradientId = `line-gradient-${Math.round(d.x)}-${Math.round(d.y)}`;
        const existingGradient = defs.select(`#${gradientId}`);
        if (existingGradient.empty()) {
          createLineGradient(defs, d, x1, y1, midX, midY, gradientId);
        } else {
          // Update gradient stops
          const scaledOpacity = d.opacity * radiusScale(d.radius);
          existingGradient
            .select("stop:first-child")
            .attr("stop-color", d.z)
            .attr("stop-opacity", scaledOpacity);
          existingGradient.select("stop:last-child").attr("stop-color", d.z);
        }

        d3.select(this)
          .transition()
          .duration(1000)
          .ease(d3.easeCubicInOut)
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", midX)
          .attr("y2", midY)
          .attr("stroke", `url(#${gradientId})`);
      });

      // Add new lines
      const newLines = lines
        .enter()
        .append("line")
        .attr("class", "data-point-line")
        .attr("opacity", 0);

      newLines.each(function (d) {
        const x1 = mapXScale(d.x);
        const y1 = mapYScale(d.y);
        const x2 = centerPoint.x;
        const y2 = centerPoint.y;
        const pdist = 0.8;
        const midX = x1 + (x2 - x1) * pdist;
        const midY = y1 + (y2 - y1) * pdist;

        // Use data coordinates as key for gradient ID
        const gradientId = `line-gradient-${Math.round(d.x)}-${Math.round(d.y)}`;
        createLineGradient(defs, d, x1, y1, midX, midY, gradientId);

        d3.select(this)
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", midX)
          .attr("y2", midY)
          .attr("stroke", `url(#${gradientId})`)
          .attr("stroke-width", 1)
          .transition()
          .duration(1000)
          .ease(d3.easeCubicInOut)
          .attr("opacity", 1);
      });

      // Update the circles using D3's enter/exit/update pattern
      const circles = mapGroupRef.current
        .selectAll<
          SVGCircleElement,
          {
            x: number;
            y: number;
            z: string;
            opacity: number;
            radius: number;
          }
        >(".data-point")
        .data(sampledPointsRef.current, (d) => `${d.x},${d.y}`);

      // Remove old circles
      circles.exit().transition().duration(500).attr("opacity", 0).remove();

      // Update existing circles
      circles
        .attr("cx", (d) => mapXScale(d.x))
        .attr("cy", (d) => mapYScale(d.y))
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("r", (d) => d.radius)
        .attr("fill", (d) => d.z)
        .attr("opacity", (d) => d.opacity);

      // Add new circles
      const newCircles = circles
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", (d) => mapXScale(d.x))
        .attr("cy", (d) => mapYScale(d.y))
        .attr("r", (d) => d.radius)
        .attr("stroke", "#e83150")
        .attr("stroke-width", 1)
        .attr("fill", (d) => d.z)
        .attr("opacity", 0);

      newCircles
        .transition()
        .duration(1000)
        .ease(d3.easeCubicInOut)
        .attr("opacity", (d) => d.opacity);
    }, 3000);
  }, []);

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

    // Store references to scales for later use
    mapXScaleRef.current = mapXScale;
    mapYScaleRef.current = mapYScale;

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

    // Store reference to defs for later use
    defsRef.current = defs;

    // Store references to map position
    mapXRef.current = mapX;
    mapYRef.current = mapY;

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

    // Store reference to mapGroup for later use
    mapGroupRef.current = mapGroup;

    // Color interpolator from #e83150 (red) to #fff (white)
    const colorInterpolator = d3.interpolateRgb("#e83150", "#fff");

    // Store reference to color interpolator for later use
    colorInterpolatorRef.current = colorInterpolator;

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

      // Store reference to original feature points for later use
      featurePointsRef.current = featurePoints as unknown as Array<{
        geometry: { type: string; coordinates: [number, number] };
      }>;

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
        .filter((feature) => feature !== null) as Array<{
        x: number;
        y: number;
        z: string;
        opacity: number;
        radius: number;
      }>;

      // Store reference to sampled points for later use
      sampledPointsRef.current = sampledPoints;

      // Center point for lines (within the map area)
      const centerPoint = {
        x: mapWidth * 0.75,
        y: mapHeight * 0.75,
      };

      // Store reference to center point for later use
      centerPointRef.current = centerPoint;

      // Scale opacity based on radius (normalize radius from 2-12 to 0-1 range)
      const radiusScale = d3.scaleLinear().domain([2, 12]).range([0.3, 1]);

      // Store reference to radius scale for later use
      radiusScaleRef.current = radiusScale;

      // Draw lines first (so they appear behind points) using data binding
      const lines = mapGroup
        .selectAll<
          SVGLineElement,
          {
            x: number;
            y: number;
            z: string;
            opacity: number;
            radius: number;
          }
        >(".data-point-line")
        .data(sampledPoints, (d) => `${d.x},${d.y}`);

      lines
        .enter()
        .append("line")
        .attr("class", "data-point-line")
        .each(function (d) {
          const x1 = mapXScale(d.x);
          const y1 = mapYScale(d.y);
          const x2 = centerPoint.x;
          const y2 = centerPoint.y;

          // Calculate midpoint (80% of the way)
          const pdist = 0.8;
          const midX = x1 + (x2 - x1) * pdist;
          const midY = y1 + (y2 - y1) * pdist;

          // Use data coordinates as key for gradient ID
          const gradientId = `line-gradient-${Math.round(d.x)}-${Math.round(d.y)}`;
          createLineGradient(defs, d, x1, y1, midX, midY, gradientId);

          d3.select(this)
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", midX)
            .attr("y2", midY)
            .attr("stroke", `url(#${gradientId})`)
            .attr("stroke-width", 1);
        });

      // Draw map data points
      const circles = mapGroup
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
        .attr("opacity", 0); // Start invisible

      // Track transition completion
      let completedTransitions = 0;
      const totalCircles = circles.size();

      circles
        .transition()
        .duration(500)
        .attr("opacity", (d) => d.opacity)
        .on("end", function () {
          completedTransitions++;
          // Start interval after all transitions complete
          if (
            completedTransitions === totalCircles &&
            intervalRef.current === null
          ) {
            setTimeout(() => {
              startSizeUpdateInterval();
            }, 200); // Small delay to ensure everything is settled
          }
        });
    }
  }, [dimensions, mapDimensions, startSizeUpdateInterval]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
