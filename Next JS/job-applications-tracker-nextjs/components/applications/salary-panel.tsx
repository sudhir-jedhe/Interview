import { Banknote, TrendingUp } from "lucide-react";

import { formatMoney } from "@/lib/format";
import type { Application } from "@/types";

export function SalaryPanel({ application }: { application: Application }) {
  const { currentSalary, expectedSalary, currency } = application;

  // Only meaningful when both numbers exist — a raise needs a baseline.
  const delta =
    currentSalary && expectedSalary && currentSalary > 0
      ? ((expectedSalary - currentSalary) / currentSalary) * 100
      : null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Banknote className="size-4 text-muted-foreground" aria-hidden />
        Salary
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Expected
          </p>
          <p className="tnum mt-1 text-xl font-semibold break-words text-foreground sm:text-2xl">
            {formatMoney(expectedSalary, currency)}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Current
            </p>
            <p className="tnum mt-1 text-sm text-foreground">
              {formatMoney(currentSalary, currency)}
            </p>
          </div>

          {delta !== null && (
            <span
              className={
                delta >= 0
                  ? "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 ring-inset dark:bg-emerald-500/12 dark:text-emerald-300 dark:ring-emerald-400/25"
                  : "inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-200 ring-inset dark:bg-red-500/12 dark:text-red-300 dark:ring-red-400/25"
              }
            >
              <TrendingUp className="size-3" aria-hidden />
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
