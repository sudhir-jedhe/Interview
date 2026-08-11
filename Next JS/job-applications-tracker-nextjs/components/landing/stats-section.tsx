import { Reveal } from "@/components/landing/landing-sections";
import { LANDING_STATS } from "@/constants";

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
        <dl className="grid gap-8 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {LANDING_STATS.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.06}
              className="flex flex-col text-center lg:text-left"
            >
              <dd className="order-1 tnum text-3xl font-semibold text-foreground sm:text-4xl">
                {stat.value}
              </dd>
              <dt className="order-2 mt-2 text-sm font-medium text-foreground">
                {stat.label}
              </dt>
              <dd className="order-3 mt-0.5 text-xs text-muted-foreground">
                {stat.hint}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
