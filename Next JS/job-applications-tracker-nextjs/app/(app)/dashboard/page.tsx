import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApplicationsTrendChart } from "@/components/analytics/applications-trend-chart";
import { DistributionBars } from "@/components/analytics/distribution-bars";
import { SalaryComparisonChart } from "@/components/analytics/salary-comparison-chart";
import { FavoriteCompanies } from "@/components/dashboard/favorite-companies";
import { GoalCard } from "@/components/dashboard/goal-card";
import { InterviewReminder } from "@/components/dashboard/interview-reminder";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { PageHeader } from "@/components/shared/page-header";
import {
  CardSkeleton,
  ListSkeleton,
  StatGridSkeleton,
} from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  getMonthlyTrend,
  getRecentActivity,
  getSalaryComparison,
  getSourceDistribution,
  getStatusDistribution,
  getTopCompanies,
  getWorkModeDistribution,
} from "@/db/queries/analytics";
import {
  getInterviewsWithinDays,
  getRecentApplications,
  getUpcomingInterviews,
} from "@/db/queries/applications";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your job search at a glance — recent activity, stats, and upcoming interviews.",
  robots: { index: false, follow: false },
};

// Every read hits the database, so this page is dynamic by definition.
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Everything you've sent, at a glance."
        actions={
          <Button asChild>
            <Link href="/applications/new">
              <Plus className="size-4" aria-hidden />
              New application
            </Link>
          </Button>
        }
      />

      {/* Each section streams independently so the page paints as data lands. */}
      <Suspense fallback={null}>
        <ReminderSection />
      </Suspense>

      <Suspense fallback={<StatGridSkeleton count={8} />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <TrendSection />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ListSkeleton />}>
          <RecentSection />
        </Suspense>
        <Suspense fallback={<ListSkeleton />}>
          <InterviewsSection />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ListSkeleton rows={4} />}>
          <ActivitySection />
        </Suspense>
        <Suspense fallback={<ListSkeleton rows={4} />}>
          <GoalSection />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<CardSkeleton />}>
          <StatusDistributionSection />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <SourceDistributionSection />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <WorkModeSection />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<CardSkeleton />}>
          <SalarySection />
        </Suspense>
        <Suspense fallback={<ListSkeleton rows={5} />}>
          <CompaniesSection />
        </Suspense>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections — one async boundary per widget                            */
/* ------------------------------------------------------------------ */

async function ReminderSection() {
  const soon = await getInterviewsWithinDays(7);
  return <InterviewReminder applications={soon} />;
}

async function StatsSection() {
  const stats = await getDashboardStats();
  return <StatsGrid stats={stats} />;
}

async function TrendSection() {
  const trend = await getMonthlyTrend(12);
  return <ApplicationsTrendChart data={trend} />;
}

async function RecentSection() {
  const recent = await getRecentApplications(4);
  return <RecentApplications applications={recent} />;
}

async function InterviewsSection() {
  const upcoming = await getUpcomingInterviews(5);
  return <UpcomingInterviews applications={upcoming} />;
}

async function ActivitySection() {
  const activity = await getRecentActivity(7);
  return <RecentActivity entries={activity} />;
}

async function GoalSection() {
  const stats = await getDashboardStats();
  return <GoalCard thisMonth={stats.thisMonth} />;
}

async function StatusDistributionSection() {
  const data = await getStatusDistribution();
  return (
    <DistributionBars
      title="Status distribution"
      description="Where your applications stand"
      data={data}
      maxRows={8}
      emptyMessage="No applications to break down yet."
    />
  );
}

async function SourceDistributionSection() {
  const data = await getSourceDistribution();
  return (
    <DistributionBars
      title="By source"
      description="Where you found these roles"
      data={data}
      emptyMessage="No sources recorded yet."
    />
  );
}

async function WorkModeSection() {
  const data = await getWorkModeDistribution();
  return (
    <DistributionBars
      title="By work mode"
      description="Remote, hybrid and onsite split"
      data={data}
      emptyMessage="No work modes recorded yet."
    />
  );
}

async function SalarySection() {
  const [data, stats] = await Promise.all([
    getSalaryComparison(7),
    getDashboardStats(),
  ]);
  return (
    <SalaryComparisonChart data={data} currency={stats.primaryCurrency} />
  );
}

async function CompaniesSection() {
  const companies = await getTopCompanies(6);
  return <FavoriteCompanies companies={companies} />;
}
