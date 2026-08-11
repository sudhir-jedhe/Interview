"use client";

import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { exportApplicationsCsv, exportApplicationsJson } from "@/actions/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadFile } from "@/lib/csv";
import type { ApplicationQuery } from "@/types";

/**
 * Exports respect the current filters — what you see is what you download.
 * The serialisation happens on the server so we never ship the full dataset to
 * the client just to write a file.
 */
export function ExportMenu({ filters }: { filters: ApplicationQuery }) {
  const [pending, startTransition] = useTransition();

  function run(format: "csv" | "json") {
    startTransition(async () => {
      const result =
        format === "csv"
          ? await exportApplicationsCsv(filters)
          : await exportApplicationsJson(filters);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const stamp = new Date().toISOString().slice(0, 10);
      downloadFile(
        result.data,
        `hireloop-applications-${stamp}.${format}`,
        format === "csv" ? "text/csv" : "application/json",
      );
      toast.success(`Exported as ${format.toUpperCase()}`);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={pending} className="w-full sm:w-auto">
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Download className="size-4" aria-hidden />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Exports the current filters
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => run("csv")}>
          <FileSpreadsheet className="size-4" aria-hidden />
          Download CSV
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run("json")}>
          <FileJson className="size-4" aria-hidden />
          Download JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
