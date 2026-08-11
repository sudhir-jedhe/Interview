import type { NextConfig } from "next";

// Google/GitHub OAuth avatars are served from provider-controlled CDNs we
// can't pin to a fixed hostname, so img-src stays at `https:` rather than an
// explicit allowlist. `unsafe-eval` is dev-only, for React Fast Refresh.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://cloud.umami.is${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data: blob:",
  "media-src 'self' https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self' https://cloud.umami.is https://gateway.umami.is",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Company logos are resolved from Google's public favicon service.
      { protocol: "https", hostname: "www.google.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  // Default bottom-left position covers the sidebar's account/sign-out menu on small screens.
  devIndicators: {
    position: "bottom-right",
  },
  // `postgres` opens raw TCP sockets; keep it out of the bundler.
  serverExternalPackages: ["postgres"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Points agents at the API catalog (RFC 9727) from the entry point,
        // per RFC 8288.
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</.well-known/api-catalog>; rel="api-catalog"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
