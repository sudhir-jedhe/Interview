"use client";

import dynamic from "next/dynamic";

// Only opened via ⌘K, so cmdk and its Radix dialog ship in their own chunk
// instead of every authenticated page's initial bundle. `ssr: false` requires
// a Client Component boundary, which is why this lives in its own file rather
// than being called directly from the (server) app layout.
export const CommandPalette = dynamic(
  () =>
    import("@/components/layout/command-palette").then(
      (mod) => mod.CommandPalette,
    ),
  { ssr: false },
);
