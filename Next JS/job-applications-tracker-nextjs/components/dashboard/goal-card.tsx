"use client";

import { Check, Minus, Plus, Target } from "lucide-react";

import { SectionHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useMonthlyGoal } from "@/hooks/use-preferences";
import { pluralize } from "@/lib/format";

/**
 * Monthly application goal. The target lives in localStorage — it's a personal
 * nudge, not tracked data, so it doesn't belong in the database.
 */
export function GoalCard({ thisMonth }: { thisMonth: number }) {
  const [goal, setGoal, hydrated] = useMonthlyGoal();

  const progress = goal > 0 ? Math.min(100, (thisMonth / goal) * 100) : 0;
  const remaining = Math.max(0, goal - thisMonth);
  const met = thisMonth >= goal;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <SectionHeader
        title="Monthly goal"
        description="Applications sent this calendar month"
        actions={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Lower goal by 5"
              disabled={!hydrated || goal <= 5}
              onClick={() => setGoal((g) => Math.max(5, g - 5))}
            >
              <Minus className="size-3.5" aria-hidden />
            </Button>
            <span className="tnum w-8 text-center text-xs font-medium text-foreground">
              {hydrated ? goal : "—"}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Raise goal by 5"
              disabled={!hydrated || goal >= 200}
              onClick={() => setGoal((g) => Math.min(200, g + 5))}
            >
              <Plus className="size-3.5" aria-hidden />
            </Button>
          </div>
        }
      />

      <div className="mt-6 flex items-end gap-2">
        <span className="tnum text-4xl leading-none font-semibold text-foreground">
          {thisMonth}
        </span>
        <span className="pb-0.5 text-sm text-muted-foreground">
          of {hydrated ? goal : "—"}
        </span>
      </div>

      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={thisMonth}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label="Monthly application goal progress"
      >
        <div
          className="h-full rounded-full bg-[var(--chart-1)] transition-[width] duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        {met ? (
          <>
            <Check className="size-3.5 text-success" aria-hidden />
            Goal reached — nice work.
          </>
        ) : (
          <>
            <Target className="size-3.5" aria-hidden />
            {remaining} more {pluralize(remaining, "application")} to hit your goal.
          </>
        )}
      </p>
    </section>
  );
}
