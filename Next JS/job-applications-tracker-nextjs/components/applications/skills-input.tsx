"use client";

import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useSkillsInput } from "@/hooks/use-skills-input";
import { cn } from "@/lib/utils";

/**
 * Tag input for skills. Commits on Enter, Tab or comma; Backspace on an empty
 * field removes the last tag, which is the behaviour people expect from chips.
 */
export function SkillsInput({
  value,
  onChange,
  id,
  placeholder = "React, TypeScript, System Design…",
  "aria-describedby": describedBy,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  id?: string;
  placeholder?: string;
  "aria-describedby"?: string;
}) {
  const { draft, setDraft, handleKeyDown, commit, removeSkill } = useSkillsInput(
    value,
    onChange,
  );

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 shadow-xs transition-[color,box-shadow,border-color]",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/18",
      )}
    >
      {value.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 rounded-md bg-muted py-1 pr-1 pl-2 text-xs font-medium text-foreground"
        >
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            aria-label={`Remove ${skill}`}
            className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-3" aria-hidden />
          </button>
        </span>
      ))}

      <Input
        id={id}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => commit(draft)}
        placeholder={value.length ? "Add another…" : placeholder}
        aria-describedby={describedBy}
        className="h-7 min-w-32 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
