import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
}

export default function BrandIcon({ className = "w-10 h-10", size }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id="brandIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D1726" />
          <stop offset="60%" stopColor="#1D2A36" />
          <stop offset="100%" stopColor="#007554" />
        </linearGradient>
        <linearGradient id="brandIconBars" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Squircle Base */}
      <rect width="32" height="32" rx="8" fill="url(#brandIconGrad)" />
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="7.25"
        stroke="#31F2BF"
        strokeOpacity={0.35}
        strokeWidth={1.5}
      />

      {/* Ascending Wealth / Underwriting Foundation Bars */}
      <rect x="6" y="19" width="3.2" height="6" rx="1" fill="url(#brandIconBars)" fillOpacity="0.55" />
      <rect x="11.2" y="14.5" width="3.2" height="10.5" rx="1" fill="url(#brandIconBars)" fillOpacity="0.75" />
      <rect x="16.4" y="10" width="3.2" height="15" rx="1" fill="url(#brandIconBars)" fillOpacity="0.95" />

      {/* Dynamic Trendline */}
      <path
        d="M6.5 17.5 L12 13 L17.5 9.5 L24 5.5"
        stroke="#31F2BF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Apex Arrowhead */}
      <path
        d="M19.5 5.5 L24 5.5 L24 10"
        stroke="#31F2BF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pinnacle Prosperity Dot (Increase Electric Mint) */}
      <circle cx="24" cy="5.5" r="1.5" fill="#31F2BF" />
    </svg>
  );
}

