# When to Use Redux vs Local/Component State

This is arguably the single most commonly tested judgment question in Redux interviews, because it tests engineering taste, not API trivia. Getting it right shows you won't reach for Redux reflexively.

## Default to local state

Start every piece of state as local (`useState` or `useReducer` in the component that needs it). Only lift it — to a parent, to Context, or to Redux — when you have a concrete reason to. Signs a piece of state should stay local:

- It's only read and written by one component (or a tightly coupled parent/child pair): a text input's current value, whether a dropdown is open, a hovered row index.
- It doesn't need to survive the component unmounting.
- It's derived entirely from props or other local state (compute it inline or with `useMemo`; don't store it at all).

```javascript
// Good: purely local UI state, no reason to touch Redux
function SearchBox() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

## Reach for Redux (or at least a shared store) when...

- **Multiple, distant components need the same state** and prop drilling would mean threading it through several layers of components that don't otherwise care about it (a logged-in user, cart contents, feature flags, theme).
- **The state has non-trivial, shared update logic.** If several different UI actions all need to update the same piece of state consistently (adding an item from a product card, a search result, and a "recently viewed" list all touch the same cart), centralizing that logic in one reducer avoids duplicating it, or getting it subtly inconsistent, in every component.
- **You need traceability/debugging for state changes** — audit logs, undo/redo, or "what sequence of events led to this bug" are much easier with a single action log than with scattered `setState` calls.
- **State needs to persist or be read outside of React** — e.g., middleware needs to inspect state before/after every action, or you need to hydrate/rehydrate state from `localStorage` in one place.

## React Context is a middle ground, not a Redux replacement

Context solves prop drilling for *read* access but doesn't give you a structured update mechanism, middleware, or DevTools-style time travel out of the box. Context is a good fit for rarely-changing, mostly-read values (theme, locale, auth status flags). It's a poor fit for high-frequency updates shared across many consumers, because *every* consumer of a Context re-renders on any change to the value (no built-in selector-based partial subscription like `useSelector` gives you) unless you split contexts carefully or memoize aggressively.

## A concrete decision checklist

Ask, in order:
1. Does only one component (or a parent + its direct children) need this? → local state.
2. Is it read in many unrelated places but rarely written (theme, locale)? → Context is probably enough.
3. Is it written from many places, does it have real business logic around its updates, or do you need time-travel/middleware/persistence? → Redux (or Redux Toolkit).
4. Is it server data that's fetched, cached, and revalidated (not really "app state" at all)? → consider a data-fetching library (RTK Query, React Query) instead of hand-rolling it in Redux.

## The senior-level nuance

A trap many candidates fall into: treating "Redux vs local state" as binary for the *whole app*. In practice, real apps mix both freely — cart contents in Redux, but the "is this accordion expanded" flag stays local, even in an app that uses Redux extensively elsewhere. The skill being tested is not "do you know Redux" but "can you draw the line per piece of state, correctly, every time."
