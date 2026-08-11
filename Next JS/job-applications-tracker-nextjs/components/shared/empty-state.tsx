import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md";
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" ? "gap-3 px-6 py-10" : "gap-4 px-6 py-16",
        className,
      )}
    >
      {/* Concentric rings give the icon some presence without an illustration
          asset to ship or theme. */}
      <div className="relative flex items-center justify-center">
        <div
          aria-hidden
          className={cn(
            "absolute rounded-full border border-dashed border-border",
            size === "sm" ? "size-16" : "size-24",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "absolute rounded-full bg-muted/60",
            size === "sm" ? "size-11" : "size-16",
          )}
        />
        <Icon
          className={cn(
            "relative text-muted-foreground",
            size === "sm" ? "size-5" : "size-7",
          )}
          strokeWidth={1.6}
          aria-hidden
        />
      </div>

      <div className="max-w-sm space-y-1.5">
        <h3
          className={cn(
            "font-semibold text-foreground",
            size === "sm" ? "text-sm" : "text-base",
          )}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-balance text-muted-foreground">
          {description}
        </p>
      </div>

      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
