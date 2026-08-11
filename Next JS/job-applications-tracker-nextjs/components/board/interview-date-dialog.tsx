"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Blocks a card's move into the Interview column until a date is set — an
 * interview stage without a date doesn't show up on the calendar/reminder
 * banner, so the move isn't committed until one is provided.
 */
export function InterviewDateDialog({
  open,
  companyName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  companyName?: string;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setValue("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      reset();
      onCancel();
    }
  }

  function handleConfirm() {
    if (!value) {
      setError("Interview date is required to move this card to Interview.");
      return;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setError("Enter a valid date and time.");
      return;
    }

    reset();
    onConfirm(date);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Set interview date</DialogTitle>
          <DialogDescription>
            Moving {companyName ?? "this application"} to Interview requires an
            interview date.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="interview-date-prompt">Interview date</Label>
          <Input
            id="interview-date-prompt"
            type="datetime-local"
            value={value}
            autoFocus
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Move to Interview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
