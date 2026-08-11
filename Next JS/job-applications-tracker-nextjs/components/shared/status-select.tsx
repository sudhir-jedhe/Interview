"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ApplicationStatus, STATUS_META, STATUS_SELECT_GROUPS } from "@/constants";
import { useStatusSelect } from "@/hooks/use-status-select";
import { cn } from "@/lib/utils";

export function StatusSelect({
  id,
  status,
  className,
  align = "end",
}: {
  id: string;
  status: ApplicationStatus;
  className?: string;
  align?: "start" | "end";
}) {
  const { open, setOpen, pending, status: optimistic, select } = useStatusSelect(
    id,
    status,
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          className={cn("h-auto gap-1.5 px-1.5 py-1", className)}
          aria-label={`Status: ${STATUS_META[optimistic].label}. Change status`}
        >
          <StatusBadge status={optimistic} size="sm" />
          {pending ? (
            <Loader2 className="size-3 animate-spin text-muted-foreground" aria-hidden />
          ) : (
            <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="max-h-[22rem] w-60 overflow-y-auto">
        {STATUS_SELECT_GROUPS.map((group, index) => (
          <div key={group.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-[0.6875rem] text-muted-foreground uppercase">
              {group.label}
            </DropdownMenuLabel>
            {group.statuses.map((option) => (
              <DropdownMenuItem
                key={option}
                onSelect={() => select(option)}
                className="gap-2"
              >
                <Check
                  className={cn(
                    "size-3.5 shrink-0",
                    option === optimistic ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
                <span className="flex-1 truncate">{STATUS_META[option].label}</span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
