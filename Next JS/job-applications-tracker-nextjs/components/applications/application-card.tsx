"use client";

import {
  Banknote,
  CalendarDays,
  Copy,
  ExternalLink,
  Link2,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { CompanyLogo } from "@/components/shared/company-logo";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { WORK_MODE_LABELS } from "@/constants";
import {
  useDeleteApplication,
  useDuplicateApplication,
} from "@/hooks/use-application-actions";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatCompactMoney, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

/**
 * Card presentation of an application. Used on the dashboard, in the mobile
 * list (where the table collapses to cards), and on the Kanban board.
 */
export function ApplicationCard({
  application,
  className,
  compact = false,
  showActions = false,
}: {
  application: Application;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative w-full max-w-full min-w-0 rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-foreground/12 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <CompanyLogo
          companyName={application.companyName}
          size={compact ? "sm" : "md"}
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {/* Stretched link keeps the whole card clickable without nesting
                interactive elements inside an anchor. */}
            <Link
              href={`/applications/${application.id}`}
              className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
            >
              {application.jobTitle}
            </Link>
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {application.companyName}
          </p>
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-0.5">
          {application.priority === "high" && (
            <PriorityBadge priority="high" iconOnly />
          )}
          <FavoriteButton
            id={application.id}
            favorite={application.favorite}
            size="sm"
          />
        </div>
      </div>

      <div className="mt-3 grid min-w-0 gap-1.5 text-xs text-muted-foreground min-[420px]:flex min-[420px]:flex-wrap min-[420px]:items-center min-[420px]:gap-x-3">
        <span className="inline-flex min-w-0 max-w-full items-center gap-1">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {formatDate(application.dateApplied)}
          </span>
        </span>

        {application.location && (
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {application.location} · {WORK_MODE_LABELS[application.workMode]}
            </span>
          </span>
        )}

        {application.expectedSalary !== null && (
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <Banknote className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {formatCompactMoney(
                application.expectedSalary,
                application.currency,
              )}
            </span>
          </span>
        )}
      </div>

      <div className="mt-3 flex min-w-0 flex-col items-start gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <StatusBadge
          status={application.status}
          size="sm"
          className="shrink-0"
        />
        {!compact && application.skillsAppliedFor.length > 0 && (
          <p className="w-full min-w-0 truncate text-xs text-muted-foreground min-[420px]:w-auto min-[420px]:flex-1 min-[420px]:text-right">
            {application.skillsAppliedFor.slice(0, 3).join(" · ")}
          </p>
        )}
      </div>

      {showActions && !compact && (
        <ApplicationCardActions application={application} />
      )}
    </article>
  );
}

function ApplicationCardActions({ application }: { application: Application }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const { copy } = useCopyToClipboard();

  const { duplicate } = useDuplicateApplication(application.id, {
    onSuccess: (newId) => {
      toast.success("Application duplicated", {
        action: {
          label: "Open",
          onClick: () => router.push(`/applications/${newId}`),
        },
      });
    },
  });

  const { deleteApp } = useDeleteApplication(application, {
    onUndo: () => router.refresh(),
  });

  function copyLink() {
    copy(
      `${window.location.origin}/applications/${application.id}`,
      "Link copied to clipboard",
    );
  }

  return (
    <>
      <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 min-[420px]:grid-cols-5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/applications/${application.id}/edit`)}
          className="min-w-0"
        >
          <Pencil className="size-4" aria-hidden />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={duplicate}
          className="min-w-0"
        >
          <Copy className="size-4" aria-hidden />
          Duplicate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          className="min-w-0"
        >
          <Link2 className="size-4" aria-hidden />
          Copy
        </Button>
        {application.applicationLink && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                application.applicationLink!,
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="min-w-0"
          >
            <ExternalLink className="size-4" aria-hidden />
            Open
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(true)}
          className="min-w-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden />
          Delete
        </Button>
      </div>

      <ConfirmationDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this application?"
        description={
          <>
            <strong className="text-foreground">{application.jobTitle}</strong>{" "}
            at{" "}
            <strong className="text-foreground">
              {application.companyName}
            </strong>{" "}
            and its status history will be removed. You can undo this right
            after.
          </>
        }
        confirmLabel="Delete"
        destructive
        onConfirm={deleteApp}
      />
    </>
  );
}
