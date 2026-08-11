import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * One titled block of the application form. The label column sits beside the
 * fields on wide screens and stacks above them on narrow ones.
 */
export function FormSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid min-w-0 gap-5 rounded-xl border border-border bg-card p-4 shadow-soft min-[380px]:p-5 sm:p-6 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8 xl:gap-10",
        className,
      )}
    >
      <div className="space-y-1.5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-muted-foreground" aria-hidden />
          {title}
        </h2>
        {description && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="min-w-0 space-y-5">{children}</div>
    </section>
  );
}

/** Two fields side by side on wide screens, stacked on narrow ones. */
export function FieldRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-5 min-[640px]:grid-cols-2", className)}>{children}</div>
  );
}
