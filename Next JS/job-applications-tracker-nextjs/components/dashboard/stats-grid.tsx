import {
  Award,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarRange,
  CheckCircle2,
  Ghost,
  Handshake,
  MessagesSquare,
  Send,
  Target,
  Trophy,
  TerminalSquare,
  TrendingUp,
  Undo2,
  Wallet,
  XCircle,
} from "lucide-react";

import { DashboardStatCard } from "@/components/dashboard/stat-card";
import { formatCompactMoney, formatNumber, formatPercent } from "@/lib/format";
import type { DashboardStats } from "@/types";

/**
 * The full stat wall. Ordered so the numbers you check daily (totals, this
 * week, upcoming stages) come before the retrospective ones (rates, averages).
 */
export function StatsGrid({ stats }: { stats: DashboardStats }) {
  const s = stats.byStatus;
  const currency = stats.primaryCurrency;

  const cards = [
    {
      label: "Total",
      value: formatNumber(stats.total),
      hint: `${stats.activeCount} still active`,
      icon: BriefcaseBusiness,
      tone: "primary" as const,
      href: "/applications",
    },
    {
      label: "Applied",
      value: formatNumber(s.applied),
      hint: "Awaiting a first response",
      icon: Send,
      href: "/applications?status=applied",
    },
    {
      label: "This week",
      value: formatNumber(stats.thisWeek),
      hint: "Sent since Monday",
      icon: CalendarCheck,
      tone: "success" as const,
    },
    {
      label: "This month",
      value: formatNumber(stats.thisMonth),
      hint: "Sent this calendar month",
      icon: CalendarRange,
    },
    {
      label: "Interview scheduled",
      value: formatNumber(s.interview_scheduled),
      hint: "On the calendar",
      icon: MessagesSquare,
      tone: "primary" as const,
      href: "/applications?status=interview_scheduled",
    },
    {
      label: "Technical",
      value: formatNumber(s.technical_interview),
      hint: "In a technical round",
      icon: TerminalSquare,
      href: "/applications?status=technical_interview",
    },
    {
      label: "HR interview",
      value: formatNumber(s.hr_interview),
      hint: "Culture and comp stage",
      icon: Handshake,
      href: "/applications?status=hr_interview",
    },
    {
      label: "Offers received",
      value: formatNumber(s.offer_received),
      hint: "Awaiting your decision",
      icon: Award,
      tone: "success" as const,
      href: "/applications?status=offer_received",
    },
    {
      label: "Offers accepted",
      value: formatNumber(s.offer_accepted),
      hint: "Signed and done",
      icon: CheckCircle2,
      tone: "success" as const,
      href: "/applications?status=offer_accepted",
    },
    {
      label: "Rejected",
      value: formatNumber(s.rejected),
      hint: "Closed by the company",
      icon: XCircle,
      tone: "danger" as const,
      href: "/applications?status=rejected",
    },
    {
      label: "Ghosted",
      value: formatNumber(s.ghosted),
      hint: "No reply, ever",
      icon: Ghost,
      tone: "warning" as const,
      href: "/applications?status=ghosted",
    },
    {
      label: "Withdrawn",
      value: formatNumber(s.withdrawn),
      hint: "Closed by you",
      icon: Undo2,
      href: "/applications?status=withdrawn",
    },
    {
      label: "Avg. current salary",
      value: formatCompactMoney(stats.avgCurrentSalary, currency),
      hint: "Across all applications",
      icon: Wallet,
    },
    {
      label: "Avg. expected salary",
      value: formatCompactMoney(stats.avgExpectedSalary, currency),
      hint: expectedDeltaHint(stats),
      icon: TrendingUp,
      tone: "primary" as const,
    },
    {
      label: "Interview rate",
      value: formatPercent(stats.interviewRate, 1),
      hint: "Reached an interview stage",
      icon: Target,
      tone: "success" as const,
    },
    {
      label: "Offer rate",
      value: formatPercent(stats.offerRate, 1),
      hint: "Converted to an offer",
      icon: Trophy,
      tone: stats.offerRate > 0 ? ("success" as const) : ("default" as const),
    },
  ];

  return (
    <div className="grid gap-3 min-[420px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

/** Expresses expected pay as a raise over current, which is the number people
 *  actually care about when comparing the two averages. */
function expectedDeltaHint(stats: DashboardStats) {
  const { avgCurrentSalary: current, avgExpectedSalary: expected } = stats;
  if (!current || !expected || current <= 0) return "Across all applications";
  const delta = ((expected - current) / current) * 100;
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(0)}% vs. current`;
}
