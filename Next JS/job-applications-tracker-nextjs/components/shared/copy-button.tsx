"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  /** Literal text to copy. Mutually exclusive with `path`. */
  value?: string;
  /**
   * App-relative path (e.g. `/applications/abc`). Resolved against the current
   * origin at click time, so nothing reads `window` during render.
   */
  path?: string;
  label?: string;
  successMessage?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
};

export function CopyButton({
  value,
  path,
  label = "Copy link",
  successMessage = "Link copied to clipboard",
  variant = "outline",
  size = "sm",
  className,
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  function handleCopy() {
    const text = path ? `${window.location.origin}${path}` : (value ?? "");
    copy(text, successMessage);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(className)}
    >
      {copied ? (
        <Check className="size-4 text-success" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      {label}
    </Button>
  );
}
