"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  deleteApplication,
  duplicateApplication,
  restoreApplication,
} from "@/actions/applications";
import type { Application } from "@/types";

/** Duplicates an application. The row list and detail page differ only in
 * what happens after success (toast-with-action vs. immediate redirect). */
export function useDuplicateApplication(
  id: string,
  { onSuccess }: { onSuccess: (newId: string) => void },
) {
  const [, startTransition] = useTransition();

  function duplicate() {
    startTransition(async () => {
      const result = await duplicateApplication(id);
      if (result.success) {
        onSuccess(result.data.id);
      } else {
        toast.error(result.error);
      }
    });
  }

  return { duplicate };
}

/** Deletes an application with an "Undo" toast that restores it. `onDeleted`
 * runs right after the delete succeeds (drop the row, or navigate away);
 * `onUndo` runs after a successful restore. */
export function useDeleteApplication(
  application: Application,
  {
    onDeleted,
    onUndo,
  }: {
    onDeleted?: (id: string) => void;
    onUndo?: (restoredId: string) => void;
  } = {},
) {
  async function deleteApp() {
    // Snapshot before deleting so "Undo" can put the row back with its id.
    const snapshot = { ...application };
    const result = await deleteApplication(application.id);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    onDeleted?.(application.id);

    toast.success(`Deleted ${application.jobTitle}`, {
      action: {
        label: "Undo",
        onClick: async () => {
          const restored = await restoreApplication(snapshot);
          if (restored.success) {
            toast.success("Application restored");
            onUndo?.(restored.data.id);
          } else {
            toast.error(restored.error);
          }
        },
      },
      duration: 8000,
    });
  }

  return { deleteApp };
}
