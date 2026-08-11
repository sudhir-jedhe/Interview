import { cn } from "@/lib/utils";

/**
 * Wordmark with a small ascending-bars glyph — the tracker's one piece of
 * brand, deliberately geometric rather than illustrative.
 *
 * Renders plain markup only; callers wrap it in a `<Link>` themselves so
 * this can be nested inside links, buttons, or headings without producing
 * invalid nested `<a>` tags.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-xs"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          <path
            d="M5 15.5v3M12 10v8.5M19 5.5v13"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-[0.9375rem] font-semibold text-foreground">
          HireLoop
        </span>
      )}
    </span>
  );
}
