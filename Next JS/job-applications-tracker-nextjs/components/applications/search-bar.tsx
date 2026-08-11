"use client";

import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useSearchSync } from "@/hooks/use-search-sync";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const { value, setValue, pending } = useSearchSync();

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search company, title, skills, notes…"
        aria-label="Search applications"
        className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {pending ? (
        <Loader2
          className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-hidden
        />
      ) : (
        value && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        )
      )}
    </div>
  );
}
