import { Keyboard } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { DataManagement } from "@/components/settings/data-management";
import { Preferences } from "@/components/settings/preferences";
import { SettingsCard, SettingsRow } from "@/components/settings/settings-card";
import { PageHeader } from "@/components/shared/page-header";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { getApplicationCount } from "@/db/queries/applications";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage currency, monthly goals, columns, and your data.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Settings"
        description="Preferences, keyboard shortcuts and your data."
      />

      <Preferences />

      <SettingsCard
        title="Keyboard shortcuts"
        description="HireLoop is built to be driven from the keyboard."
        icon={Keyboard}
      >
        <SettingsRow label="Command palette" hint="Search and jump anywhere.">
          <Kbd keys={["⌘", "K"]} />
        </SettingsRow>
        <SettingsRow label="New application" hint="From any page.">
          <Kbd keys={["N"]} />
        </SettingsRow>
        {NAV_ITEMS.map((item) => (
          <SettingsRow
            key={item.href}
            label={`Go to ${item.label}`}
            hint={item.description}
          >
            <Kbd keys={["G", item.shortcut.toUpperCase()]} />
          </SettingsRow>
        ))}
      </SettingsCard>

      <Suspense fallback={<CardSkeleton />}>
        <DataSection />
      </Suspense>
    </div>
  );
}

async function DataSection() {
  const total = await getApplicationCount();
  return <DataManagement total={total} />;
}

function Kbd({ keys }: { keys: string[] }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 font-sans text-xs font-medium text-muted-foreground"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}
