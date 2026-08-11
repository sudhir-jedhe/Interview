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
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 148,
            height: 148,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 32,
            background: "#2563eb",
            boxShadow: "0 0 40px rgba(37, 99, 235, 0.35)",
          }}
        >
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none">
            <path
              d="M5 15.5v3M12 10v8.5M19 5.5v13"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
