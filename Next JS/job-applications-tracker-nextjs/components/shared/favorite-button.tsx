"use client";

import { Star } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { toggleFavorite } from "@/actions/applications";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  id: string;
  favorite: boolean;
  className?: string;
  size?: "sm" | "md";
};

/**
 * Optimistic star. The icon flips instantly and rolls back if the action fails,
 * so rapid toggling down a list never feels laggy.
 */
export function FavoriteButton({
  id,
  favorite,
  className,
  size = "md",
}: FavoriteButtonProps) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(favorite);

  function handleClick(event: React.MouseEvent) {
    // Stars often sit inside a link or a draggable card.
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      setOptimistic(!optimistic);
      const result = await toggleFavorite(id);
      if (!result.success) toast.error(result.error);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={optimistic}
      aria-label={optimistic ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-amber-500 disabled:opacity-60",
        size === "sm" ? "size-7" : "size-8",
        optimistic && "text-amber-500",
        className,
      )}
    >
      <Star
        className={cn(
          "transition-transform duration-150",
          size === "sm" ? "size-3.5" : "size-4",
          optimistic && "scale-110 fill-amber-500",
        )}
        aria-hidden
      />
    </button>
  );
}
