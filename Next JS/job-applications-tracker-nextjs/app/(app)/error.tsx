"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { isDatabaseConnectionError } from "@/lib/errors";

/**
 * Route-level error boundary. The most likely cause in this app is a missing or
 * unreachable DATABASE_URL, so the copy points there first rather than showing a
 * bare stack trace.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const looksLikeDbIssue = isDatabaseConnectionError(error.message);

  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center">
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
          >
            <AlertTriangle className="size-6" />
          </span>
        </div>

        <h1 className="mt-6 text-xl font-semibold text-foreground">
          {looksLikeDbIssue
            ? "Can't reach the database"
            : "Something went wrong"}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-balance text-muted-foreground">
          {looksLikeDbIssue ? (
            <>
              Check that <code className="rounded bg-muted px-1.5 py-0.5">DATABASE_URL</code>{" "}
              is set in your <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>{" "}
              and that your Neon database is reachable, then run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">npm run db:push</code>.
            </>
          ) : (
            "This section failed to load. Trying again usually clears it."
          )}
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RotateCw className="size-4" aria-hidden />
            Try again
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
