# Redux vs Recoil/Jotai: Atomic State vs Single-Store State

Recoil and Jotai represent a genuinely different mental model from Redux, not just a lighter-weight API for the same idea — this distinction is worth being precise about in an interview, because conflating them with "Redux but smaller" (which is a fair description of Zustand) is a common mistake.

## Single store vs atoms

Redux holds one object tree in one store; every piece of state lives at some path under that root, and the whole tree is what DevTools serializes and what time-travel replays.

```javascript
// Redux: one tree
const state = { user: {...}, cart: {...}, ui: {...} };
```

Jotai (and Recoil) instead model state as a graph of independent, small units called atoms — each atom is its own piece of state with no inherent parent tree, and components subscribe to exactly the atoms they read.

```javascript
import { atom, useAtom } from 'jotai';

const cartItemsAtom = atom([]);
const cartTotalAtom = atom((get) => get(cartItemsAtom).reduce((sum, i) => sum + i.price, 0)); // derived atom

function CartTotal() {
  const [total] = useAtom(cartTotalAtom); // only re-renders when the DERIVED value changes
  return <span>{total}</span>;
}
```

## Why this matters for re-renders

In Redux, `useSelector` narrows which slice of the single tree a component cares about, but that's an optimization layered on top of "there is one tree." In the atomic model, there's no tree to narrow from in the first place — a component that reads `cartTotalAtom` was never subscribed to anything else, by construction. For UIs with many independent, fine-grained pieces of state (a large form with hundreds of independently-editable fields is the canonical example), atoms can avoid entire categories of "did this unrelated state change cause a re-render" questions that a single-store model has to solve via careful selector design.

## Derived state is a first-class atom, not a spot-computed selector

Jotai's derived/read-only atoms (`atom((get) => ...)`) are conceptually similar to Redux's `reselect`-memoized selectors, but they're part of the core state graph rather than a separate library layered on top — dependencies between atoms are tracked automatically, and only the atoms whose dependencies actually changed recompute.

## What you give up going atomic

- **No single serializable snapshot for time-travel debugging** in the same straightforward way Redux DevTools provides — the state is spread across many independent atoms rather than one tree, though Recoil/Jotai devtools exist and continue to improve.
- **Less architectural enforcement.** There's no equivalent of "all writes go through a reducer that must be pure" — atoms can be written to directly from anywhere, which is more convenient but offers fewer structural guarantees for large teams.
- **A newer, smaller ecosystem** for things like standardized async-flow conventions, middleware, and established patterns that many teams have already solved for in Redux.

## The interview framing

"Redux models application state as one tree with centralized, action-driven mutation; Recoil/Jotai model it as a graph of independent atoms with fine-grained, automatic dependency tracking. The atomic model tends to win for UIs with lots of independent, fine-grained state (complex forms, editors); Redux tends to win when you want one enforced, centrally auditable place all state changes flow through." Both are legitimate, current answers to "manage state without prop drilling" — they optimize for different things.
