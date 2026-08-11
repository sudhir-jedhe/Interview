import { Code2 } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex transition-opacity hover:opacity-80"
          >
            <Logo />
          </Link>
          <p className="text-xs text-muted-foreground">
            A personal job application tracker. Your data, your database.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/applications"
            className="transition-colors hover:text-foreground"
          >
            Applications
          </Link>
          <Link
            href="/analytics"
            className="transition-colors hover:text-foreground"
          >
            Analytics
          </Link>
          <Link
            href="/settings"
            className="transition-colors hover:text-foreground"
          >
            Settings
          </Link>
          <Link
            href="/calendar"
            className="transition-colors hover:text-foreground"
          >
            Calendar
          </Link>
          <a
            href="https://courses.yogeshchavan.dev/job-application-tracker-source-code"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-primary outline-none transition-colors hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:hidden"
          >
            <Code2 className="size-3.5" aria-hidden />
            Grab the Source Code
          </a>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-5 py-4 text-center text-xs text-muted-foreground sm:px-8">
          Built by{" "}
          <a
            href="https://www.yogeshchavan.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-foreground"
          >
            Yogesh Chavan
          </a>
        </div>
      </div>
    </footer>
  );
}
