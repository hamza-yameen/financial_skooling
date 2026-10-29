import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2D3B1E 0%, #5C6E42 50%, #8B9B6D 100%)",
          borderRadius: 40,
          border: "4px solid rgba(186, 200, 161, 0.45)",
          position: "relative",
        }}
      >
        {/* Foundation Bars */}
        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 36,
            width: 18,
            height: 38,
            backgroundColor: "rgba(255, 255, 255, 0.55)",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 36,
            width: 18,
            height: 64,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 92,
            bottom: 36,
            width: 18,
            height: 90,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 4,
          }}
        />

        {/* Dynamic Trendline Arrow */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M38 102 L70 76 L102 56 L138 34"
            stroke="#FFFFFF"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M112 34 L138 34 L138 60"
            stroke="#FFFFFF"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="138" cy="34" r="8" fill="#EBE2D6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

