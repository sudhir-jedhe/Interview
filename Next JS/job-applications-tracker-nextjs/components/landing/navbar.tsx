import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-8">
        <Link href="/" className="min-w-0 transition-opacity hover:opacity-80">
          <span className="hidden min-[360px]:block">
            <Logo />
          </span>
          <span className="block min-[360px]:hidden">
            <Logo showWordmark={false} />
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-1 sm:flex">
          <Button asChild variant="ghost" size="sm">
            <a href="#features">Features</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="#faq">FAQ</a>
          </Button>
          <a
            href="https://courses.yogeshchavan.dev/job-application-tracker-source-code"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary outline-none transition-colors hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Code2 className="size-3.5" aria-hidden />
            Grab the Source Code
          </a>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="px-2.5 min-[380px]:px-3">
            <Link href="/dashboard">
              <span className="hidden min-[380px]:inline">Try Demo App</span>
              <span className="min-[380px]:hidden">Demo</span>
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
