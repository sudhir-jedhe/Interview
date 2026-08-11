"use client";

import { useCallback, useEffect, useReducer } from "react";

import { searchApplications } from "@/actions/search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Application } from "@/types";

type Resolved = { term: string; items: Application[] };

type State = {
  open: boolean;
  query: string;
  // Results are stored alongside the term that produced them, which lets the
  // loading state be derived rather than tracked in its own state.
  resolved: Resolved;
};

type Action =
  | { type: "TOGGLE" }
  | { type: "SET_OPEN"; open: boolean }
  | { type: "SET_QUERY"; value: string }
  | { type: "SET_RESULTS"; resolved: Resolved }
  | { type: "CLOSE_AND_CLEAR" };

const initialState: State = {
  open: false,
  query: "",
  resolved: { term: "", items: [] },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, open: !state.open };
    case "SET_OPEN":
      return { ...state, open: action.open };
    case "SET_QUERY":
      return { ...state, query: action.value };
    case "SET_RESULTS":
      return { ...state, resolved: action.resolved };
    case "CLOSE_AND_CLEAR":
      return { ...state, open: false, query: "" };
    default:
      return state;
  }
}

/**
 * ⌘K palette state machine: idle → searching → resolved, with stale-response
 * guarding so an earlier request can't clobber a later one's results.
 */
export function useCommandPalette() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const debounced = useDebouncedValue(state.query, 220);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        dispatch({ type: "TOGGLE" });
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const term = debounced.trim();
  const isSearchable = term.length >= 2;

  useEffect(() => {
    if (!isSearchable) return;

    let cancelled = false;

    searchApplications(term).then((items) => {
      // Guard against an earlier request resolving after a later one.
      if (!cancelled) dispatch({ type: "SET_RESULTS", resolved: { term, items } });
    });

    return () => {
      cancelled = true;
    };
  }, [term, isSearchable]);

  // Both derived: a too-short query simply has no results, and a stale list
  // never flashes while the next one is still in flight.
  const visible =
    isSearchable && state.resolved.term === term ? state.resolved.items : [];
  const searching = isSearchable && state.resolved.term !== term;

  const setOpen = useCallback((open: boolean) => {
    dispatch(open ? { type: "SET_OPEN", open: true } : { type: "CLOSE_AND_CLEAR" });
  }, []);

  const setQuery = useCallback((value: string) => {
    dispatch({ type: "SET_QUERY", value });
  }, []);

  const run = useCallback((action: () => void) => {
    dispatch({ type: "CLOSE_AND_CLEAR" });
    action();
  }, []);

  return {
    open: state.open,
    setOpen,
    query: state.query,
    setQuery,
    term,
    isSearchable,
    visible,
    searching,
    run,
  };
}
