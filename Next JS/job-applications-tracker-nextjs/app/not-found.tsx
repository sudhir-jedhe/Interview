import { ArrowLeft, Compass, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden
        className="grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"
      />

      <div className="relative w-full max-w-md text-center">
        <Link
          href="/"
          className="inline-block transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        <div className="mt-10 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="absolute size-28 rounded-full border border-dashed border-border"
            />
            <div aria-hidden className="absolute size-20 rounded-full bg-muted/60" />
            <Compass
              className="relative size-9 text-muted-foreground"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        </div>

        <p className="tnum mt-8 text-sm font-medium text-muted-foreground">404</p>

        <h1 className="mt-2 text-3xl font-semibold text-balance text-foreground">
          This page doesn&rsquo;t exist
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-balance text-muted-foreground">
          The link may be out of date, or the application it pointed to has since
          been deleted.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" aria-hidden />
              Back to dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/applications">
              <Search className="size-4" aria-hidden />
              Browse applications
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
