import { ArrowRight, BarChart3, Search, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/landing/landing-sections";
import { Button } from "@/components/ui/button";
import { LANDING_FUNNEL, LANDING_VALUE_POINTS } from "@/constants";

const VALUE_POINT_ICONS: Record<string, LucideIcon> = {
  BarChart3,
  Search,
  TrendingUp,
};

export function SplitPromoSection() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 className="text-3xl font-semibold text-balance text-foreground">
            The numbers you can&rsquo;t get from a spreadsheet
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Because every status change is recorded with a timestamp,
            HireLoop can answer questions a flat list never could: how far
            your applications actually travel, which sources convert, and
            what the gap is between what you earn and what you&rsquo;re
            asking for.
          </p>

          <ul className="mt-8 space-y-4">
            {LANDING_VALUE_POINTS.map((item) => {
              const Icon = VALUE_POINT_ICONS[item.icon];
              return (
                <li key={item.text} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    {item.text}
                  </span>
                </li>
              );
            })}
          </ul>

          <Button asChild className="mt-8">
            <Link href="/analytics">
              See the analytics
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="rounded-xl border border-border bg-background p-6 shadow-soft">
            <p className="text-sm font-semibold text-foreground">
              Conversion funnel
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              How far your applications travel
            </p>

            <ol className="mt-6 space-y-4">
              {LANDING_FUNNEL.map((stage, index) => (
                <li key={stage.label} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs text-foreground">{stage.label}</span>
                    <span className="tnum text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {stage.pct}%
                      </span>
                      <span className="ml-1.5">{stage.count}</span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[var(--chart-1)]"
                      style={{
                        width: `${Math.max(1.5, stage.pct)}%`,
                        opacity: 1 - index * 0.18,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
