"use client";

import { useReducer } from "react";

type State = {
  pending: boolean;
  typed: string;
};

type Action =
  | { type: "SET_TYPED"; value: string }
  | { type: "CONFIRM_START" }
  | { type: "CONFIRM_END" }
  | { type: "RESET" };

const initialState: State = { pending: false, typed: "" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TYPED":
      return { ...state, typed: action.value };
    case "CONFIRM_START":
      return { ...state, pending: true };
    case "CONFIRM_END":
      return { ...state, pending: false };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/**
 * Drives the shared confirmation dialog primitive: a "typed" field gated
 * against an optional confirm phrase, and a "pending" flag kept true while
 * `onConfirm` runs so the dialog stays mounted with a visible spinner.
 */
export function useConfirmationDialog({
  onConfirm,
  onOpenChange,
  confirmPhrase,
}: {
  onConfirm: () => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
  confirmPhrase?: string;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const locked = Boolean(confirmPhrase) && state.typed.trim() !== confirmPhrase;

  function setTyped(value: string) {
    dispatch({ type: "SET_TYPED", value });
  }

  async function handleConfirm(event: React.MouseEvent) {
    // Keep the dialog mounted while the action runs so the spinner is visible.
    event.preventDefault();
    if (locked) return;
    dispatch({ type: "CONFIRM_START" });
    try {
      await onConfirm();
      onOpenChange(false);
      dispatch({ type: "RESET" });
    } finally {
      dispatch({ type: "CONFIRM_END" });
    }
  }

  function handleOpenChange(next: boolean) {
    if (state.pending) return;
    if (!next) dispatch({ type: "RESET" });
    onOpenChange(next);
  }

  return {
    pending: state.pending,
    typed: state.typed,
    locked,
    setTyped,
    handleConfirm,
    handleOpenChange,
  };
}
