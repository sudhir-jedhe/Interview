"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { exportApplicationsCsv, exportApplicationsJson } from "@/actions/data";
import { downloadFile } from "@/lib/csv";
import { pluralize } from "@/lib/format";

export function useDataManagement(total: number) {
  const [pending, startTransition] = useTransition();

  function handleExport(format: "csv" | "json") {
    startTransition(async () => {
      const result =
        format === "csv"
          ? await exportApplicationsCsv()
          : await exportApplicationsJson();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const stamp = new Date().toISOString().slice(0, 10);
      downloadFile(
        result.data,
        `hireloop-backup-${stamp}.${format}`,
        format === "csv" ? "text/csv" : "application/json",
      );
      toast.success(`Exported ${total} ${pluralize(total, "application")}`);
    });
  }

  return {
    pending,
    handleExport,
  };
}
