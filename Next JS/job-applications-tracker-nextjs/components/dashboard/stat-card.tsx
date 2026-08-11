import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  /** Makes the whole card a link to a filtered view. */
  href?: string;
  tone?: "default" | "success" | "warning" | "danger" | "primary";
  className?: string;
};

const TONE_ICON: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
  className,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase">
          {label}
        </p>
        {Icon && (
          <span
            aria-hidden
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-lg",
              TONE_ICON[tone],
            )}
          >
            <Icon className="size-3.5" />
          </span>
        )}
      </div>

      <p className="tnum mt-3 text-2xl leading-none font-semibold break-words text-foreground min-[420px]:text-[1.75rem]">
        {value}
      </p>

      {hint && (
        <p className="mt-2 truncate text-xs text-muted-foreground">{hint}</p>
      )}
    </>
  );

  const base = cn(
    "rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-200",
    href && "hover:-translate-y-0.5 hover:border-foreground/12 hover:shadow-lift",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, "block")}>
        {content}
      </Link>
    );
  }

  return <div className={base}>{content}</div>;
}
