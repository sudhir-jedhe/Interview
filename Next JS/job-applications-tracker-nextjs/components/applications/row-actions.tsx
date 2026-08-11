"use client";

import {
  Copy,
  ExternalLink,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteApplication,
  useDuplicateApplication,
} from "@/hooks/use-application-actions";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { Application } from "@/types";

export function RowActions({
  application,
  onDeleted,
}: {
  application: Application;
  /** Lets the table drop the row optimistically before the refresh lands. */
  onDeleted?: (id: string) => void;
}) {
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
    onDeleted,
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${application.jobTitle}`}
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onSelect={() => router.push(`/applications/${application.id}/edit`)}
          >
            <Pencil className="size-4" aria-hidden />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={duplicate}>
            <Copy className="size-4" aria-hidden />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={copyLink}>
            <Link2 className="size-4" aria-hidden />
            Copy link
          </DropdownMenuItem>

          {application.applicationLink && (
            <DropdownMenuItem
              onSelect={() =>
                window.open(
                  application.applicationLink!,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <ExternalLink className="size-4" aria-hidden />
              Open job posting
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              setConfirming(true);
            }}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this application?"
        description={
          <>
            <strong className="text-foreground">{application.jobTitle}</strong> at{" "}
            <strong className="text-foreground">{application.companyName}</strong>{" "}
            and its status history will be removed. You can undo this right after.
          </>
        }
        confirmLabel="Delete"
        destructive
        onConfirm={deleteApp}
      />
    </>
  );
}
