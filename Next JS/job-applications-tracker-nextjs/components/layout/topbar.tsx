"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AccountMenu } from "@/components/layout/account-menu";
import { Logo } from "@/components/layout/logo";
import { NAV_ITEMS, isActivePath } from "@/components/layout/nav-items";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = NAV_ITEMS.find((item) => isActivePath(pathname, item.href));

  function openPalette() {
    // Reuse the palette's own listener rather than lifting its state up.
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 min-w-0 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Mobile: drawer nav + wordmark */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-4.5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(18rem,calc(100vw-1.5rem))] p-0">
          <SheetHeader className="h-16 justify-center border-b border-border px-5">
            <SheetTitle asChild>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav aria-label="Main navigation" className="space-y-0.5 p-3">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn("size-4", active && "text-primary")}
                    aria-hidden
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-3 border-t border-border p-3">
            <AccountMenu />
            <SignOutButton />
            <ThemeToggle className="w-full justify-center" />
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/dashboard" className="lg:hidden">
        <Logo showWordmark={false} />
      </Link>

      <h2 className="hidden truncate text-sm font-medium text-foreground lg:block">
        {current?.label ?? "HireLoop"}
      </h2>

      <div className="ml-auto flex min-w-0 items-center gap-2">
        <Button
          variant="outline"
          onClick={openPalette}
          className="h-9 w-9 justify-center px-0 text-muted-foreground sm:w-64 sm:justify-start sm:px-3"
          aria-label="Search applications"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Search…</span>
          <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[0.625rem] font-medium sm:inline">
            ⌘K
          </kbd>
        </Button>
      </div>
    </header>
  );
}
