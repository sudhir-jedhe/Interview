import "server-only";

import { cache } from "react";

import { format, startOfMonth, subMonths } from "date-fns";
import { and, count, desc, eq, gte, inArray, sql } from "drizzle-orm";

import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  EMPLOYMENT_TYPE_LABELS,
  INTERVIEW_STAGE_STATUSES,
  JOB_SOURCE_LABELS,
  OFFER_STATUSES,
  STATUS_META,
  WORK_MODE_LABELS,
} from "@/constants";
import { db } from "@/db";
import { applicationStatusHistory, applications } from "@/db/schema";
import { getCurrentUserId } from "@/lib/session";
import type {
  ActivityEntry,
  DashboardStats,
  DistributionSlice,
  MonthlyPoint,
  SalaryComparisonPoint,
} from "@/types";

/**
 * One round trip for every headline number on the dashboard. Counting in SQL
 * (rather than pulling rows and reducing in JS) keeps this O(1) on payload size
 * as the tracker grows.
 */
async function getDashboardStatsUncached(): Promise<DashboardStats> {
  const userId = await getCurrentUserId();
  const owned = eq(applications.userId, userId);

  const [statusRows, aggregates, currencyRows, reachedRows] = await Promise.all([
    db
      .select({ status: applications.status, value: count() })
      .from(applications)
      .where(owned)
      .groupBy(applications.status),

    db
      .select({
        total: count(),
        avgCurrent: sql<string | null>`avg(${applications.currentSalary})`,
        avgExpected: sql<string | null>`avg(${applications.expectedSalary})`,
        thisWeek: sql<number>`count(*) filter (where ${applications.dateApplied} >= date_trunc('week', now()))`,
        thisMonth: sql<number>`count(*) filter (where ${applications.dateApplied} >= date_trunc('month', now()))`,
      })
      .from(applications)
      .where(owned),

    db
      .select({ currency: applications.currency, value: count() })
      .from(applications)
      .where(owned)
      .groupBy(applications.currency)
      .orderBy(desc(count()))
      .limit(1),

    // An application "reached" a stage if it is there now *or* ever passed
    // through it — history is what makes the funnel honest for rejected rows.
    db
      .select({
        reachedInterview: sql<number>`count(distinct ${applicationStatusHistory.applicationId}) filter (where ${inArray(applicationStatusHistory.newStatus, INTERVIEW_STAGE_STATUSES)})`,
        reachedOffer: sql<number>`count(distinct ${applicationStatusHistory.applicationId}) filter (where ${inArray(applicationStatusHistory.newStatus, OFFER_STATUSES)})`,
      })
      .from(applicationStatusHistory)
      .innerJoin(
        applications,
        eq(applications.id, applicationStatusHistory.applicationId),
      )
      .where(owned),
  ]);

  const byStatus = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s, 0]),
  ) as Record<ApplicationStatus, number>;
  for (const row of statusRows) byStatus[row.status] = row.value;

  const agg = aggregates[0];
  const total = agg?.total ?? 0;

  const reachedInterview = Number(reachedRows[0]?.reachedInterview ?? 0);
  const reachedOffer = Number(reachedRows[0]?.reachedOffer ?? 0);

  const activeCount = APPLICATION_STATUSES.filter(
    (s) => STATUS_META[s].stage < 92,
  ).reduce((sum, s) => sum + byStatus[s], 0);

  return {
    total,
    byStatus,
    avgCurrentSalary: agg?.avgCurrent ? Number(agg.avgCurrent) : null,
    avgExpectedSalary: agg?.avgExpected ? Number(agg.avgExpected) : null,
    thisWeek: Number(agg?.thisWeek ?? 0),
    thisMonth: Number(agg?.thisMonth ?? 0),
    interviewRate: total ? (reachedInterview / total) * 100 : 0,
    offerRate: total ? (reachedOffer / total) * 100 : 0,
    activeCount,
    primaryCurrency: currencyRows[0]?.currency ?? "INR",
  };
}

/** Applications / interviews / offers per month for the trailing `months` window. */
async function getMonthlyTrendUncached(months = 12): Promise<MonthlyPoint[]> {
  const userId = await getCurrentUserId();
  // Truncate to the month boundary in JS, not in SQL. Passing a Date into
  // `date_trunc('month', $1)` leaves the parameter's type ambiguous, and the
  // driver then fails trying to serialise it as text.
  const start = startOfMonth(subMonths(new Date(), months - 1));

  const rows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${applications.dateApplied}), 'YYYY-MM')`,
      applications: count(),
      interviews: sql<number>`count(*) filter (where ${applications.interviewDate} is not null)`,
      offers: sql<number>`count(*) filter (where ${inArray(applications.status, OFFER_STATUSES)})`,
    })
    .from(applications)
    .where(and(eq(applications.userId, userId), gte(applications.dateApplied, start)))
    .groupBy(sql`date_trunc('month', ${applications.dateApplied})`)
    .orderBy(sql`date_trunc('month', ${applications.dateApplied})`);

  const byMonth = new Map(rows.map((r) => [r.month, r]));

  // Emit a point for every month in range so the chart never shows gaps.
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(new Date(), months - 1 - i);
    const key = format(date, "yyyy-MM");
    const row = byMonth.get(key);
    return {
      month: key,
      label: format(date, "MMM"),
      applications: Number(row?.applications ?? 0),
      interviews: Number(row?.interviews ?? 0),
      offers: Number(row?.offers ?? 0),
    };
  });
}

async function getStatusDistributionUncached(): Promise<DistributionSlice[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({ key: applications.status, value: count() })
    .from(applications)
    .where(eq(applications.userId, userId))
    .groupBy(applications.status)
    .orderBy(desc(count()));

  return rows.map((r) => ({
    key: r.key,
    label: STATUS_META[r.key].label,
    value: r.value,
  }));
}

async function getSourceDistributionUncached(): Promise<DistributionSlice[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({ key: applications.jobSource, value: count() })
    .from(applications)
    .where(eq(applications.userId, userId))
    .groupBy(applications.jobSource)
    .orderBy(desc(count()));

  return rows.map((r) => ({
    key: r.key,
    label: JOB_SOURCE_LABELS[r.key],
    value: r.value,
  }));
}

async function getWorkModeDistributionUncached(): Promise<DistributionSlice[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({ key: applications.workMode, value: count() })
    .from(applications)
    .where(eq(applications.userId, userId))
    .groupBy(applications.workMode)
    .orderBy(desc(count()));

  return rows.map((r) => ({
    key: r.key,
    label: WORK_MODE_LABELS[r.key],
    value: r.value,
  }));
}

async function getEmploymentTypeDistributionUncached(): Promise<DistributionSlice[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({ key: applications.employmentType, value: count() })
    .from(applications)
    .where(eq(applications.userId, userId))
    .groupBy(applications.employmentType)
    .orderBy(desc(count()));

  return rows.map((r) => ({
    key: r.key,
    label: EMPLOYMENT_TYPE_LABELS[r.key],
    value: r.value,
  }));
}

/** Top companies by expected salary — the chart only has room for a handful. */
async function getSalaryComparisonUncached(
  limit = 8,
): Promise<SalaryComparisonPoint[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({
      company: applications.companyName,
      current: sql<string | null>`avg(${applications.currentSalary})`,
      expected: sql<string | null>`avg(${applications.expectedSalary})`,
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        sql`${applications.expectedSalary} is not null`,
      ),
    )
    .groupBy(applications.companyName)
    .orderBy(desc(sql`avg(${applications.expectedSalary})`))
    .limit(limit);

  return rows.map((r) => ({
    company: r.company,
    current: r.current ? Number(r.current) : null,
    expected: r.expected ? Number(r.expected) : null,
  }));
}

async function getRecentActivityUncached(limit = 8): Promise<ActivityEntry[]> {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({
      id: applicationStatusHistory.id,
      applicationId: applicationStatusHistory.applicationId,
      oldStatus: applicationStatusHistory.oldStatus,
      newStatus: applicationStatusHistory.newStatus,
      note: applicationStatusHistory.note,
      changedAt: applicationStatusHistory.changedAt,
      companyName: applications.companyName,
      jobTitle: applications.jobTitle,
    })
    .from(applicationStatusHistory)
    .innerJoin(
      applications,
      eq(applications.id, applicationStatusHistory.applicationId),
    )
    .where(eq(applications.userId, userId))
    .orderBy(desc(applicationStatusHistory.changedAt))
    .limit(limit);

  return rows;
}

/** Companies you've applied to most — a signal of where your attention went. */
async function getTopCompaniesUncached(limit = 5) {
  const userId = await getCurrentUserId();
  const rows = await db
    .select({
      company: applications.companyName,
      value: count(),
      favorites: sql<number>`count(*) filter (where ${applications.favorite})`,
    })
    .from(applications)
    .where(eq(applications.userId, userId))
    .groupBy(applications.companyName)
    .orderBy(desc(count()), desc(sql`count(*) filter (where ${applications.favorite})`))
    .limit(limit);

  return rows.map((r) => ({
    company: r.company,
    value: r.value,
    favorites: Number(r.favorites),
  }));
}


/* Per-request memoisation: several dashboard sections read the same
 * aggregate, and React's `cache` collapses those into one round trip. */
export const getDashboardStats = cache(getDashboardStatsUncached);
export const getMonthlyTrend = cache(getMonthlyTrendUncached);
export const getStatusDistribution = cache(getStatusDistributionUncached);
export const getSourceDistribution = cache(getSourceDistributionUncached);
export const getWorkModeDistribution = cache(getWorkModeDistributionUncached);
export const getEmploymentTypeDistribution = cache(getEmploymentTypeDistributionUncached);
export const getSalaryComparison = cache(getSalaryComparisonUncached);
export const getRecentActivity = cache(getRecentActivityUncached);
export const getTopCompanies = cache(getTopCompaniesUncached);
