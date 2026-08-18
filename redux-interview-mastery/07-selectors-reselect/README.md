# 07 — Selectors and Reselect

Selectors are the standard way to read derived data out of Redux state, decoupling components from the store's exact shape. This topic covers plain selectors, memoization with `reselect`'s `createSelector` (bundled in `@reduxjs/toolkit`), composing selectors from smaller ones, and the specific memoization pitfall that shows up with parameterized selectors shared across multiple component instances.

## Key points

- **Selectors decouple components from state shape** — a named `(state) => derivedValue` function means internal state shape can change without touching every component that reads it, and selectors are trivially unit-testable without a store or rendered components.
- **`createSelector` memoizes by reference equality of inputs** — it caches the last call's inputs and result (cache size 1 by default); if every input selector's output is `===` to last time, it skips the result function and returns the cached result, preserving referential equality of the output — which is exactly what `useSelector`'s default `===` comparison needs to avoid unnecessary re-renders.
- **Composition** — a `createSelector` output is itself a valid input selector to another `createSelector`, letting you build a pipeline of small, independently testable/reusable selectors instead of one large tangled derivation.
- **The parameterized-selector pitfall** — a single shared memoized selector instance, called with different arguments (e.g., different ids) by different component instances, thrashes its size-1 cache and never actually hits — the fix is a selector **factory**, instantiated once per component instance (typically via `useMemo`).

## Index

### theory/
- `01-why-selectors.md` — decoupling from state shape, encapsulating derived data, testability, co-location convention.
- `02-createSelector-memoization.md` — the memoization algorithm and why output reference stability matters for React.
- `03-selector-composition.md` — building layered selector pipelines and why composition beats one large selector.
- `04-parameterized-selectors-and-pitfall.md` — parameterized selectors, the shared-instance bug, and the factory fix.
- `05-selector-best-practices.md` — when to memoize, never sort/mutate in place, trivial input selectors, testing.

### snippets/
- `01-basic-selector.js` — plain, non-memoized selectors.
- `02-createSelector-basic.js` — basic memoization with cache-hit/miss demonstration.
- `03-composed-selectors.js` — a three-layer composed selector pipeline.
- `04-parameterized-selector-factory.js` — the selector factory pattern with independent caches.
- `05-useSelector-with-selector.jsx` — consuming a memoized selector via `useSelector`.
- `06-selector-with-props-anti-pattern.js` — the shared-instance bug reproduced with logging to show cache thrashing.
- `07-reselect-createSelector-options.js` — `createSelectorCreator`, shallow-equality inputs, and larger cache sizes.

### output-based/
- `01-memoization-cache-size-one.md` — cache hits/misses across calls with varying object references.
- `02-new-object-reference-breaks-memo.md` — distinguishing a real memoization break from a red herring.
- `03-shared-selector-instance-bug.md` — the classic multi-instance cache-thrashing bug in a rendered list.
- `04-selector-recompute-count.md` — counting recomputations across a sequence of dispatches.
- `05-array-sort-mutates-source.md` — `.sort()` mutating the actual store array via a selector.
- `06-createSelector-multiple-args.md` — how extra arguments are forwarded to every input selector.
- `07-selector-equality-check.md` — inline object-literal selectors defeating `useSelector`'s default comparison.

### scenarios/
- `01-expensive-derived-list-perf.md` — fixing a janky filter/sort selector with a staged composed pipeline.
- `02-per-row-selector-in-list.md` — diagnosing and fixing whole-table re-renders caused by a shared selector instance.
- `03-cross-slice-derived-data.md` — combining three slices efficiently by isolating the volatile input late in the pipeline.
- `04-search-filter-sort-dashboard.md` — a state-shape bug (unrelated field grouped into `filters`) masquerading as a memoization bug.

### interview-qa/
- `01-selector-fundamentals-qa.md` — what a selector is, co-location, whether every selector needs memoization, testing.
- `02-reselect-memoization-qa.md` — the memoization algorithm, input selectors vs. result function, when `createSelector` is overkill.
- `03-parameterized-selectors-qa.md` — the shared-instance bug, the factory fix, `useMemo` dependency arrays, larger cache sizes as an alternative.

### problems/
- `01-memoized-filtered-sorted-list.md` — a memoized selector computing a filtered + sorted task list.
- `02-fix-shared-selector-factory.md` — diagnosing and fixing a Kanban board's shared-selector memoization bug.
- `03-implement-createSelector-from-scratch.md` — a simplified `createSelector` implementation with reference-equality memoization.

### assets/
- `README.md` — placeholder for original notes' images/PDFs.
