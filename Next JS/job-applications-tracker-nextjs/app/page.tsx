import { Faq } from "@/components/landing/faq";
import { Reveal } from "@/components/landing/landing-sections";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { LandingFooter } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { LandingNavbar } from "@/components/landing/navbar";
import { SplitPromoSection } from "@/components/landing/split-promo-section";
import { StatsSection } from "@/components/landing/stats-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LandingNavbar />

      <main className="flex-1">
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <SplitPromoSection />

        <section id="faq" className="scroll-mt-20">
          <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal className="text-center">
              <h2 className="text-3xl font-semibold text-balance text-foreground sm:text-4xl">
                Questions, answered
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <Faq />
            </Reveal>
          </div>
        </section>

        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
