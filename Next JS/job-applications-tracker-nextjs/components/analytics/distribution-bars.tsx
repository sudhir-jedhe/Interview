import { ChartShell } from "@/components/analytics/chart-shell";
import { cn } from "@/lib/utils";
import type { DistributionSlice } from "@/types";

/**
 * Horizontal bar list for nominal breakdowns (status, source, work mode).
 *
 * Deliberately not a donut: these dimensions have up to 17 categories, and a
 * one-hue bar list keeps identity in the *label* (where it belongs) instead of
 * spending 17 colours on it. Every bar carries a direct value label, which also
 * satisfies the contrast-relief rule.
 */
export function DistributionBars({
  title,
  description,
  data,
  total,
  emptyMessage = "No data yet",
  className,
  maxRows,
}: {
  title: string;
  description?: string;
  data: DistributionSlice[];
  total?: number;
  emptyMessage?: string;
  className?: string;
  maxRows?: number;
}) {
  const rows = maxRows ? data.slice(0, maxRows) : data;
  const sum = total ?? data.reduce((acc, d) => acc + d.value, 0);
  // Scale bars against the largest slice so small categories stay visible.
  const peak = Math.max(1, ...rows.map((d) => d.value));
  const hidden = data.length - rows.length;

  return (
    <ChartShell title={title} description={description} className={className}>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((slice) => {
            const share = sum > 0 ? (slice.value / sum) * 100 : 0;
            return (
              <li key={slice.key} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="min-w-0 truncate text-foreground">
                    {slice.label}
                  </span>
                  <span className="tnum shrink-0 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {slice.value}
                    </span>
                    <span className="ml-1.5">{share.toFixed(0)}%</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full bg-[var(--chart-1)] transition-[width] duration-500",
                    )}
                    style={{ width: `${Math.max(2, (slice.value / peak) * 100)}%` }}
                    role="img"
                    aria-label={`${slice.label}: ${slice.value} of ${sum}`}
                  />
                </div>
              </li>
            );
          })}

          {hidden > 0 && (
            <li className="pt-1 text-xs text-muted-foreground">
              +{hidden} more {hidden === 1 ? "category" : "categories"}
            </li>
          )}
        </ul>
      )}
    </ChartShell>
  );
}
