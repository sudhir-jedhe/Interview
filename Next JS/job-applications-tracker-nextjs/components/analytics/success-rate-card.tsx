import { ChartShell } from "@/components/analytics/chart-shell";
import { formatPercent } from "@/lib/format";
import type { DashboardStats } from "@/types";

/**
 * Pipeline funnel. Each stage is a share of *all* applications, so the bars
 * read as a genuine narrowing rather than three unrelated percentages.
 */
export function SuccessRateCard({ stats }: { stats: DashboardStats }) {
  const offersAccepted = stats.byStatus.offer_accepted;
  const acceptRate = stats.total ? (offersAccepted / stats.total) * 100 : 0;

  const stages = [
    { label: "Applied", value: 100, count: stats.total },
    {
      label: "Reached an interview",
      value: stats.interviewRate,
      count: Math.round((stats.interviewRate / 100) * stats.total),
    },
    {
      label: "Received an offer",
      value: stats.offerRate,
      count: Math.round((stats.offerRate / 100) * stats.total),
    },
    { label: "Accepted an offer", value: acceptRate, count: offersAccepted },
  ];

  return (
    <ChartShell
      title="Conversion funnel"
      description="How far your applications travel"
    >
      <ol className="space-y-4">
        {stages.map((stage, index) => (
          <li key={stage.label} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs text-foreground">{stage.label}</span>
              <span className="tnum text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {formatPercent(stage.value, stage.value % 1 === 0 ? 0 : 1)}
                </span>
                <span className="ml-1.5">
                  {stage.count} {stage.count === 1 ? "application" : "applications"}
                </span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{
                  // A single hue stepped light→dark: this is ordinal data
                  // (funnel position), not four separate identities.
                  width: `${Math.max(1.5, stage.value)}%`,
                  backgroundColor: "var(--chart-1)",
                  opacity: 1 - index * 0.18,
                }}
              />
            </div>
          </li>
        ))}
      </ol>
    </ChartShell>
  );
}
