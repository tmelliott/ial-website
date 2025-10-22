import React from "react";

import "./style.css";

export default function SignalPattern({
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
      viewBox="-546 0 1920 1080"
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
        <linearGradient id="linear-gradient" x1="904.05" y1="-842.77" x2="297.41" y2="867.84" gradientTransform="translate(0 1080) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e83150"/>
          <stop offset=".26" stopColor="#941f33"/>
          <stop offset=".5" stopColor="#51111b"/>
          <stop offset=".66" stopColor="#27080d"/>
          <stop offset=".75" stopColor="#180508"/>
          <stop offset=".85" stopColor="#080102"/>
          <stop offset=".93" stopColor="#000"/>
        </linearGradient>
      </defs>
      <g id="Layer_11" data-name="Layer_1" className="st7">
        <g>
          <rect className="st8" x="-546" y="0" width="1920" height="1080"/>
          <path d="M1372.67,1v1078H-545.33V1h1918M1373.67,0H-546.33v1080h1920V0h0Z"/>
        </g>
      </g>
      <g id="Layer_5">
        <g id="Page-1">
          <g id="signal">
            <path id="Combined-Shape" className="st0" d="M924.18,1.16h65.52v32.76h-65.52V1.16ZM1077.07,44.85h65.52v32.76h-65.52v-32.76ZM1153.51,1.16h65.52v32.76h-65.52V1.16ZM1229.96,1.16h65.52v32.76h-65.52V1.16ZM1229.96,44.85h65.52v32.76h-65.52v-32.76ZM1153.51,44.85h65.52v32.76h-65.52v-32.76ZM1153.51,132.21h65.52v32.76h-65.52v-32.76ZM1229.96,88.53h65.52v32.76h-65.52v-32.76ZM1306.4,88.53h65.52v32.76h-65.52v-32.76ZM1306.4,1.16h65.52v32.76h-65.52V1.16ZM1077.07,175.89h65.52v32.76h-65.52v-32.76ZM1000.62,88.53h65.52v32.76h-65.52v-32.76ZM924.18,132.21h65.52v32.76h-65.52v-32.76ZM924.18,175.89h65.52v32.76h-65.52v-32.76ZM1000.62,175.89h65.52v32.76h-65.52v-32.76ZM1077.07,219.58h65.52v32.76h-65.52v-32.76ZM1000.62,219.58h65.52v32.76h-65.52v-32.76ZM1153.51,219.58h65.52v32.76h-65.52v-32.76ZM1229.96,175.89h65.52v32.76h-65.52v-32.76ZM1229.96,132.21h65.52v32.76h-65.52v-32.76ZM1306.4,175.89h65.52v32.76h-65.52v-32.76ZM1306.4,219.58h65.52v32.76h-65.52v-32.76ZM1000.62,132.21h65.52v32.76h-65.52v-32.76ZM1077.07,88.53h65.52v32.76h-65.52v-32.76ZM1000.62,44.85h65.52v32.76h-65.52v-32.76ZM924.18,44.85h65.52v32.76h-65.52v-32.76Z"/>
          </g>
        </g>
        <g id="Page-11">
          <g id="signal1">
            <path id="Combined-Shape1" className="st0" d="M462.09,1.16h65.52v32.76h-65.52V1.16h0ZM614.98,44.85h65.52v32.76h-65.52v-32.76ZM691.42,1.16h65.52v32.76h-65.52V1.16ZM767.87,1.16h65.52v32.76h-65.52V1.16ZM767.87,44.85h65.52v32.76h-65.52v-32.76ZM691.42,44.85h65.52v32.76h-65.52v-32.76ZM691.42,132.21h65.52v32.76h-65.52v-32.76ZM767.87,88.53h65.52v32.76h-65.52v-32.76ZM844.31,88.53h65.52v32.76h-65.52v-32.76ZM844.31,1.16h65.52v32.76h-65.52V1.16ZM614.98,175.89h65.52v32.76h-65.52v-32.76ZM538.53,88.53h65.52v32.76h-65.52v-32.76ZM462.09,132.21h65.52v32.76h-65.52v-32.76h0ZM462.09,175.89h65.52v32.76h-65.52v-32.76h0ZM538.53,175.89h65.52v32.76h-65.52v-32.76ZM614.98,219.58h65.52v32.76h-65.52v-32.76ZM538.53,219.58h65.52v32.76h-65.52v-32.76ZM691.42,219.58h65.52v32.76h-65.52v-32.76ZM767.87,175.89h65.52v32.76h-65.52v-32.76ZM767.87,132.21h65.52v32.76h-65.52v-32.76ZM844.31,175.89h65.52v32.76h-65.52v-32.76ZM844.31,219.58h65.52v32.76h-65.52v-32.76ZM538.53,132.21h65.52v32.76h-65.52v-32.76ZM614.98,88.53h65.52v32.76h-65.52v-32.76ZM538.53,44.85h65.52v32.76h-65.52v-32.76ZM462.09,44.85h65.52v32.76h-65.52v-32.76h0Z"/>
          </g>
        </g>
        <g id="Page-12">
          <g id="signal2">
            <path id="Combined-Shape2" className="st0" d="M0,1.16h65.52v32.76H0V1.16ZM152.89,44.85h65.52v32.76h-65.52v-32.76ZM229.33,1.16h65.52v32.76h-65.52V1.16ZM305.78,1.16h65.52v32.76h-65.52V1.16ZM305.78,44.85h65.52v32.76h-65.52v-32.76ZM229.33,44.85h65.52v32.76h-65.52v-32.76ZM229.33,132.21h65.52v32.76h-65.52v-32.76ZM305.78,88.53h65.52v32.76h-65.52v-32.76ZM382.22,88.53h65.52v32.76h-65.52v-32.76ZM382.22,1.16h65.52v32.76h-65.52V1.16ZM152.89,175.89h65.52v32.76h-65.52v-32.76ZM76.44,88.53h65.52v32.76h-65.52v-32.76ZM0,132.21h65.52v32.76H0v-32.76ZM0,175.89h65.52v32.76H0v-32.76ZM76.44,175.89h65.52v32.76h-65.52v-32.76ZM152.89,219.58h65.52v32.76h-65.52v-32.76ZM76.44,219.58h65.52v32.76h-65.52v-32.76ZM229.33,219.58h65.52v32.76h-65.52v-32.76ZM305.78,175.89h65.52v32.76h-65.52v-32.76ZM305.78,132.21h65.52v32.76h-65.52v-32.76ZM382.22,175.89h65.52v32.76h-65.52v-32.76ZM382.22,219.58h65.52v32.76h-65.52v-32.76ZM76.44,132.21h65.52v32.76h-65.52v-32.76ZM152.89,88.53h65.52v32.76h-65.52v-32.76ZM76.44,44.85h65.52v32.76h-65.52v-32.76ZM0,44.85h65.52v32.76H0v-32.76Z"/>
          </g>
        </g>
        <g id="Page-13">
          <g id="signal3">
            <path id="Combined-Shape3" className="st0" d="M924.18,264.83h65.52v32.76h-65.52v-32.76ZM1077.07,308.51h65.52v32.76h-65.52v-32.76ZM1153.51,264.83h65.52v32.76h-65.52v-32.76ZM1229.96,264.83h65.52v32.76h-65.52v-32.76ZM1229.96,308.51h65.52v32.76h-65.52v-32.76ZM1153.51,308.51h65.52v32.76h-65.52v-32.76ZM1153.51,395.87h65.52v32.76h-65.52v-32.76ZM1229.96,352.19h65.52v32.76h-65.52v-32.76ZM1306.4,352.19h65.52v32.76h-65.52v-32.76ZM1306.4,264.83h65.52v32.76h-65.52v-32.76ZM1077.07,439.56h65.52v32.76h-65.52v-32.76ZM1000.62,352.19h65.52v32.76h-65.52v-32.76ZM924.18,395.87h65.52v32.76h-65.52v-32.76ZM924.18,439.56h65.52v32.76h-65.52v-32.76ZM1000.62,439.56h65.52v32.76h-65.52v-32.76ZM1077.07,483.24h65.52v32.76h-65.52v-32.76ZM1000.62,483.24h65.52v32.76h-65.52v-32.76ZM1153.51,483.24h65.52v32.76h-65.52v-32.76ZM1229.96,439.56h65.52v32.76h-65.52v-32.76ZM1229.96,395.87h65.52v32.76h-65.52v-32.76ZM1306.4,439.56h65.52v32.76h-65.52v-32.76ZM1306.4,483.24h65.52v32.76h-65.52v-32.76ZM1000.62,395.87h65.52v32.76h-65.52v-32.76ZM1077.07,352.19h65.52v32.76h-65.52v-32.76ZM1000.62,308.51h65.52v32.76h-65.52v-32.76ZM924.18,308.51h65.52v32.76h-65.52v-32.76Z"/>
          </g>
        </g>
        <g id="Page-14">
          <g id="signal4">
            <path id="Combined-Shape4" className="st0" d="M462.09,264.83h65.52v32.76h-65.52v-32.76h0ZM614.98,308.51h65.52v32.76h-65.52v-32.76ZM691.42,264.83h65.52v32.76h-65.52v-32.76ZM767.87,264.83h65.52v32.76h-65.52v-32.76ZM767.87,308.51h65.52v32.76h-65.52v-32.76ZM691.42,308.51h65.52v32.76h-65.52v-32.76ZM691.42,395.87h65.52v32.76h-65.52v-32.76ZM767.87,352.19h65.52v32.76h-65.52v-32.76ZM844.31,352.19h65.52v32.76h-65.52v-32.76ZM844.31,264.83h65.52v32.76h-65.52v-32.76ZM614.98,439.56h65.52v32.76h-65.52v-32.76ZM538.53,352.19h65.52v32.76h-65.52v-32.76ZM462.09,395.87h65.52v32.76h-65.52v-32.76h0ZM462.09,439.56h65.52v32.76h-65.52v-32.76h0ZM538.53,439.56h65.52v32.76h-65.52v-32.76ZM614.98,483.24h65.52v32.76h-65.52v-32.76ZM538.53,483.24h65.52v32.76h-65.52v-32.76ZM691.42,483.24h65.52v32.76h-65.52v-32.76ZM767.87,439.56h65.52v32.76h-65.52v-32.76ZM767.87,395.87h65.52v32.76h-65.52v-32.76ZM844.31,439.56h65.52v32.76h-65.52v-32.76ZM844.31,483.24h65.52v32.76h-65.52v-32.76ZM538.53,395.87h65.52v32.76h-65.52v-32.76ZM614.98,352.19h65.52v32.76h-65.52v-32.76ZM538.53,308.51h65.52v32.76h-65.52v-32.76ZM462.09,308.51h65.52v32.76h-65.52v-32.76h0Z"/>
          </g>
        </g>
        <rect className="st3" x="924.18" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="1077.07" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="1153.51" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="1229.96" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="1229.96" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="1153.51" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="1153.51" y="657.97" width="65.52" height="32.76"/>
        <rect className="st3" x="1229.96" y="614.29" width="65.52" height="32.76"/>
        <rect className="st3" x="1306.4" y="614.29" width="65.52" height="32.76"/>
        <rect className="st3" x="1306.4" y="657.97" width="65.52" height="32.76"/>
        <rect className="st3" x="1306.4" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="1229.96" y="701.65" width="65.52" height="32.76"/>
        <rect className="st3" x="1229.96" y="657.97" width="65.52" height="32.76"/>
        <rect className="st3" x="1000.62" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="924.18" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="462.09" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="614.98" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="691.42" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="767.87" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="767.87" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="691.42" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="691.42" y="657.97" width="65.52" height="32.76"/>
        <rect className="st3" x="767.87" y="614.29" width="65.52" height="32.76"/>
        <rect className="st3" x="844.31" y="614.29" width="65.52" height="32.76"/>
        <rect className="st3" x="844.31" y="526.92" width="65.52" height="32.76"/>
        <rect className="st3" x="538.53" y="614.29" width="65.52" height="32.76"/>
        <rect className="st3" x="462.09" y="657.97" width="65.52" height="32.76"/>
        <rect className="st3" x="767.87" y="657.97" width="65.52" height="32.76"/>
        <rect className="st3" x="538.53" y="657.97" width="65.52" height="32.76"/>
        <rect className="st3" x="614.98" y="614.29" width="65.52" height="32.76"/>
        <rect className="st3" x="538.53" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" x="462.09" y="570.6" width="65.52" height="32.76"/>
        <rect className="st3" y="264.83" width="65.52" height="32.76"/>
        <rect className="st3" x="152.89" y="308.51" width="65.52" height="32.76"/>
        <rect className="st3" x="229.33" y="264.83" width="65.52" height="32.76"/>
        <rect className="st3" x="305.78" y="264.83" width="65.52" height="32.76"/>
        <rect className="st3" x="305.78" y="308.51" width="65.52" height="32.76"/>
        <rect className="st3" x="229.33" y="308.51" width="65.52" height="32.76"/>
        <rect className="st3" x="229.33" y="395.87" width="65.52" height="32.76"/>
        <rect className="st3" x="305.78" y="352.19" width="65.52" height="32.76"/>
        <rect className="st3" x="382.22" y="352.19" width="65.52" height="32.76"/>
        <rect className="st3" x="382.22" y="264.83" width="65.52" height="32.76"/>
        <rect className="st3" x="76.44" y="352.19" width="65.52" height="32.76"/>
        <rect className="st3" x="305.78" y="439.56" width="65.52" height="32.76"/>
        <rect className="st3" x="305.78" y="395.87" width="65.52" height="32.76"/>
        <rect className="st3" x="382.22" y="439.56" width="65.52" height="32.76"/>
        <rect className="st3" x="382.22" y="483.24" width="65.52" height="32.76"/>
        <rect className="st3" x="152.89" y="352.19" width="65.52" height="32.76"/>
        <rect className="st3" x="76.44" y="308.51" width="65.52" height="32.76"/>
        <rect className="st3" x="0" y="308.51" width="65.52" height="32.76"/>
      </g>
    </svg>
  );
}
