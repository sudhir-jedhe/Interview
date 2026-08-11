import type { ApplicationStatus } from "@/constants";
import { TONE_BADGE, TONE_DOT, statusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
  /** Hides the leading dot — useful in dense table cells. */
  showDot?: boolean;
  size?: "sm" | "md";
};

export function StatusBadge({
  status,
  className,
  showDot = true,
  size = "md",
}: StatusBadgeProps) {
  const tone = statusTone(status);

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full font-medium whitespace-nowrap ring-1 ring-inset",
        size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1 text-xs",
        TONE_BADGE[tone],
        className,
      )}
    >
      {showDot && (
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone])}
        />
      )}
      {statusLabel(status)}
    </span>
  );
}
