import { History } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/page-header";
import { formatRelative } from "@/lib/format";
import { TONE_DOT, statusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { ActivityEntry } from "@/types";

export function RecentActivity({ entries }: { entries: ActivityEntry[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <SectionHeader
        title="Recent activity"
        description="Every status change, newest first"
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          size="sm"
          title="Nothing has moved yet"
          description="Status changes across all your applications show up here."
        />
      ) : (
        <ul className="mt-5 space-y-3.5">
          {entries.map((entry) => (
            <li key={entry.id} className="flex min-w-0 gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  TONE_DOT[statusTone(entry.newStatus)],
                )}
              />
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="break-words text-sm leading-snug text-foreground">
                  <Link
                    href={`/applications/${entry.applicationId}`}
                    className="font-medium break-words hover:underline"
                  >
                    {entry.companyName}
                  </Link>{" "}
                  <span className="text-muted-foreground">
                    moved to {statusLabel(entry.newStatus)}
                  </span>
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs leading-snug text-muted-foreground">
                  <span className="min-w-0 max-w-full break-words">
                    {entry.jobTitle}
                  </span>
                  <span aria-hidden>·</span>
                  <span className="shrink-0">
                    {formatRelative(entry.changedAt)}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
