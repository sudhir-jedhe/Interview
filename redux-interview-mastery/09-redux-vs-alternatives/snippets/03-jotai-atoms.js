// Requires: jotai
// Atomic state model: independent atoms with an automatically-tracked derived atom.

import { atom } from 'jotai';

export const cartItemsAtom = atom([]); // primitive/base atom, holds an array

// Derived (read-only) atom — recomputes only when cartItemsAtom actually changes,
// and any component reading ONLY cartTotalAtom never re-renders when unrelated atoms change.
export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Write-only derived atom — a Redux-thunk-like "action" that updates a base atom.
export const addCartItemAtom = atom(null, (get, set, newItem) => {
  set(cartItemsAtom, [...get(cartItemsAtom), newItem]);
});

// Component usage:
// import { useAtom, useAtomValue, useSetAtom } from 'jotai';
// const total = useAtomValue(cartTotalAtom);       // read-only subscription
// const addItem = useSetAtom(addCartItemAtom);      // write-only, no re-render on cartItemsAtom changes
// addItem({ id: 'sku1', price: 9.99, quantity: 1 });
