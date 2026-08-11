"use client";

import { ChevronUp, Loader2, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APPLICATION_STATUSES, STATUS_META } from "@/constants";
import { useBulkActions } from "@/hooks/use-bulk-actions";
import { pluralize } from "@/lib/format";

/**
 * Floating bar that appears once rows are selected. Anchored to the bottom of
 * the viewport so it stays reachable no matter how far down the table you are.
 */
export function BulkActionsBar({
  selectedIds,
  onClear,
}: {
  selectedIds: string[];
  onClear: () => void;
}) {
  const { pending, confirming, setConfirming, applyStatus, handleDelete } =
    useBulkActions(selectedIds, onClear);
  const count = selectedIds.length;

  return (
    <>
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-3 lg:bottom-8"
          >
            <div
              role="status"
              aria-live="polite"
              className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-border bg-popover px-3 py-2.5 shadow-float"
            >
              <span className="px-1 text-sm font-medium text-foreground">
                {count} {pluralize(count, "row")} selected
              </span>

              <span aria-hidden className="h-5 w-px bg-border" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={pending}>
                    {pending ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    ) : (
                      <ChevronUp className="size-3.5" aria-hidden />
                    )}
                    Change status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  side="top"
                  className="max-h-80 w-56 overflow-y-auto"
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Move {count} {pluralize(count, "application")} to
                  </DropdownMenuLabel>
                  {APPLICATION_STATUSES.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() => applyStatus(status)}
                    >
                      {STATUS_META[status].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() => setConfirming(true)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Delete
              </Button>

              <span aria-hidden className="h-5 w-px bg-border" />

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClear}
                aria-label="Clear selection"
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Delete ${count} ${pluralize(count, "application")}?`}
        description="This removes the selected applications and their status history. This bulk delete cannot be undone."
        confirmLabel={`Delete ${count}`}
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
