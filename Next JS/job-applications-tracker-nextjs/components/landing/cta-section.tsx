import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/landing/landing-sections";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <Reveal className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-lift sm:px-12">
          <div
            aria-hidden
            className="grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
          />

          <div className="relative">
            <h2 className="text-3xl font-semibold text-balance text-foreground sm:text-4xl">
              Start tracking properly
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-balance text-muted-foreground">
              Your dashboard is already there. Add your first application
              and the rest of the app fills itself in.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/applications/new">
                  Add your first application
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/dashboard">Open the dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
