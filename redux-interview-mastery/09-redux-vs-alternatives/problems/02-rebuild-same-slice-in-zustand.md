# Problem 2: Rebuild the Same Cart Slice in Zustand, and Compare

## Task

Using the same cart functionality as Problem 1 (add item, remove item by ID), implement it in Zustand. Then compare: line count, number of concepts a new engineer needs to learn, and re-render behavior, against both the original Redux Toolkit slice and the Context+`useReducer` version from Problem 1.

## Solution

```javascript
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  itemAdded: (item) => set((state) => ({ items: [...state.items, item] })),
  itemRemoved: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
}));

// Usage:
// const items = useCartStore((state) => state.items);           // narrow subscription
// const itemAdded = useCartStore((state) => state.itemAdded);
// itemAdded({ id: 1, name: 'Widget' });
```

## Comparison

| | Redux Toolkit | Context + useReducer | Zustand |
|---|---|---|---|
| Lines of "store" code | ~12 (slice) + store setup elsewhere | ~20 (provider, hook, reducer, action creators) | ~7 |
| Requires a `<Provider>` wrapper | Yes (`<Provider store={store}>`) | Yes (`<CartProvider>`) | No |
| Action-type convention enforced | Yes (`{ type, payload }`) | Self-imposed only | None (plain method calls) |
| Selective re-render subscription | Yes, via `useSelector` | No — whole-context-value granularity, unless split into multiple contexts | Yes, via selector argument to the hook |
| Usable outside React components | Yes (`store.dispatch(...)`) | No (needs a component tree with the Provider) | Yes (`useCartStore.getState().itemAdded(...)`) |
| DevTools support | Built-in, first-class | None without manual wiring | Available via `devtools` middleware, opt-in |

## What this comparison shows

Zustand is the shortest and has no Provider requirement, closing the gap on two of Redux's ergonomic advantages (selective subscriptions, usability outside components) that Context+`useReducer` doesn't have. What it still doesn't replicate is Redux's *enforced* action-type convention — Zustand's `itemAdded`/`itemRemoved` are just object methods; nothing stops a different engineer from writing a third, differently-shaped way to mutate `items` directly via `set({ items: [...] })` inline in a component, bypassing the store's own methods entirely. That's the real, specific trade-off to name: Zustand gets you most of Redux's ergonomic wins with far less code, but the structural enforcement that keeps large teams consistent is something you'd have to add back yourself (via lint rules, code review discipline, or TypeScript restricting direct `set` access) rather than getting it built into the library's core API the way Redux's dispatch-only-plain-actions model provides.
