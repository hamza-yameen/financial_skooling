import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          border: "1.5px solid rgba(186, 200, 161, 0.4)",
          position: "relative",
        }}
      >
        {/* Foundation Bars */}
        <div
          style={{
            position: "absolute",
            left: 6,
            bottom: 6,
            width: 3,
            height: 6,
            backgroundColor: "rgba(255, 255, 255, 0.55)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 11,
            bottom: 6,
            width: 3,
            height: 11,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 6,
            width: 3,
            height: 15,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 1,
          }}
        />

        {/* Dynamic Trendline Arrow */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M6.5 17.5 L12 13 L17.5 9.5 L24 5.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.5 5.5 L24 5.5 L24 10"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="5.5" r="1.5" fill="#EBE2D6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

