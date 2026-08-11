import {
  CalendarDays,
  Command,
  Download,
  KanbanSquare,
  Table2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/landing/landing-sections";
import { LANDING_FEATURES } from "@/constants";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  Table2,
  KanbanSquare,
  TrendingUp,
  CalendarDays,
  Command,
  Download,
};

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-balance text-foreground sm:text-4xl">
            Everything a job search actually needs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-balance text-muted-foreground">
            Not a generic CRUD dashboard. Each surface is built around a
            question you ask yourself during a real search.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <Reveal key={feature.title} delay={(index % 3) * 0.08}>
                <article className="group h-full rounded-xl border border-border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/12 hover:shadow-lift">
                  <span
                    aria-hidden
                    className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
