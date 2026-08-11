"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MOBILE_NAV_ITEMS, isActivePath } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

/**
 * Bottom tab bar for phones. The primary action sits in the middle where a
 * thumb naturally rests, with two destinations either side.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [first, second, third, fourth] = MOBILE_NAV_ITEMS;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-center px-1.5 min-[360px]:px-2">
        {[first, second].map((item) => (
          <MobileTab key={item.href} item={item} pathname={pathname} />
        ))}

        <div className="flex justify-center">
          <Link
            href="/applications/new"
            aria-label="New application"
            className="-mt-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lift transition-transform active:scale-95 min-[360px]:size-12"
          >
            <Plus className="size-5" aria-hidden />
          </Link>
        </div>

        {[third, fourth].map((item) => (
          <MobileTab key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}

function MobileTab({
  item,
  pathname,
}: {
  item: (typeof MOBILE_NAV_ITEMS)[number];
  pathname: string;
}) {
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-w-0 flex-col items-center gap-1 rounded-lg px-0.5 py-2.5 text-[0.625rem] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" aria-hidden />
      <span className="max-w-full truncate">{item.label}</span>
    </Link>
  );
}
