"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { NAV_ITEMS } from "@/components/layout/nav-items";

/** True when focus is somewhere the user is actually typing. */
function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Linear-style shortcuts:
 *   n      → new application
 *   g then d/a/b/n/c/s → jump to a section
 *   ?      → nothing destructive; reserved for the palette hint
 *
 * ⌘K lives in the palette itself so it keeps working while a dialog is open.
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const pendingGoTo = useRef(false);
  const goToTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();

      if (pendingGoTo.current) {
        const match = NAV_ITEMS.find((item) => item.shortcut === key);
        pendingGoTo.current = false;
        if (goToTimer.current) clearTimeout(goToTimer.current);
        if (match) {
          event.preventDefault();
          router.push(match.href);
        }
        return;
      }

      if (key === "g") {
        pendingGoTo.current = true;
        // Abandon a half-typed chord rather than leaving it armed forever.
        goToTimer.current = setTimeout(() => {
          pendingGoTo.current = false;
        }, 1500);
        return;
      }

      if (key === "n") {
        event.preventDefault();
        router.push("/applications/new");
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (goToTimer.current) clearTimeout(goToTimer.current);
    };
  }, [router]);

  return null;
}
