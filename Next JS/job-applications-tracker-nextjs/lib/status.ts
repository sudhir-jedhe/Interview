import {
  type ApplicationStatus,
  KANBAN_COLUMNS,
  type KanbanColumnId,
  STATUS_META,
  type StatusTone,
} from "@/constants";

export function statusLabel(status: ApplicationStatus) {
  return STATUS_META[status]?.label ?? status;
}

export function statusTone(status: ApplicationStatus): StatusTone {
  return STATUS_META[status]?.tone ?? "neutral";
}

export function statusColumn(status: ApplicationStatus): KanbanColumnId {
  return STATUS_META[status]?.column ?? "applied";
}

export function columnDefaultStatus(id: KanbanColumnId): ApplicationStatus {
  return (
    KANBAN_COLUMNS.find((c) => c.id === id)?.defaultStatus ?? "applied"
  );
}

/** Tailwind classes per tone — one source of truth for badges and dots. */
export const TONE_BADGE: Record<StatusTone, string> = {
  neutral:
    "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/12 dark:text-slate-300 dark:ring-slate-400/20",
  progress:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/12 dark:text-blue-300 dark:ring-blue-400/25",
  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:ring-emerald-400/25",
  danger:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/12 dark:text-red-300 dark:ring-red-400/25",
  dormant:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/12 dark:text-amber-300 dark:ring-amber-400/25",
};

export const TONE_DOT: Record<StatusTone, string> = {
  neutral: "bg-slate-400",
  progress: "bg-blue-500",
  success: "bg-emerald-500",
  danger: "bg-red-500",
  dormant: "bg-amber-500",
};

export const TONE_HEX: Record<StatusTone, string> = {
  neutral: "#94a3b8",
  progress: "#2563eb",
  success: "#16a34a",
  danger: "#dc2626",
  dormant: "#f59e0b",
};

/** Ordered palette for categorical charts. Deliberately not a rainbow. */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];
