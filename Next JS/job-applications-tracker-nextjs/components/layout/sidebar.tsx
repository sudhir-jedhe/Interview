"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AccountMenu } from "@/components/layout/account-menu";
import { Logo } from "@/components/layout/logo";
import { NAV_ITEMS, isActivePath } from "@/components/layout/nav-items";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[16.5rem] flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link
          href="/"
          className="rounded-lg transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>
      </div>

      <div className="px-3 pb-4">
        <Button asChild className="w-full justify-start gap-2">
          <Link href="/applications/new">
            <Plus className="size-4" aria-hidden />
            New application
            <kbd className="ml-auto rounded border border-white/25 px-1.5 py-0.5 font-sans text-[0.625rem] font-medium text-white/80">
              N
            </kbd>
          </Link>
        </Button>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-0.5 overflow-y-auto px-3"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              {/* Left rail marks the active route without shifting the label. */}
              <span
                aria-hidden
                className={cn(
                  "absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                aria-hidden
              />
              <span className="flex-1 truncate">{item.label}</span>
              <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-sans text-[0.625rem] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                g {item.shortcut}
              </kbd>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-sidebar-border p-3">
        <AccountMenu />
        <SignOutButton />
        <ThemeToggle className="w-full justify-center" />
        <p className="px-1 text-[0.6875rem] leading-relaxed text-muted-foreground">
          Press{" "}
          <kbd className="rounded border border-border bg-card px-1 py-0.5 font-sans font-medium">
            ⌘K
          </kbd>{" "}
          to search or jump anywhere.
        </p>
      </div>
    </aside>
  );
}
