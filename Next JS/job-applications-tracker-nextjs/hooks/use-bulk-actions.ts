"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { bulkDelete, bulkUpdateStatus } from "@/actions/applications";
import type { ApplicationStatus } from "@/constants";
import { pluralize } from "@/lib/format";
import { statusLabel } from "@/lib/status";

export function useBulkActions(selectedIds: string[], onClear: () => void) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function applyStatus(status: ApplicationStatus) {
    startTransition(async () => {
      const result = await bulkUpdateStatus(selectedIds, status);
      if (result.success) {
        toast.success(
          result.data === 0
            ? "Those applications were already in that status"
            : `Moved ${result.data} ${pluralize(result.data, "application")} to ${statusLabel(status)}`,
        );
        onClear();
      } else {
        toast.error(result.error);
      }
    });
  }

  async function handleDelete() {
    const result = await bulkDelete(selectedIds);
    if (result.success) {
      toast.success(`Deleted ${result.data} ${pluralize(result.data, "application")}`);
      onClear();
    } else {
      toast.error(result.error);
    }
  }

  return { pending, confirming, setConfirming, applyStatus, handleDelete };
}
