"use client";

import { useEffect, useRef, useState } from "react";

import { useApplicationFilters } from "@/hooks/use-application-filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

/** Keeps a local search input in sync with the `q` URL param, debounced so
 * typing doesn't fire a navigation on every keystroke. */
export function useSearchSync() {
  const { get, setParam, pending } = useApplicationFilters();
  const urlQuery = get("q");

  const [value, setValue] = useState(urlQuery);
  const debounced = useDebouncedValue(value, 320);
  const lastPushed = useRef(urlQuery);

  // Push the debounced value up, but only when it differs from what the URL
  // already holds — otherwise the effect fights the back button.
  useEffect(() => {
    if (debounced === lastPushed.current) return;
    lastPushed.current = debounced;
    setParam("q", debounced || null);
  }, [debounced, setParam]);

  // Adopt external URL changes (back/forward, "clear all") without clobbering
  // what the user is mid-way through typing.
  useEffect(() => {
    if (urlQuery !== lastPushed.current) {
      lastPushed.current = urlQuery;
      setValue(urlQuery);
    }
  }, [urlQuery]);

  return { value, setValue, pending };
}
