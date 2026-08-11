"use client";

import { Download, FileJson, FileSpreadsheet } from "lucide-react";

import { SettingsCard, SettingsRow } from "@/components/settings/settings-card";
import { Button } from "@/components/ui/button";
import { useDataManagement } from "@/hooks/use-data-management";

export function DataManagement({ total }: { total: number }) {
  const { pending, handleExport } = useDataManagement(total);

  return (
    <SettingsCard
      title="Export"
      description="Download everything you've tracked. Useful as a backup, or to move your data elsewhere."
      icon={Download}
    >
      <SettingsRow
        label="Export as CSV"
        hint="Opens cleanly in Sheets, Excel and Numbers."
      >
        <Button
          variant="outline"
          size="sm"
          disabled={pending || total === 0}
          onClick={() => handleExport("csv")}
          className="w-full sm:w-auto"
        >
          <FileSpreadsheet className="size-4" aria-hidden />
          Download CSV
        </Button>
      </SettingsRow>

      <SettingsRow
        label="Export as JSON"
        hint="Lossless — every field, exactly as stored."
      >
        <Button
          variant="outline"
          size="sm"
          disabled={pending || total === 0}
          onClick={() => handleExport("json")}
          className="w-full sm:w-auto"
        >
          <FileJson className="size-4" aria-hidden />
          Download JSON
        </Button>
      </SettingsRow>
    </SettingsCard>
  );
}
