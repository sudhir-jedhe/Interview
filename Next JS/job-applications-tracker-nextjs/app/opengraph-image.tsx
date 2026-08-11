import { ImageResponse } from "next/og";

import { APP_DESCRIPTION, APP_NAME } from "@/constants";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
              <path
                d="M5 15.5v3M12 10v8.5M19 5.5v13"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#0b0c0f",
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            {APP_NAME}
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 48,
            fontWeight: 700,
            color: "#0b0c0f",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 860,
            marginBottom: 24,
          }}
        >
          <div>Stop guessing</div>
          <div>where your job search stands</div>
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 26,
            color: "#6b7280",
            textAlign: "center",
            maxWidth: 720,
            lineHeight: 1.5,
            marginBottom: 40,
          }}
        >
          {APP_DESCRIPTION}
        </div>

        {/* Call to action */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 36px",
            borderRadius: 999,
            background: "#2563eb",
            color: "#ffffff",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Start tracking for free
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
