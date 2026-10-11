"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "motion/react";

// ============================================================================
// CONFIGURATION - Adjust these parameters to customize the animation
// ============================================================================

const CONFIG = {
  // Logo dimensions (from original SVG, scaled by 1.3333)
  width: 764.16,
  height: 334.78,
  scale: 1.3333,

  // Dot configuration
  dot: {
    radius: 14.311,
    strokeWidth: 3,
    columns: [36.945, 72, 107, 142, 178.469], // X positions (columns)
    rows: [72, 107.5, 142.8, 178.2], // Y positions (rows from bottom)
  },

  // Boxplot configuration (exact values from original SVG)
  boxplot: {
    y: 34.783, // Center Y of the boxplot line
    boxHeight: 24.834,
    boxTop: 47.2,
    boxBottom: 22.366,
    leftWhiskerEnd: 20.5,
    leftWhiskerStart: 57.5, // Box left edge
    rightWhiskerStart: 157.5, // Starts 1 unit inside box right edge
    rightWhiskerFinal: 551.32,
    boxLeft: 57.5,
    boxRight: 158.5,
  },

  // Colors (from original SVG)
  colors: {
    red: "#c62127",
    darkRed: "#d72027",
    black: "#231f20",
  },

  // Animation timing (in seconds)
  timing: {
    dotAddInterval: 0.12, // Time between adding each dot
    cycleInterval: 0.35, // Time between random configurations
    numCycles: 5, // Number of random configurations before settling
    settleDelay: 0.3, // Delay after settling
    textFadeIn: 0.6, // Duration for text fade in
    whiskerExtend: 0.8, // Duration for whisker extension
  },
};

// ============================================================================
// TYPES
// ============================================================================

interface DotConfig {
  id: string;
  cx: number;
  cy: number;
}

interface BoxplotConfig {
  boxLeft: number;
  boxRight: number;
  leftWhisker: number;
  rightWhisker: number;
}

type AnimationPhase =
  | "buildingDots"
  | "cycling"
  | "settling"
  | "settled"
  | "showText"
  | "extendWhisker"
  | "complete";

// ============================================================================
// FINAL DOT CONFIGURATION
// ============================================================================

// The final dot configuration matching the original logo exactly
// Ordered by column for the final arrangement
const FINAL_DOT_CONFIG: DotConfig[] = [
  // Column 1 (x≈37): 1 dot
  { id: "d1", cx: 36.945, cy: 72.117 },
  // Column 2 (x≈72): 2 dots
  { id: "d2", cx: 71.935, cy: 72.117 },
  { id: "d6", cx: 72.129, cy: 107.55 },
  // Column 3 (x≈107): 4 dots
  { id: "d3", cx: 106.929, cy: 72.062 },
  { id: "d7", cx: 107.119, cy: 107.55 },
  { id: "d10", cx: 107.119, cy: 142.87 },
  { id: "d12", cx: 107.119, cy: 178.19 },
  // Column 4 (x≈142): 3 dots
  { id: "d4", cx: 142.279, cy: 72.171 },
  { id: "d8", cx: 142.109, cy: 107.49 },
  { id: "d11", cx: 142.109, cy: 142.82 },
  // Column 5 (x≈178): 2 dots
  { id: "d5", cx: 178.469, cy: 72.171 },
  { id: "d9", cx: 178.469, cy: 107.49 },
];

const FINAL_BOXPLOT: BoxplotConfig = {
  boxLeft: CONFIG.boxplot.boxLeft,
  boxRight: CONFIG.boxplot.boxRight,
  leftWhisker: CONFIG.boxplot.leftWhiskerEnd,
  rightWhisker: CONFIG.boxplot.rightWhiskerStart,
};

// ============================================================================
// RANDOM CONFIGURATION GENERATION
// ============================================================================

/**
 * Generate a random dotplot configuration (different "data")
 * Returns dots arranged in columns with varying heights
 */
function generateRandomConfig(numDots: number): {
  dots: DotConfig[];
  boxplot: BoxplotConfig;
} {
  const { columns, rows } = CONFIG.dot;
  const dots: DotConfig[] = [];

  // Generate random distribution across columns (bell-curve-ish)
  const distribution: number[] = [];
  let remaining = numDots;

  for (let i = 0; i < columns.length; i++) {
    if (i === columns.length - 1) {
      distribution.push(remaining);
    } else {
      // More dots in center columns
      const distFromCenter = Math.abs(i - (columns.length - 1) / 2);
      const maxForCol = Math.max(1, rows.length - Math.floor(distFromCenter));
      const count = Math.min(
        remaining,
        Math.floor(Math.random() * maxForCol) + (remaining > columns.length - i ? 1 : 0)
      );
      distribution.push(count);
      remaining -= count;
    }
  }

  // Shuffle distribution a bit for variety
  for (let i = distribution.length - 1; i > 0; i--) {
    if (Math.random() < 0.3) {
      const j = Math.floor(Math.random() * (i + 1));
      [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
    }
  }

  // Create dots based on distribution
  let dotId = 0;
  columns.forEach((cx, colIdx) => {
    const numInCol = Math.min(distribution[colIdx], rows.length);
    for (let row = 0; row < numInCol; row++) {
      dots.push({
        id: `dot${dotId++}`,
        cx: cx + (Math.random() - 0.5) * 3, // Small jitter
        cy: rows[row] + (Math.random() - 0.5) * 2,
      });
    }
  });

  // Calculate boxplot from dots
  const xValues = dots.map((d) => d.cx).sort((a, b) => a - b);
  const q1Idx = Math.floor(xValues.length * 0.25);
  const q3Idx = Math.floor(xValues.length * 0.75);

  const boxplot: BoxplotConfig = {
    boxLeft: xValues[q1Idx] - 10,
    boxRight: xValues[q3Idx] + 10,
    leftWhisker: Math.max(CONFIG.boxplot.leftWhiskerEnd, xValues[0] - 20),
    rightWhisker: xValues[q3Idx] + 10,
  };

  return { dots, boxplot };
}

// ============================================================================
// COORDINATE TRANSFORMATION
// ============================================================================

const scaleX = (x: number) => x * CONFIG.scale;
const scaleY = (y: number) => CONFIG.height - y * CONFIG.scale;
const scaleSize = (s: number) => s * CONFIG.scale;

// ============================================================================
// SVG PATH COMPONENTS
// ============================================================================

// Text paths extracted from the original SVG (analytics text)
const AnalyticsText = ({
  opacity = 1,
  textColor = CONFIG.colors.black,
}: {
  opacity?: number;
  textColor?: string;
}) => (
  <g
    style={{ opacity }}
    transform={`matrix(${CONFIG.scale} 0 0 -${CONFIG.scale} 0 ${CONFIG.height})`}
  >
    {/* 'a' */}
    <g transform="translate(240.14 82.604)">
      <path
        d="m0 0c-2.544 0.565-4.326 0.849-5.344 0.849-4.072 0-7.394-1.047-9.967-3.139-2.573-2.093-3.86-4.566-3.86-7.423 0-4.723 2.785-7.083 8.356-7.083 4.071 0 7.677 1.937 10.815 5.811zm0.764-17.093c-3.224-4.044-8.159-6.065-14.803-6.065-3.563 0-6.652 1.294-9.267 3.881-2.616 2.588-3.923 5.803-3.923 9.649 0 4.608 2.014 8.504 6.043 11.686 4.03 3.18 9.168 4.771 15.418 4.771 1.697 0 3.619-0.368 5.768-1.102 0 7.35-3.28 11.027-9.84 11.027-5.033 0-8.907-1.358-11.621-4.071l-3.393 6.743c1.527 1.244 3.64 2.312 6.341 3.202 2.7 0.891 5.28 1.336 7.74 1.336 6.588 0 11.374-1.499 14.357-4.496s4.475-7.761 4.475-14.293v-16.287c0-3.988 1.188-6.646 3.563-7.974v-4.029c-3.281 0-5.733 0.467-7.359 1.399-1.626 0.934-2.793 2.474-3.499 4.623"
        fill={textColor}
      />
    </g>
    {/* 'n' */}
    <g transform="translate(288.83 60.294)">
      <path
        d="m0 0v26.424c0 4.836-0.729 8.222-2.185 10.159-1.456 1.936-3.895 2.905-7.316 2.905-1.838 0-3.761-0.551-5.768-1.655-2.008-1.102-3.549-2.46-4.623-4.071v-33.762h-8.059v45.426h5.514l2.545-5.854c2.657 4.468 6.998 6.702 13.021 6.702 9.953 0 14.93-6.051 14.93-18.153v-28.121z"
        fill={textColor}
      />
    </g>
    {/* 'a' (second) */}
    <g transform="translate(333.24 82.604)">
      <path
        d="m0 0c-2.544 0.565-4.326 0.849-5.344 0.849-4.072 0-7.394-1.047-9.967-3.139-2.573-2.093-3.86-4.566-3.86-7.423 0-4.723 2.785-7.083 8.356-7.083 4.071 0 7.677 1.937 10.815 5.811zm0.764-17.093c-3.224-4.044-8.159-6.065-14.803-6.065-3.563 0-6.652 1.294-9.267 3.881-2.616 2.588-3.923 5.803-3.923 9.649 0 4.608 2.014 8.504 6.043 11.686 4.03 3.18 9.168 4.771 15.418 4.771 1.697 0 3.619-0.368 5.768-1.102 0 7.35-3.28 11.027-9.84 11.027-5.033 0-8.907-1.358-11.621-4.071l-3.393 6.743c1.527 1.244 3.64 2.312 6.341 3.202 2.7 0.891 5.28 1.336 7.74 1.336 6.588 0 11.374-1.499 14.357-4.496s4.475-7.761 4.475-14.293v-16.287c0-3.988 1.188-6.646 3.563-7.974v-4.029c-3.281 0-5.733 0.467-7.359 1.399-1.626 0.934-2.793 2.474-3.499 4.623"
        fill={textColor}
      />
    </g>
    {/* 'l' */}
    <g transform="translate(354.61 73.146)">
      <path
        d="m0 0v51.194h8.059v-49.837c0-2.432 0.699-4.347 2.099-5.747s3.23-2.099 5.492-2.099v-7.211c-10.433 0-15.65 4.566-15.65 13.7"
        fill={textColor}
      />
    </g>
    {/* 'y' */}
    <g transform="translate(396.94 52.574)">
      <path
        d="m0 0c-1.046-2.884-3.245-5.287-6.596-7.21-3.35-1.923-7.09-2.885-11.218-2.885v7.211c3.365 0 6.249 0.784 8.652 2.354 2.404 1.569 3.606 3.485 3.606 5.748 0 2.488-0.439 4.94-1.315 7.358-0.877 2.418-2.008 5.408-3.393 8.971l-12.3 31.599h8.228l13.36-35.12 12.003 35.12h8.229z"
        fill={textColor}
      />
    </g>
    {/* 't' */}
    <g transform="translate(425.32 99.358)">
      <path
        d="m0 0h-5.259v6.362h5.259v9.501l8.059 3.096v-12.597h12.469v-6.362h-12.469v-22.564c0-3.818 0.642-6.532 1.929-8.144 1.286-1.611 3.358-2.417 6.214-2.417 2.064 0 4.199 0.522 6.404 1.569l1.188-7.084c-3.337-0.847-6.998-1.272-10.985-1.272-3.591 0-6.624 1.336-9.098 4.009-2.474 2.672-3.711 6.044-3.711 10.115z"
        fill={textColor}
      />
    </g>
    {/* 'i' */}
    <g transform="translate(465.19 122.9)">
      <path
        d="m0 0c1.385 0 2.566-0.488 3.541-1.463 0.975-0.976 1.463-2.142 1.463-3.499 0-1.386-0.488-2.567-1.463-3.542s-2.156-1.463-3.541-1.463c-1.357 0-2.524 0.488-3.499 1.463-0.976 0.975-1.464 2.156-1.464 3.542 0 1.384 0.481 2.558 1.442 3.52 0.961 0.961 2.135 1.442 3.521 1.442m-4.411-62.604v38.64h-6.235v6.786h14.292v-45.426z"
        fill={textColor}
      />
    </g>
    {/* 'c' */}
    <g transform="translate(515.91 102.03)">
      <path
        d="m0 0-3.986-5.684c-0.822 0.82-2.27 1.598-4.348 2.333s-4.122 1.103-6.129 1.103c-4.383 0-7.861-1.534-10.433-4.602-2.574-3.068-3.861-7.275-3.861-12.618 0-5.317 1.316-9.367 3.945-12.152 2.629-2.786 6.277-4.177 10.943-4.177 3.619 0 7.266 1.399 10.942 4.198l3.182-6.786c-4.326-2.799-9.686-4.199-16.075-4.199-6.193 0-11.311 2.079-15.354 6.235-4.044 4.156-6.065 9.783-6.065 16.881 0 7.238 2.099 13.049 6.299 17.432 4.198 4.383 9.945 6.574 17.241 6.574 2.346 0 4.891-0.495 7.634-1.484 2.743-0.991 4.764-2.009 6.065-3.054"
        fill={textColor}
      />
    </g>
    {/* 's' */}
    <g transform="translate(521.68 63.009)">
      <path
        d="m0 0 2.842 7.634c4.496-2.941 8.115-4.41 10.858-4.41 4.976 0 7.465 2.091 7.465 6.276 0 2.997-2.404 5.57-7.211 7.72-3.704 1.696-6.199 2.983-7.486 3.859-1.286 0.877-2.404 1.873-3.351 2.99-0.947 1.118-1.654 2.305-2.12 3.564-0.467 1.258-0.7 2.608-0.7 4.051 0 3.732 1.357 6.644 4.072 8.736 2.714 2.093 6.263 3.139 10.646 3.139 3.308 0 7.478-1.046 12.511-3.139l-2.29-7.464c-3.195 2.544-6.404 3.817-9.628 3.817-1.922 0-3.542-0.453-4.856-1.357-1.314-0.906-1.973-2.051-1.973-3.436 0-2.913 1.655-5.119 4.963-6.617l5.769-2.63c3.534-1.611 6.107-3.45 7.718-5.513 1.613-2.065 2.418-4.652 2.418-7.762 0-4.071-1.428-7.26-4.284-9.564-2.856-2.305-6.814-3.457-11.876-3.457-4.778 0-9.274 1.187-13.487 3.563"
        fill={textColor}
      />
    </g>
  </g>
);

// iNZight text paths (with NZ in red)
const INZightText = ({
  opacity = 1,
  textColor = CONFIG.colors.black,
}: {
  opacity?: number;
  textColor?: string;
}) => (
  <g
    style={{ opacity }}
    transform={`matrix(${CONFIG.scale} 0 0 -${CONFIG.scale} 0 ${CONFIG.height})`}
  >
    {/* 'i' (black) */}
    <g transform="translate(184.2 230.67)">
      <path
        d="m0 0c2.375 0 4.403-0.842 6.086-2.524 1.682-1.683 2.524-3.711 2.524-6.086s-0.842-4.405-2.524-6.087c-1.683-1.683-3.711-2.523-6.086-2.523s-4.404 0.84-6.086 2.523c-1.684 1.682-2.524 3.712-2.524 6.087s0.84 4.403 2.524 6.086c1.682 1.682 3.711 2.524 6.086 2.524m-7.66-88.239v51.423h-8.135v12.173h23.158v-63.596z"
        fill={textColor}
      />
    </g>
    {/* 'N' (red) */}
    <g transform="translate(249.75 142.44)">
      <path
        d="m0 0v36.756c0 5.423-1.039 9.382-3.118 11.876-2.078 2.494-5.473 3.741-10.183 3.741-2.178 0-4.504-0.614-6.977-1.841-2.474-1.227-4.405-2.752-5.79-4.572v-45.96h-14.845v63.596h10.689l2.731-5.938c4.038 4.75 9.995 7.126 17.873 7.126 7.561 0 13.529-2.267 17.903-6.8s6.562-10.857 6.562-18.971v-39.013z"
        fill={CONFIG.colors.darkRed}
      />
    </g>
    {/* 'Z' (red) */}
    <g transform="translate(276.47 142.44)">
      <path
        d="m0 0v5.047l34.499 45.604h-33.905v12.945h55.579v-5.225l-33.253-45.426h33.609v-12.945z"
        fill={CONFIG.colors.darkRed}
      />
    </g>
    {/* 'i' (black) */}
    <g transform="translate(356.52 230.67)">
      <path
        d="m0 0c2.375 0 4.403-0.842 6.086-2.524 1.682-1.683 2.524-3.711 2.524-6.086s-0.842-4.405-2.524-6.087c-1.683-1.683-3.711-2.523-6.086-2.523s-4.404 0.84-6.086 2.523c-1.684 1.682-2.524 3.712-2.524 6.087s0.84 4.403 2.524 6.086c1.682 1.682 3.711 2.524 6.086 2.524m-7.66-88.239v51.423h-8.135v12.173h23.158v-63.596z"
        fill={textColor}
      />
    </g>
    {/* 'g' (black) */}
    <g transform="translate(391.25 183.71)">
      <path
        d="m0 0c0-3.761 1.039-6.779 3.117-9.055 2.079-2.277 4.879-3.415 8.403-3.415 3.522 0 6.234 1.108 8.134 3.325 1.901 2.217 2.851 5.265 2.851 9.145 0 3.207-1.02 5.917-3.058 8.135-2.04 2.217-4.682 3.325-7.927 3.325-3.406 0-6.176-1.068-8.313-3.206-2.138-2.138-3.207-4.89-3.207-8.254m-14.845-57.599 9.382 11.579c5.186-4.75 10.965-7.125 17.339-7.125 4.275 0 7.798 0.634 10.569 1.9 2.771 1.267 4.157 3.009 4.157 5.225 0 3.762-3.068 5.642-9.204 5.642-1.663 0-4.137-0.199-7.422-0.594-3.287-0.395-5.76-0.594-7.423-0.594-10.213 0-15.32 3.661-15.32 10.985 0 2.098 0.851 4.157 2.554 6.176 1.701 2.019 3.681 3.503 5.938 4.453-7.245 4.711-10.867 11.381-10.867 20.012 0 6.808 2.494 12.44 7.482 16.893 4.988 4.454 11.123 6.68 18.408 6.68 5.7 0 10.47-1.069 14.31-3.206l5.819 6.769 10.273-9.322-7.067-5.166c2.455-3.722 3.682-8.116 3.682-13.183 0-7.244-2.207-13.034-6.62-17.369-4.415-4.334-9.987-6.502-16.716-6.502-1.069 0-2.494 0.098-4.275 0.297l-2.435 0.357c-0.277 0-1.336-0.427-3.177-1.277-1.84-0.852-2.761-1.733-2.761-2.643 0-1.583 1.366-2.375 4.097-2.375 1.227 0 3.286 0.297 6.176 0.891 2.889 0.594 5.363 0.89 7.422 0.89 14.449 0 21.674-5.799 21.674-17.398 0-6.413-2.89-11.45-8.67-15.112-5.78-3.661-12.747-5.492-20.901-5.492-9.738 0-18.547 2.87-26.424 8.609"
        fill={textColor}
      />
    </g>
    {/* 'h' (black) */}
    <g transform="translate(483.35 142.44)">
      <path
        d="m0 0v39.191c0 3.919-1.228 7.066-3.682 9.441-2.455 2.375-5.661 3.563-9.619 3.563-2.455 0-4.928-0.663-7.422-1.989-2.494-1.327-4.275-2.841-5.344-4.543v-45.663h-15.082v87.289l15.082 3.563v-31.294c3.839 3.483 9.124 5.226 15.854 5.226 7.957 0 14.132-2.208 18.526-6.621 4.394-4.415 6.591-10.739 6.591-18.972v-39.191z"
        fill={textColor}
      />
    </g>
    {/* 't' (black) */}
    <g transform="translate(516.54 194.1)">
      <path
        d="m0 0h-7.363v11.936h7.363v12.944l14.845 5.463v-18.407h17.458v-11.936h-17.458v-27.849c0-4.553 0.713-7.77 2.137-9.65 1.426-1.88 3.919-2.82 7.483-2.82 3.562 0 6.888 0.969 9.975 2.909v-13.657c-3.444-1.187-8.353-1.781-14.726-1.781-6.334 0-11.203 1.79-14.608 5.374-3.404 3.582-5.106 8.679-5.106 15.29z"
        fill={textColor}
      />
    </g>
  </g>
);

// Boxplot component using paths (exactly matching original SVG)
const Boxplot = ({
  boxLeft,
  boxRight,
  leftWhisker,
  rightWhiskerEnd,
  strokeWidth,
}: {
  boxLeft: number;
  boxRight: number;
  leftWhisker: number;
  rightWhiskerEnd: number;
  strokeWidth: number;
}) => {
  const { boxTop, boxBottom, y, rightWhiskerStart } = CONFIG.boxplot;

  return (
    <g
      transform={`matrix(${CONFIG.scale} 0 0 -${CONFIG.scale} 0 ${CONFIG.height})`}
      fill="none"
      stroke={CONFIG.colors.red}
      strokeMiterlimit="10"
      strokeWidth={strokeWidth}
    >
      {/* Box */}
      <motion.path
        d={`M${boxRight} ${boxBottom}h-${boxRight - boxLeft}v${boxTop - boxBottom}h${boxRight - boxLeft}z`}
        animate={{
          d: `M${boxRight} ${boxBottom}h-${boxRight - boxLeft}v${boxTop - boxBottom}h${boxRight - boxLeft}z`,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* Left whisker */}
      <motion.path
        d={`M${leftWhisker} ${y}h${boxLeft - leftWhisker}`}
        animate={{
          d: `M${leftWhisker} ${y}h${boxLeft - leftWhisker}`,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* Right whisker */}
      <motion.path
        d={`M${rightWhiskerStart} ${y}h${rightWhiskerEnd - rightWhiskerStart}`}
        animate={{
          d: `M${rightWhiskerStart} ${y}h${rightWhiskerEnd - rightWhiskerStart}`,
        }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </g>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface AnimatedLogoProps {
  width?: number;
  autoplay?: boolean;
  onComplete?: () => void;
  loop?: boolean;
  startDelay?: number;
  className?: string;
  darkBackground?: boolean;
  progress?: number;
}

export default function AnimatedLogo({
  width = 400,
  autoplay = true,
  onComplete,
  loop = false,
  startDelay = 500,
  className = "",
  darkBackground = false,
  progress: externalProgress,
}: AnimatedLogoProps) {
  const textColor = darkBackground ? "#ffffff" : CONFIG.colors.black;
  const [phase, setPhase] = useState<AnimationPhase>("buildingDots");
  const [visibleDotCount, setVisibleDotCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [currentConfig, setCurrentConfig] = useState<{
    dots: DotConfig[];
    boxplot: BoxplotConfig;
  }>({ dots: [], boxplot: FINAL_BOXPLOT });
  const [textOpacity, setTextOpacity] = useState(0);
  const [analyticsOpacity, setAnalyticsOpacity] = useState(0);
  const [whiskerExtension, setWhiskerExtension] = useState(0);

  const aspectRatio = CONFIG.height / CONFIG.width;
  const height = width * aspectRatio;

  const isExternallyControlled = externalProgress !== undefined;

  // Reset animation
  const resetAnimation = useCallback(() => {
    setPhase("buildingDots");
    setVisibleDotCount(0);
    setCycleCount(0);
    setCurrentConfig({ dots: [], boxplot: FINAL_BOXPLOT });
    setTextOpacity(0);
    setAnalyticsOpacity(0);
    setWhiskerExtension(0);
  }, []);

  // Animation state machine
  useEffect(() => {
    if (!autoplay || isExternallyControlled) return;

    let timeout: NodeJS.Timeout;
    let animationFrame: number;

    const runPhase = () => {
      switch (phase) {
        case "buildingDots":
          if (visibleDotCount < FINAL_DOT_CONFIG.length) {
            // Add dots one by one
            timeout = setTimeout(() => {
              const newCount = visibleDotCount + 1;
              setVisibleDotCount(newCount);
              // Generate random config for current number of dots
              const config = generateRandomConfig(newCount);
              setCurrentConfig(config);
            }, CONFIG.timing.dotAddInterval * 1000);
          } else {
            // All dots visible, start cycling
            setPhase("cycling");
          }
          break;

        case "cycling":
          if (cycleCount < CONFIG.timing.numCycles) {
            timeout = setTimeout(() => {
              const config = generateRandomConfig(FINAL_DOT_CONFIG.length);
              setCurrentConfig(config);
              setCycleCount((c) => c + 1);
            }, CONFIG.timing.cycleInterval * 1000);
          } else {
            // Done cycling, settle to final
            setPhase("settling");
          }
          break;

        case "settling":
          // Animate to final configuration
          setCurrentConfig({ dots: FINAL_DOT_CONFIG, boxplot: FINAL_BOXPLOT });
          timeout = setTimeout(() => {
            setPhase("settled");
          }, CONFIG.timing.settleDelay * 1000 + 300); // Extra time for animation
          break;

        case "settled":
          timeout = setTimeout(() => {
            setPhase("showText");
          }, 100);
          break;

        case "showText":
          const textStart = Date.now();
          const animateText = () => {
            const elapsed = (Date.now() - textStart) / 1000;
            const progress = Math.min(elapsed / CONFIG.timing.textFadeIn, 1);
            setTextOpacity(progress);
            if (progress < 1) {
              animationFrame = requestAnimationFrame(animateText);
            } else {
              setPhase("extendWhisker");
            }
          };
          animationFrame = requestAnimationFrame(animateText);
          break;

        case "extendWhisker":
          const whiskerStart = Date.now();
          const animateWhiskerAndAnalytics = () => {
            const elapsed = (Date.now() - whiskerStart) / 1000;
            const whiskerProgress = Math.min(elapsed / CONFIG.timing.whiskerExtend, 1);
            const whiskerEased = 1 - Math.pow(1 - whiskerProgress, 3);
            setWhiskerExtension(whiskerEased);

            // Analytics fades in with whisker
            const analyticsDelay = 0.15;
            const analyticsDuration = CONFIG.timing.whiskerExtend - analyticsDelay;
            const analyticsElapsed = Math.max(0, elapsed - analyticsDelay);
            const analyticsProgress = Math.min(analyticsElapsed / analyticsDuration, 1);
            setAnalyticsOpacity(analyticsProgress);

            if (whiskerProgress < 1) {
              animationFrame = requestAnimationFrame(animateWhiskerAndAnalytics);
            } else {
              setPhase("complete");
            }
          };
          animationFrame = requestAnimationFrame(animateWhiskerAndAnalytics);
          break;

        case "complete":
          onComplete?.();
          if (loop) {
            timeout = setTimeout(resetAnimation, 2000);
          }
          break;
      }
    };

    if (phase === "buildingDots" && visibleDotCount === 0) {
      timeout = setTimeout(runPhase, startDelay);
    } else {
      runPhase();
    }

    return () => {
      clearTimeout(timeout);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [phase, visibleDotCount, cycleCount, autoplay, loop, startDelay, onComplete, resetAnimation, isExternallyControlled]);

  // Calculate whisker end position
  const currentWhiskerEnd = useMemo(() => {
    const start = CONFIG.boxplot.rightWhiskerStart;
    const end = CONFIG.boxplot.rightWhiskerFinal;
    return start + (end - start) * whiskerExtension;
  }, [whiskerExtension]);

  // Get current dots to display
  const displayDots = currentConfig.dots.slice(0, visibleDotCount);

  return (
    <svg
      viewBox={`0 0 ${CONFIG.width} ${CONFIG.height}`}
      width={width}
      height={height}
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* Dots */}
      {displayDots.map((dot, index) => (
        <motion.circle
          key={`dot-${index}`}
          r={scaleSize(CONFIG.dot.radius)}
          fill="none"
          stroke={CONFIG.colors.red}
          strokeWidth={scaleSize(CONFIG.dot.strokeWidth)}
          initial={{ cx: scaleX(dot.cx), cy: scaleY(dot.cy), scale: 0, opacity: 0 }}
          animate={{
            cx: scaleX(dot.cx),
            cy: scaleY(dot.cy),
            scale: 1,
            opacity: 1,
          }}
          transition={{
            cx: { duration: 0.25, ease: "easeOut" },
            cy: { duration: 0.25, ease: "easeOut" },
            scale: { duration: 0.2, ease: "backOut" },
            opacity: { duration: 0.15 },
          }}
        />
      ))}

      {/* Boxplot */}
      <Boxplot
        boxLeft={currentConfig.boxplot.boxLeft}
        boxRight={currentConfig.boxplot.boxRight}
        leftWhisker={currentConfig.boxplot.leftWhisker}
        rightWhiskerEnd={phase === "extendWhisker" || phase === "complete" ? currentWhiskerEnd : currentConfig.boxplot.rightWhisker}
        strokeWidth={CONFIG.dot.strokeWidth}
      />

      {/* iNZight text */}
      <g style={{ opacity: textOpacity }}>
        <INZightText textColor={textColor} />
      </g>

      {/* Analytics text */}
      <g style={{ opacity: analyticsOpacity }}>
        <AnalyticsText textColor={textColor} />
      </g>
    </svg>
  );
}

// ============================================================================
// STATIC LOGO COMPONENT
// ============================================================================

export function StaticLogo({
  width = 400,
  className = "",
  darkBackground = false,
}: {
  width?: number;
  className?: string;
  darkBackground?: boolean;
}) {
  const aspectRatio = CONFIG.height / CONFIG.width;
  const height = width * aspectRatio;
  const textColor = darkBackground ? "#ffffff" : CONFIG.colors.black;

  return (
    <svg
      viewBox={`0 0 ${CONFIG.width} ${CONFIG.height}`}
      width={width}
      height={height}
      className={className}
    >
      {/* Dots */}
      {FINAL_DOT_CONFIG.map((dot) => (
        <circle
          key={dot.id}
          cx={scaleX(dot.cx)}
          cy={scaleY(dot.cy)}
          r={scaleSize(CONFIG.dot.radius)}
          fill="none"
          stroke={CONFIG.colors.red}
          strokeWidth={scaleSize(CONFIG.dot.strokeWidth)}
        />
      ))}

      {/* Boxplot */}
      <Boxplot
        boxLeft={FINAL_BOXPLOT.boxLeft}
        boxRight={FINAL_BOXPLOT.boxRight}
        leftWhisker={FINAL_BOXPLOT.leftWhisker}
        rightWhiskerEnd={CONFIG.boxplot.rightWhiskerFinal}
        strokeWidth={CONFIG.dot.strokeWidth}
      />

      {/* Text */}
      <INZightText textColor={textColor} />
      <AnalyticsText textColor={textColor} />
    </svg>
  );
}
