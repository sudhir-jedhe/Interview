"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AXIS_STYLE,
  ChartLegend,
  ChartShell,
  ChartTooltip,
} from "@/components/analytics/chart-shell";
import { formatCompactMoney, formatMoney } from "@/lib/format";
import type { SalaryComparisonPoint } from "@/types";

const SERIES = [
  { key: "current", label: "Current", color: "var(--chart-1)" },
  { key: "expected", label: "Expected", color: "var(--chart-2)" },
] as const;

/**
 * Current vs. expected pay by company. Both series are money in the same
 * currency, so they share one axis — the whole point is the gap between them.
 */
export function SalaryComparisonChart({
  data,
  currency,
}: {
  data: SalaryComparisonPoint[];
  currency: string;
}) {
  if (!data.length) {
    return (
      <ChartShell
        title="Salary comparison"
        description="Current vs. expected, by company"
      >
        <p className="py-12 text-center text-sm text-muted-foreground">
          Add expected salaries to your applications to see this comparison.
        </p>
      </ChartShell>
    );
  }

  return (
    <ChartShell
      title="Salary comparison"
      description="Current vs. expected, by company"
      legend={<ChartLegend series={SERIES.map(({ label, color }) => ({ label, color }))} />}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
          barGap={2}
        >
          <CartesianGrid
            horizontal={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickFormatter={(value: number) => formatCompactMoney(value, currency)}
          />
          <YAxis
            type="category"
            dataKey="company"
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            width={78}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <ChartTooltip
                  label={String(label)}
                  rows={SERIES.map((s) => {
                    const value = payload.find((p) => p.dataKey === s.key)?.value;
                    return {
                      name: s.label,
                      color: s.color,
                      value:
                        typeof value === "number"
                          ? formatMoney(value, currency)
                          : "—",
                    };
                  })}
                />
              );
            }}
          />

          {SERIES.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              fill={s.color}
              // Rounded data-end only; the bar stays anchored to the baseline.
              radius={[0, 4, 4, 0]}
              maxBarSize={12}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
