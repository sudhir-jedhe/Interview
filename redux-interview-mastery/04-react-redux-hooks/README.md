# 04 — React-Redux Hooks

How React components actually connect to a Redux store: `useSelector`, `useDispatch`, the legacy `connect` HOC pattern still found in older codebases, `Provider`, and — the single highest-value practical skill in this topic — recognizing and fixing unnecessary re-renders caused by the referential-equality gotcha.

## Summary

- **`useSelector`** subscribes a component to the store and re-renders it when its selector's result changes, compared by **reference equality (`===`) by default**. A selector that constructs a new object/array (`.map`, `.filter`, `{...}`) every call returns a "different" value on every dispatch app-wide, causing unnecessary re-renders — the most common real-world Redux performance bug.
- **`useDispatch`** returns a stable reference to the store's `dispatch` function — safe to use in `useEffect`/`useCallback` dependency arrays, and doesn't itself subscribe to anything or cause re-renders.
- **`connect(mapStateToProps, mapDispatchToProps)`** is the legacy, pre-hooks HOC pattern — still the *only* option for class components, since hooks can't be used there. It shallow-compares `mapStateToProps`'s combined output to decide whether to re-render, conceptually similar to multiple `useSelector` calls.
- **`Provider`** makes a store instance available via React Context to every descendant component — `useSelector`/`useDispatch` both read from that Context internally, which is why they throw if used outside a `<Provider>` tree.
- **Avoiding unnecessary re-renders**: select narrowly/primitively where possible, use `shallowEqual` when an array/object return is unavoidable, and reach for `reselect`'s memoized selectors when the underlying computation itself (not just the re-render) is expensive.

## Key bullets to remember for interviews

- The referential-equality gotcha: a `useSelector` returning a freshly derived array/object re-renders its component on **every** dispatch in the app, not just relevant ones — silent, no error, only visible via profiling.
- `shallowEqual` fixes the re-render but not the redundant recomputation; `reselect`'s `createSelector` fixes both by memoizing on its declared inputs.
- Prefer several narrow `useSelector` calls (each selecting a primitive or stable reference) over one call returning a combined object literal.
- `connect` and hooks are two client APIs over the *same* underlying store/Context — migrating one component doesn't require touching others, which is what makes incremental migration low-risk.
- `Provider` is "just Context" — testing a connected component only requires wrapping it in a real (test-scoped) store via `<Provider>`, no special mocking needed.

## Index

### theory/
- [01-useSelector.md](theory/01-useSelector.md) — subscription mechanics, the reference-equality comparison, the gotcha explained, and three fixes
- [02-useDispatch.md](theory/02-useDispatch.md) — reference stability, dispatching thunks, the typed-hooks convention
- [03-connect-hoc-legacy.md](theory/03-connect-hoc-legacy.md) — the HOC pattern, `mapDispatchToProps` shorthand, why hooks mostly replaced it, when you'll still see it
- [04-provider.md](theory/04-provider.md) — Context-based wiring, nested providers, SSR/testing implications
- [05-avoiding-unnecessary-rerenders.md](theory/05-avoiding-unnecessary-rerenders.md) — five concrete principles, from narrow selectors to `reselect`, with a caution against over-optimizing

### snippets/
- [01-basic-useSelector-useDispatch.jsx](snippets/01-basic-useSelector-useDispatch.jsx) — a cart component reading and dispatching
- [02-provider-setup.jsx](snippets/02-provider-setup.jsx) — wiring `Provider` at the app root
- [03-shallowEqual-selector.jsx](snippets/03-shallowEqual-selector.jsx) — using `shallowEqual` to stop unnecessary re-renders
- [04-connect-class-component.jsx](snippets/04-connect-class-component.jsx) — a full legacy `connect` example with both map functions
- [05-custom-typed-hooks.jsx](snippets/05-custom-typed-hooks.jsx) — the `useAppDispatch`/`useAppSelector` project-wrapper convention
- [06-memoized-selector-with-reselect.jsx](snippets/06-memoized-selector-with-reselect.jsx) — `createSelector` + `useSelector` combined
- [07-useReduxSelector-dev-logging-wrapper.jsx](snippets/07-useReduxSelector-dev-logging-wrapper.jsx) — a minimal dev-mode change-logging wrapper hook

### output-based/
- [01-new-array-every-render.md](output-based/01-new-array-every-render.md) — a `.filter` selector re-rendering on every unrelated dispatch
- [02-shallowEqual-fixes-it.md](output-based/02-shallowEqual-fixes-it.md) — the same case fixed with `shallowEqual`
- [03-useDispatch-reference-stability.md](output-based/03-useDispatch-reference-stability.md) — confirming `dispatch` never changes reference across renders
- [04-connect-mapStateToProps-shallow-merge.md](output-based/04-connect-mapStateToProps-shallow-merge.md) — `connect` skipping re-renders for irrelevant/no-op dispatches
- [05-useSelector-outside-provider.md](output-based/05-useSelector-outside-provider.md) — the exact error from missing `Provider`
- [06-mapDispatchToProps-object-shorthand.md](output-based/06-mapDispatchToProps-object-shorthand.md) — what the shorthand actually wraps action creators with
- [07-multiple-useSelector-vs-one-object-selector.md](output-based/07-multiple-useSelector-vs-one-object-selector.md) — two primitive selectors vs one object selector, side by side

### scenarios/
- [01-laggy-list-during-typing.md](scenarios/01-laggy-list-during-typing.md) — an unrelated search box causing a 200-row list to re-render every keystroke
- [02-testing-a-connected-component.md](scenarios/02-testing-a-connected-component.md) — building a `renderWithStore` test utility for `useSelector`/`useDispatch` components
- [03-migrating-class-components-during-a-feature-freeze.md](scenarios/03-migrating-class-components-during-a-feature-freeze.md) — a low-risk, incremental `connect`-to-hooks migration strategy
- [04-debugging-mystery-rerenders-in-code-review.md](scenarios/04-debugging-mystery-rerenders-in-code-review.md) — flagging and right-sizing a fix for a `useSelector` re-render risk in review

### interview-qa/
- [01-useSelector-mechanics.md](interview-qa/01-useSelector-mechanics.md) — internal subscription/comparison flow, why reference equality by default, selector purity
- [02-connect-vs-hooks.md](interview-qa/02-connect-vs-hooks.md) — class-component constraints, deprecation status, comparison shapes, `mapDispatchToProps`'s function form
- [03-performance-and-rerenders.md](interview-qa/03-performance-and-rerenders.md) — debugging process, `shallowEqual` vs `reselect`, the cost of over-optimizing

### problems/
- [01-fix-rerender-on-every-dispatch.md](problems/01-fix-rerender-on-every-dispatch.md) — diagnose and fix a todo-list selector re-rendering on every dispatch, two solutions compared
- [02-convert-connect-to-hooks.md](problems/02-convert-connect-to-hooks.md) — full class-to-function migration including lifecycle-to-`useEffect` mapping
- [03-implement-useReduxSelector-with-logging.md](problems/03-implement-useReduxSelector-with-logging.md) — build a transparent `useSelector` wrapper with dev-mode change logging

### assets/
- [README.md](assets/README.md) — placeholder for original notes' images/PDFs
