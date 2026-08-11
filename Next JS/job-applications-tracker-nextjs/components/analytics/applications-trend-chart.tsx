"use client";

import {
  Area,
  AreaChart,
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
import type { MonthlyPoint } from "@/types";

const SERIES = [
  { key: "applications", label: "Applications", color: "var(--chart-1)" },
  { key: "interviews", label: "Interviews", color: "var(--chart-2)" },
  { key: "offers", label: "Offers", color: "var(--chart-3)" },
] as const;

/**
 * Applications per month, with interview and offer counts layered on the same
 * axis. All three are counts, so one y-scale is correct — never a second axis.
 */
export function ApplicationsTrendChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <ChartShell
      title="Applications over time"
      description="Monthly volume across the last 12 months"
      legend={<ChartLegend series={SERIES.map(({ label, color }) => ({ label, color }))} />}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient
                key={s.key}
                id={`fill-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickMargin={10}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            width={44}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <ChartTooltip
                  label={String(label)}
                  rows={SERIES.map((s) => ({
                    name: s.label,
                    color: s.color,
                    value: String(
                      payload.find((p) => p.dataKey === s.key)?.value ?? 0,
                    ),
                  }))}
                />
              );
            }}
          />

          {SERIES.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#fill-${s.key})`}
              // 2px surface ring keeps overlapping markers legible.
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
