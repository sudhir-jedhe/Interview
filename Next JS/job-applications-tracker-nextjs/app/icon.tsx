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
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          borderRadius: 8,
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path
            d="M5 15.5v3M12 10v8.5M19 5.5v13"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    },
  );
}
