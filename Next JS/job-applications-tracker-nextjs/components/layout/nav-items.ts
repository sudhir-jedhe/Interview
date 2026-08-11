import {
  BarChart3,
  CalendarDays,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  Table2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Single-key shortcut, pressed after `g` (Linear-style "go to"). */
  shortcut: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    shortcut: "d",
    description: "Overview, stats and recent activity",
  },
  {
    href: "/applications",
    label: "Applications",
    icon: Table2,
    shortcut: "a",
    description: "Search, filter and manage every application",
  },
  {
    href: "/board",
    label: "Board",
    icon: KanbanSquare,
    shortcut: "b",
    description: "Drag applications through your pipeline",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    shortcut: "n",
    description: "Trends, distributions and success rates",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarDays,
    shortcut: "c",
    description: "Interview and application dates by month",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    shortcut: "s",
    description: "Theme, currency, import and export",
  },
];

/** The four surfaces that matter on a phone, plus a centre "new" action. */
export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) =>
  ["/dashboard", "/applications", "/board", "/settings"].includes(item.href),
);

export function isActivePath(pathname: string, href: string) {
  // `/applications/new` should still light up the Applications tab.
  return pathname === href || pathname.startsWith(`${href}/`);
}
