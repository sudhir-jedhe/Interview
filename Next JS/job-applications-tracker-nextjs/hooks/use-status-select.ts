"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

import { changeStatus } from "@/actions/applications";
import type { ApplicationStatus } from "@/constants";
import { statusLabel } from "@/lib/status";

export function useStatusSelect(id: string, status: ApplicationStatus) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(status);

  function select(next: ApplicationStatus) {
    if (next === optimistic) return;
    startTransition(async () => {
      setOptimistic(next);
      const result = await changeStatus(id, next);
      if (result.success) {
        toast.success(`Moved to ${statusLabel(next)}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return { open, setOpen, pending, status: optimistic, select };
}
