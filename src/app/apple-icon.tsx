import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#070908",
      }}
    >
      <svg width="132" height="132" viewBox="0 0 40 40" fill="none">
        <circle
          cx="20"
          cy="20"
          r="17.5"
          stroke="#e0be7b"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
        <polygon
          points="20,6.5 33.5,20 20,33.5 6.5,20"
          fill="rgba(224, 190, 123, 0.12)"
          stroke="#e0be7b"
          strokeWidth="1.4"
        />
        <polygon
          points="18.43,16.2 21.57,16.2 23.8,18.43 23.8,21.57 21.57,23.8 18.43,23.8 16.2,21.57 16.2,18.43"
          fill="#f5d99e"
        />
      </svg>
    </div>,
    { ...size },
  );
}
