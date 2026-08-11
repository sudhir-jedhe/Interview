"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

/** Copies text to the clipboard and flips a "copied" flag for a beat. */
export function useCopyToClipboard(resetDelay = 1800) {
  const [copied, setCopied] = useState(false);

  // Reset the checkmark after a beat, and clean up if the caller unmounts first.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), resetDelay);
    return () => clearTimeout(timer);
  }, [copied, resetDelay]);

  async function copy(text: string, successMessage = "Copied to clipboard") {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
    } catch {
      toast.error("Your browser blocked clipboard access");
    }
  }

  return { copied, copy };
}
