import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SettingsCard({
  title,
  description,
  icon: Icon,
  destructive = false,
  children,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  destructive?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-soft",
        destructive ? "border-destructive/25" : "border-border",
      )}
    >
      <header className="space-y-1.5 border-b border-border px-5 py-4 sm:px-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon
            className={cn(
              "size-4",
              destructive ? "text-destructive" : "text-muted-foreground",
            )}
            aria-hidden
          />
          {title}
        </h2>
        {description && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </header>

      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

export function SettingsRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && (
          <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
        )}
      </div>
      <div className="flex w-full min-w-0 shrink-0 justify-start sm:w-auto sm:justify-end [&>*]:max-w-full">
        {children}
      </div>
    </div>
  );
}
