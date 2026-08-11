"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog";
import { cn } from "@/lib/utils";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /**
   * When set, the confirm button stays disabled until the user types this
   * exact word. Reserved for genuinely irreversible actions.
   */
  confirmPhrase?: string;
  onConfirm: () => Promise<void> | void;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  confirmPhrase,
  onConfirm,
}: ConfirmationDialogProps) {
  const { pending, typed, locked, setTyped, handleConfirm, handleOpenChange } =
    useConfirmationDialog({ onConfirm, onOpenChange, confirmPhrase });

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="rounded-xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {confirmPhrase && (
          <div className="space-y-2">
            <Label htmlFor="confirm-phrase" className="text-xs">
              Type{" "}
              <span className="font-mono font-semibold text-foreground">
                {confirmPhrase}
              </span>{" "}
              to continue
            </Label>
            <Input
              id="confirm-phrase"
              value={typed}
              autoComplete="off"
              onChange={(e) => setTyped(e.target.value)}
              placeholder={confirmPhrase}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending || locked}
            className={cn(
              destructive &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            )}
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
