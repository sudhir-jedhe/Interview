// Requires: zustand
// The same counter, implemented with Zustand — no Provider, no action types, no reducer switch.

import { create } from 'zustand';

export const useCounterStore = create((set, get) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
  decrement: () => set((state) => ({ value: state.value - 1 })),
  reset: () => set({ value: 0 }),
  // get() lets an action read current state without it being passed as an argument
  incrementIfBelow: (max) => {
    if (get().value < max) set((state) => ({ value: state.value + 1 }));
  },
}));

// Component usage — selector-based subscription, only re-renders when `value` changes:
// function CounterDisplay() {
//   const value = useCounterStore((state) => state.value);
//   const increment = useCounterStore((state) => state.increment);
//   return <button onClick={increment}>{value}</button>;
// }

// Non-component usage — Zustand stores work outside React too, unlike Context:
// useCounterStore.getState().increment();
