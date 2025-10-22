import React from "react";

import "./style.css";

export default function WeavePattern({
  fillColor = "#e83150",
  gradientStartColor = "#e83150",
  gradientEndColor = "#000000",
  className,
}: {
  fillColor?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  className?: string;
}) {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="-570 0 1920 1080"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={
        {
          "--pattern-fill-color": fillColor,
          "--pattern-gradient-start": gradientStartColor,
          "--pattern-gradient-end": gradientEndColor,
        } as React.CSSProperties
      }
    >
      <defs>
        <linearGradient id="linear-gradient" x1="879.96" y1="-842.77" x2="273.32" y2="867.84" gradientTransform="translate(0 1080) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e83150"/>
          <stop offset=".26" stopColor="#941f33"/>
          <stop offset=".5" stopColor="#51111b"/>
          <stop offset=".66" stopColor="#27080d"/>
          <stop offset=".75" stopColor="#180508"/>
          <stop offset=".85" stopColor="#080102"/>
          <stop offset=".93" stopColor="#000"/>
        </linearGradient>
      </defs>
      <g id="Layer_11" data-name="Layer_1" className="st4">
        <g>
          <rect className="st6" x="-570" y="0" width="1920" height="1080"/>
          <path d="M1348.58,1v1078H-569.42V1h1918M1349.58,0H-570.42v1080h1920V0h0Z"/>
        </g>
      </g>
      <g id="Layer_4">
        <rect className="st2" x="494.85" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="584.82" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="539.83" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="494.85" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="584.82" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="674.79" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="719.78" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="809.75" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="719.78" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="809.75" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="764.76" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="854.74" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="944.71" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="1034.68" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="989.69" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="944.71" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="1034.68" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="1124.65" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="1169.64" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="1259.61" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="1169.64" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="1259.61" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="1214.62" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="1304.59" y="92.27" width="44.99" height="89.97"/>
        <path className="st0" d="M494.85,362.19h44.99v89.97h-44.99v-89.97ZM584.82,362.19h44.99v89.97h-44.99v-89.97ZM629.81,272.22h44.99v89.97h-44.99v-89.97ZM539.83,272.22h44.99v89.97h-44.99v-89.97ZM539.83,452.16h44.99v89.97h-44.99v-89.97ZM449.86,272.22h44.99v89.97h-44.99v-89.97ZM494.85,542.13h44.99v89.97h-44.99v-89.97ZM584.82,542.13h44.99v89.97h-44.99v-89.97ZM674.79,452.16h44.99v89.97h-44.99v-89.97ZM764.76,272.22h44.99v89.97h-44.99v-89.97ZM719.78,362.19h44.99v89.97h-44.99v-89.97ZM809.75,362.19h44.99v89.97h-44.99v-89.97ZM719.78,542.13h44.99v89.97h-44.99v-89.97ZM809.75,542.13h44.99v89.97h-44.99v-89.97ZM764.76,452.16h44.99v89.97h-44.99v-89.97ZM854.74,452.16h44.99v89.97h-44.99v-89.97Z"/>
        <rect className="st2" x="944.71" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="1034.68" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="1079.66" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="989.69" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="989.69" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" x="899.72" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="1124.65" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" x="1214.62" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="1169.64" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="1259.61" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="1169.64" y="542.13" width="44.99" height="89.97"/>
        <rect className="st2" x="1259.61" y="542.13" width="44.99" height="89.97"/>
        <rect className="st2" x="1214.62" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" x="1304.59" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" x="44.99" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="134.96" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="89.98" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="44.99" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="134.96" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="224.93" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="269.92" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="359.89" y="2.3" width="44.99" height="89.97"/>
        <rect className="st2" x="269.92" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="359.89" y="182.24" width="44.99" height="89.97"/>
        <rect className="st2" x="314.91" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="404.88" y="92.27" width="44.99" height="89.97"/>
        <rect className="st2" x="44.99" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="134.96" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="179.95" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="89.98" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="89.98" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="224.93" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" x="314.91" y="272.22" width="44.99" height="89.97"/>
        <rect className="st2" x="269.92" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="359.89" y="362.19" width="44.99" height="89.97"/>
        <rect className="st2" x="269.92" y="542.13" width="44.99" height="89.97"/>
        <rect className="st2" x="314.91" y="632.1" width="44.99" height="89.97"/>
        <rect className="st2" x="359.89" y="542.13" width="44.99" height="89.97"/>
        <rect className="st2" x="314.91" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" x="404.88" y="452.16" width="44.99" height="89.97"/>
        <rect className="st2" x="494.85" y="722.07" width="44.99" height="89.97"/>
        <rect className="st2" x="584.82" y="722.07" width="44.99" height="89.97"/>
        <rect className="st2" x="629.81" y="632.1" width="44.99" height="89.97"/>
        <rect className="st2" x="539.83" y="632.1" width="44.99" height="89.97"/>
        <rect className="st2" x="539.83" y="812.05" width="44.99" height="89.97"/>
        <rect className="st2" x="449.86" y="632.1" width="44.99" height="89.97"/>
        <rect className="st2" x="764.76" y="632.1" width="44.99" height="89.97"/>
        <rect className="st2" x="1214.62" y="632.1" width="44.99" height="89.97"/>
      </g>
    </svg>
  );
}
