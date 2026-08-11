import { Sparkles } from "lucide-react";

import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Reveal } from "@/components/landing/landing-sections";
import { WatchDemoButton } from "@/components/landing/watch-demo-button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Grid and radial wash, masked so they fade out rather than ending
          at a hard edge. */}
      <div
        aria-hidden
        className="grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:px-8 sm:pt-28 sm:pb-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
            <Sparkles className="size-3 text-primary" aria-hidden />
            Personal job application tracker
          </span>

          <h1 className="mt-6 text-4xl leading-[1.08] font-semibold text-balance break-words text-foreground sm:text-6xl">
            Stop guessing where your job search stands.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-balance text-muted-foreground sm:text-lg">
            Stop losing track of where you applied, who you spoke to, and what
            happens next. HireLoop keeps the whole search organised — and shows
            you honestly how it&rsquo;s going.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WatchDemoButton />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Sign in with Google or GitHub — your applications stay yours.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-14 sm:mt-20">
          <DashboardPreview />
        </Reveal>
      </div>
    </section>
  );
}
