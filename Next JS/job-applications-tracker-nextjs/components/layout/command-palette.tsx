"use client";

import {
  Loader2,
  Moon,
  Plus,
  Search,
  Sun,
  Monitor,
  Building2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { CompanyLogo } from "@/components/shared/company-logo";
import { StatusBadge } from "@/components/shared/status-badge";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { formatDate } from "@/lib/format";

/**
 * ⌘K palette. Navigation and actions are always available; typing two or more
 * characters also runs a server-side search across every application.
 */
export function CommandPalette() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { open, setOpen, query, setQuery, term, isSearchable, visible, searching, run } =
    useCommandPalette();

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search applications, jump between pages, or run an action"
      // Results are already ranked by the server; re-scoring client-side would
      // fight the SQL ordering.
      commandProps={{ shouldFilter: false }}
      className="rounded-xl"
    >
      <CommandInput
        placeholder="Search applications or jump to…"
        value={query}
        onValueChange={setQuery}
      />

      <CommandList className="max-h-[24rem]">
        <CommandEmpty>
          {searching ? (
            <span className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Searching…
            </span>
          ) : isSearchable ? (
            <span className="text-sm">No applications match “{term}”.</span>
          ) : (
            <span className="text-sm">Type to search your applications.</span>
          )}
        </CommandEmpty>

        {visible.length > 0 && (
          <>
            <CommandGroup heading="Applications">
              {visible.map((app) => (
                <CommandItem
                  key={app.id}
                  value={app.id}
                  onSelect={() => run(() => router.push(`/applications/${app.id}`))}
                  className="gap-3"
                >
                  <CompanyLogo companyName={app.companyName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{app.jobTitle}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {app.companyName} · {formatDate(app.dateApplied)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} size="sm" showDot={false} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Actions">
          <CommandItem
            value="new-application"
            onSelect={() => run(() => router.push("/applications/new"))}
          >
            <Plus className="size-4" aria-hidden />
            New application
          </CommandItem>
          <CommandItem
            value="browse-applications"
            onSelect={() => run(() => router.push("/applications"))}
          >
            <Search className="size-4" aria-hidden />
            Browse all applications
          </CommandItem>
          <CommandItem
            value="favorites"
            onSelect={() =>
              run(() => router.push("/applications?favorite=true"))
            }
          >
            <Building2 className="size-4" aria-hidden />
            View favorites
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Go to">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                value={`goto-${item.label}`}
                onSelect={() => run(() => router.push(item.href))}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
                <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[0.625rem] text-muted-foreground">
                  g {item.shortcut}
                </kbd>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem value="theme-light" onSelect={() => run(() => setTheme("light"))}>
            <Sun className="size-4" aria-hidden />
            Light
          </CommandItem>
          <CommandItem value="theme-dark" onSelect={() => run(() => setTheme("dark"))}>
            <Moon className="size-4" aria-hidden />
            Dark
          </CommandItem>
          <CommandItem
            value="theme-system"
            onSelect={() => run(() => setTheme("system"))}
          >
            <Monitor className="size-4" aria-hidden />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
