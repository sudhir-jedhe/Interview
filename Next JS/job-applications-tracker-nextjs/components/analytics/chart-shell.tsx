"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Consistent frame for every chart: title, optional hint, legend row, plot. */
export function ChartShell({
  title,
  description,
  legend,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  legend?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-soft sm:p-6",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-[420px]:gap-4">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>

      {legend && <div className="mt-4">{legend}</div>}

      <div className={cn("mt-5 min-w-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

/**
 * Legend for multi-series charts. Identity is carried by a coloured swatch
 * *next to* text in a normal ink colour — never by colouring the label itself.
 */
export function ChartLegend({
  series,
}: {
  series: { label: string; color: string }[];
}) {
  if (series.length < 2) return null;

  return (
    <ul className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
      {series.map((item) => (
        <li
          key={item.label}
          className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-[3px]"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/** Shared tooltip surface, so every chart's hover layer looks identical. */
export function ChartTooltip({
  label,
  rows,
}: {
  label: string;
  rows: { name: string; value: string; color?: string }[];
}) {
  return (
    <div className="min-w-[9rem] rounded-lg border border-border bg-popover px-3 py-2 shadow-lift">
      <p className="mb-1.5 text-xs font-medium text-popover-foreground">{label}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            {row.color && (
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: row.color }}
              />
            )}
            <span className="flex-1">{row.name}</span>
            <span className="tnum font-medium text-foreground">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const AXIS_STYLE = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
} as const;
