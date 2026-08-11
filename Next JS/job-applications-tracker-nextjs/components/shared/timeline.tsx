import { CircleDot } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime, formatRelative } from "@/lib/format";
import { TONE_DOT, statusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { StatusHistoryEntry } from "@/types";

/**
 * Vertical status history. Rendered oldest → newest so it reads like a story
 * of the application rather than a reverse-chronological log.
 */
export function Timeline({ entries }: { entries: StatusHistoryEntry[] }) {
  if (!entries.length) {
    return (
      <EmptyState
        icon={CircleDot}
        size="sm"
        title="No history yet"
        description="Status changes will appear here as this application moves through its pipeline."
      />
    );
  }

  return (
    <ol className="relative space-y-0">
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const tone = statusTone(entry.newStatus);

        return (
          <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connector runs between dots, stopping at the final one. */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-6 bottom-0 left-[0.4375rem] w-px bg-border"
              />
            )}

            <span
              aria-hidden
              className={cn(
                "relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full ring-4 ring-card",
                TONE_DOT[tone],
                isLast && "ring-primary/12",
              )}
            />

            <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={entry.newStatus} size="sm" showDot={false} />
                {entry.oldStatus && (
                  <span className="text-xs text-muted-foreground">
                    from {statusLabel(entry.oldStatus)}
                  </span>
                )}
              </div>

              {entry.note && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {entry.note}
                </p>
              )}

              <p className="text-xs text-muted-foreground/80">
                <time dateTime={new Date(entry.changedAt).toISOString()}>
                  {formatDateTime(entry.changedAt)}
                </time>
                <span className="mx-1.5" aria-hidden>
                  ·
                </span>
                {formatRelative(entry.changedAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
