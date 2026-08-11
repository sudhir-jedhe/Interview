"use client";

import { type KeyboardEvent, useState } from "react";

/** Commits on Enter, Tab or comma; Backspace on an empty field removes the
 * last tag, which is the behaviour people expect from chip inputs. */
export function useSkillsInput(value: string[], onChange: (next: string[]) => void) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const skill = raw.trim().replace(/,$/, "");
    if (!skill) return;
    // Case-insensitive dedupe, but keep the casing the user typed first.
    const exists = value.some((v) => v.toLowerCase() === skill.toLowerCase());
    if (!exists) onChange([...value, skill]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
      if (!draft.trim()) return;
      // Tab still moves focus when the field is empty.
      event.preventDefault();
      commit(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  function removeSkill(skill: string) {
    onChange(value.filter((s) => s !== skill));
  }

  return { draft, setDraft, handleKeyDown, commit, removeSkill };
}
