"use client";

import dynamic from "next/dynamic";

import { CardSkeleton } from "@/components/shared/loading-skeleton";

// recharts is a heavy client-only dependency used solely on this page, so it's
// split into its own chunk instead of shipping with the rest of the analytics
// bundle. `ssr: false` requires a Client Component boundary, which is why this
// wraps the (server) sections in `app/(app)/analytics/page.tsx` rather than
// being called directly from there.
export const LazyApplicationsTrendChart = dynamic(
  () =>
    import("@/components/analytics/applications-trend-chart").then(
      (mod) => mod.ApplicationsTrendChart,
    ),
  { ssr: false, loading: () => <CardSkeleton /> },
);

export const LazySalaryComparisonChart = dynamic(
  () =>
    import("@/components/analytics/salary-comparison-chart").then(
      (mod) => mod.SalaryComparisonChart,
    ),
  { ssr: false, loading: () => <CardSkeleton /> },
);
