import type { Metadata } from "next";
import { Suspense } from "react";

import { DistributionBars } from "@/components/analytics/distribution-bars";
import {
  LazyApplicationsTrendChart,
  LazySalaryComparisonChart,
} from "@/components/analytics/lazy-charts";
import { SuccessRateCard } from "@/components/analytics/success-rate-card";
import { DashboardStatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import {
  CardSkeleton,
  StatGridSkeleton,
} from "@/components/shared/loading-skeleton";
import {
  getDashboardStats,
  getEmploymentTypeDistribution,
  getMonthlyTrend,
  getSalaryComparison,
  getSourceDistribution,
  getStatusDistribution,
  getWorkModeDistribution,
} from "@/db/queries/analytics";
import { formatCompactMoney, formatNumber, formatPercent } from "@/lib/format";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Conversion funnel, trends, and source breakdowns for your job applications.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="How your search is actually going — trends, conversion and where your applications come from."
      />

      <Suspense fallback={<StatGridSkeleton count={4} />}>
        <HeadlineStats />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <TrendSection />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<CardSkeleton />}>
          <FunnelSection />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <SalarySection />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <StatusSection />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <SourceSection />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <WorkModeSection />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <EmploymentSection />
        </Suspense>
      </div>
    </div>
  );
}

async function HeadlineStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        label="Total applications"
        value={formatNumber(stats.total)}
        hint={`${stats.activeCount} still active`}
        tone="primary"
      />
      <DashboardStatCard
        label="Interview rate"
        value={formatPercent(stats.interviewRate, 1)}
        hint="Reached an interview stage"
        tone="success"
      />
      <DashboardStatCard
        label="Offer rate"
        value={formatPercent(stats.offerRate, 1)}
        hint="Converted to an offer"
        tone="success"
      />
      <DashboardStatCard
        label="Avg. expected salary"
        value={formatCompactMoney(
          stats.avgExpectedSalary,
          stats.primaryCurrency,
        )}
        hint={`Across ${stats.total} applications`}
      />
    </div>
  );
}

async function TrendSection() {
  const trend = await getMonthlyTrend(12);
  return <LazyApplicationsTrendChart data={trend} />;
}

async function FunnelSection() {
  const stats = await getDashboardStats();
  return <SuccessRateCard stats={stats} />;
}

async function SalarySection() {
  const [data, stats] = await Promise.all([
    getSalaryComparison(8),
    getDashboardStats(),
  ]);
  return (
    <LazySalaryComparisonChart data={data} currency={stats.primaryCurrency} />
  );
}

async function StatusSection() {
  const data = await getStatusDistribution();
  return (
    <DistributionBars
      title="Status"
      description="Where applications stand"
      data={data}
      maxRows={10}
    />
  );
}

async function SourceSection() {
  const data = await getSourceDistribution();
  return (
    <DistributionBars
      title="Source"
      description="Where you found roles"
      data={data}
    />
  );
}

async function WorkModeSection() {
  const data = await getWorkModeDistribution();
  return (
    <DistributionBars
      title="Work mode"
      description="Remote, hybrid, onsite"
      data={data}
    />
  );
}

async function EmploymentSection() {
  const data = await getEmploymentTypeDistribution();
  return (
    <DistributionBars
      title="Employment type"
      description="How roles are structured"
      data={data}
    />
  );
}
