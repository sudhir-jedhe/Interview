import { CalendarClock, ArrowRight } from "lucide-react";
import Link from "next/link";

import { formatFriendlyDate } from "@/lib/format";
import { pluralize } from "@/lib/format";
import type { Application } from "@/types";

/**
 * Banner for interviews in the next seven days. The caller passes an already
 * time-bounded list (see `getInterviewsWithinDays`) so this stays a pure
 * render. Nothing urgent means nothing rendered — a permanent "no interviews"
 * bar would just be noise.
 */
export function InterviewReminder({
  applications: soon,
}: {
  applications: Application[];
}) {
  if (!soon.length) return null;

  const next = soon[0];
  // Each application carries at most one interview date, so "more" always
  // means other applications, not additional rounds for `next` — link
  // there instead of into a detail page that has nowhere to show them.
  const href = soon.length === 1 ? `/applications/${next.id}` : "/calendar";

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] px-3 py-3.5 transition-colors hover:bg-primary/10 sm:px-4"
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary"
      >
        <CalendarClock className="size-4.5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {soon.length === 1
            ? "You have an interview coming up"
            : `${soon.length} interviews in the next 7 days`}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground sm:truncate">
          {soon.length > 1 && <>Next: </>}
          {next.jobTitle} at {next.companyName}
          <span className="mx-1.5" aria-hidden>
            ·
          </span>
          {formatFriendlyDate(next.interviewDate)}
          {soon.length > 1 && (
            <>
              <span className="mx-1.5" aria-hidden>
                ·
              </span>
              {soon.length - 1} more {pluralize(soon.length - 1, "interview")}{" "}
              after
            </>
          )}
        </p>
      </div>

      <ArrowRight
        className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
