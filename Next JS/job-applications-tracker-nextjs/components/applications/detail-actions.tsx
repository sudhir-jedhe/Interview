"use client";

import { Copy, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { CopyButton } from "@/components/shared/copy-button";
import { StatusSelect } from "@/components/shared/status-select";
import { Button } from "@/components/ui/button";
import {
  useDeleteApplication,
  useDuplicateApplication,
} from "@/hooks/use-application-actions";
import type { Application } from "@/types";

export function DetailActions({ application }: { application: Application }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const { duplicate } = useDuplicateApplication(application.id, {
    onSuccess: (newId) => {
      toast.success("Application duplicated");
      router.push(`/applications/${newId}`);
    },
  });

  const { deleteApp } = useDeleteApplication(application, {
    onDeleted: () => router.push("/applications"),
    onUndo: (restoredId) => router.push(`/applications/${restoredId}`),
  });

  return (
    <>
      <div className="grid min-w-0 gap-2 min-[360px]:grid-cols-2 min-[640px]:flex min-[640px]:flex-wrap min-[640px]:items-center">
        <StatusSelect
          id={application.id}
          status={application.status}
          className="w-full min-[640px]:w-auto"
        />

        {/* The absolute URL is resolved at click time, so nothing depends on
            `window` during render. */}
        <CopyButton
          path={`/applications/${application.id}`}
          className="w-full min-[640px]:w-auto"
        />

        <Button variant="outline" size="sm" onClick={duplicate} className="w-full min-[640px]:w-auto">
          <Copy className="size-4" aria-hidden />
          Duplicate
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirming(true)}
          className="w-full text-destructive hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive min-[640px]:w-auto"
        >
          <Trash2 className="size-4" aria-hidden />
          Delete
        </Button>

        <Button asChild size="sm" className="w-full min-[640px]:w-auto">
          <Link href={`/applications/${application.id}/edit`}>
            <Pencil className="size-4" aria-hidden />
            Edit
          </Link>
        </Button>
      </div>

      <ConfirmationDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Delete this application?"
        description={
          <>
            <strong className="text-foreground">{application.jobTitle}</strong> at{" "}
            <strong className="text-foreground">{application.companyName}</strong>{" "}
            and its full status history will be removed. You can undo this right
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
