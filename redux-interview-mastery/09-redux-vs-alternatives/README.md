# 09 — Redux vs Alternatives

How Redux compares to React Context, Zustand, and atomic state libraries (Recoil/Jotai) — and a criteria-driven framework for deciding when Redux is still the right tool versus when it's overkill.

## Summary

- **Context is dependency injection, not state management.** It transports a value down the tree without prop drilling but has no built-in concept of how that value changes — pairing it with `useReducer` gets you "Redux-lite," but without middleware, DevTools, or selector-based render granularity unless you build those yourself.
- **Zustand trades enforced structure for dramatically less boilerplate.** No `<Provider>`, no action-type convention, hook-based selective subscriptions — a real ergonomic win for small-to-medium teams, at the cost of the "everyone writes state updates the same way" consistency Redux's stricter conventions provide at scale.
- **Recoil/Jotai use a genuinely different model: atoms, not a single tree.** State is a graph of independent, fine-grained units with automatically-tracked dependencies between derived atoms — this shines for UIs with many independent fields (large forms, property inspectors) where manually scoping `useSelector` calls for each field becomes its own maintenance burden.
- **Redux still wins for large teams needing strict conventions, complex async orchestration, time-travel debugging, or a large existing Redux codebase** where migration cost outweighs marginal ergonomic gains elsewhere.
- **Redux is overkill for small apps and, critically, for server-cache data** — data that's fundamentally a local copy of a server response belongs in RTK Query or React Query, not a hand-rolled `pending`/`fulfilled`/`rejected` slice; this is the single most common real-world Redux misuse.
- **"Client state" and "server-cache state" are two separate axes**, each with its own criteria — a well-architected app often answers them independently (e.g., RTK Query for server data + Zustand for client state, in the same app).

## theory/
1. [`01-redux-vs-react-context.md`](theory/01-redux-vs-react-context.md) — Context as transport vs Redux as architecture; what Context+`useReducer` doesn't give you.
2. [`02-redux-vs-zustand.md`](theory/02-redux-vs-zustand.md) — boilerplate comparison, what's traded away without enforced conventions.
3. [`03-recoil-jotai-atomic-model.md`](theory/03-recoil-jotai-atomic-model.md) — single-tree vs atomic state, automatic dependency tracking.
4. [`04-when-redux-still-wins.md`](theory/04-when-redux-still-wins.md) — the criteria for choosing Redux, and for choosing something else instead.

## snippets/
1. [`01-context-plus-usereducer-store.jsx`](snippets/01-context-plus-usereducer-store.jsx) — a minimal Context+useReducer "store."
2. [`02-zustand-store.js`](snippets/02-zustand-store.js) — the same counter store in Zustand.
3. [`03-jotai-atoms.js`](snippets/03-jotai-atoms.js) — base, derived, and write-only Jotai atoms.
4. [`04-rtk-query-vs-handrolled-thunk.js`](snippets/04-rtk-query-vs-handrolled-thunk.js) — hand-rolled fetch slice vs RTK Query, side by side.
5. [`05-context-selector-rerender-trap.jsx`](snippets/05-context-selector-rerender-trap.jsx) — the bundled-context-value re-render trap and its fix.
6. [`06-decision-checklist-function.js`](snippets/06-decision-checklist-function.js) — a runnable state-solution recommender.

## output-based/
1. [`01-context-rerender-count.md`](output-based/01-context-rerender-count.md) — why an unrelated Context consumer re-renders anyway.
2. [`02-zustand-selector-vs-whole-store.md`](output-based/02-zustand-selector-vs-whole-store.md) — calling `useStore()` with no selector opts out of Zustand's render optimization.
3. [`03-jotai-derived-atom-recompute.md`](output-based/03-jotai-derived-atom-recompute.md) — Jotai's automatic dependency tracking in action.
4. [`04-rtk-query-cache-dedup.md`](output-based/04-rtk-query-cache-dedup.md) — two components, one query hook, one network request.
5. [`05-context-value-identity-in-useeffect.md`](output-based/05-context-value-identity-in-useeffect.md) — unmemoized context value breaks a `useEffect` dependency.
6. [`06-zustand-set-merge-behavior.md`](output-based/06-zustand-set-merge-behavior.md) — Zustand's shallow-merge-at-top-level-only `set` behavior.
7. [`07-recoil-atom-family-key-collision.md`](output-based/07-recoil-atom-family-key-collision.md) — Recoil's globally-unique atom key requirement.

## scenarios/
1. [`01-startup-mvp-choosing-a-state-tool.md`](scenarios/01-startup-mvp-choosing-a-state-tool.md) — a 3-person team picking Zustand + RTK Query over reflexive Redux adoption.
2. [`02-scaling-team-outgrows-context.md`](scenarios/02-scaling-team-outgrows-context.md) — a 15-engineer team migrating from ad-hoc Context to Redux Toolkit for enforced conventions.
3. [`03-form-heavy-editor-choosing-atoms.md`](scenarios/03-form-heavy-editor-choosing-atoms.md) — diagnosing a Redux re-render problem before reaching for Jotai.
4. [`04-server-state-masquerading-as-redux-slices.md`](scenarios/04-server-state-masquerading-as-redux-slices.md) — migrating 12 hand-rolled fetch slices to RTK Query.

## interview-qa/
1. [`01-context-vs-redux.md`](interview-qa/01-context-vs-redux.md) — the sharpest framing of Context vs Redux, and when they're combined.
2. [`02-zustand-and-atomic-libraries.md`](interview-qa/02-zustand-and-atomic-libraries.md) — Zustand's missing conventions, Recoil/Jotai's architecture, when atoms win.
3. [`03-choosing-the-right-tool.md`](interview-qa/03-choosing-the-right-tool.md) — answering "would you use Redux today," the client-state vs server-cache distinction.

## problems/
1. [`01-rebuild-slice-with-context-and-usereducer.md`](problems/01-rebuild-slice-with-context-and-usereducer.md) — rebuild a cart slice with Context+useReducer, and list what's lost.
2. [`02-rebuild-same-slice-in-zustand.md`](problems/02-rebuild-same-slice-in-zustand.md) — rebuild the same slice in Zustand, with a full comparison table.
3. [`03-decision-checklist-tool.md`](problems/03-decision-checklist-tool.md) — a runnable, criteria-driven state-solution recommender function.

## assets/
See [`assets/README.md`](assets/README.md).
