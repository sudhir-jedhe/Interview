import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-base leading-relaxed shadow-xs transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground/70 hover:border-foreground/15 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/18 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
