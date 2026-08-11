import { ChevronDown, ChevronUp, Minus } from "lucide-react";

import { PRIORITY_LABELS, type Priority } from "@/constants";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<Priority, { chip: string; icon: typeof Minus }> = {
  high: {
    chip: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/12 dark:text-red-300 dark:ring-red-400/25",
    icon: ChevronUp,
  },
  medium: {
    chip: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/12 dark:text-amber-300 dark:ring-amber-400/25",
    icon: Minus,
  },
  low: {
    chip: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/12 dark:text-slate-300 dark:ring-slate-400/20",
    icon: ChevronDown,
  },
};

export function PriorityBadge({
  priority,
  className,
  iconOnly = false,
}: {
  priority: Priority;
  className?: string;
  iconOnly?: boolean;
}) {
  const { chip, icon: Icon } = PRIORITY_STYLES[priority];
  const label = `${PRIORITY_LABELS[priority]} priority`;

  return (
    <span
      title={label}
      aria-label={iconOnly ? label : undefined}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full text-xs font-medium ring-1 ring-inset",
        iconOnly ? "size-5 justify-center" : "px-2 py-0.5",
        chip,
        className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {!iconOnly && PRIORITY_LABELS[priority]}
    </span>
  );
}
