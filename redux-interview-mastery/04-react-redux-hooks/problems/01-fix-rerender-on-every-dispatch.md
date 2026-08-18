# Problem: Fix a Component That Re-renders on Every Dispatch

## Task

The component below is meant to show the names of "active" todos (not completed). QA and a performance audit both flag that it re-renders far more often than it should — profiling shows it re-rendering on literally every dispatch in the app, including ones that have nothing to do with todos. Diagnose and fix it, without changing what the component visually displays.

## Given (buggy) code

```jsx
import { useSelector } from 'react-redux';

function ActiveTodoNames() {
  const activeNames = useSelector((state) =>
    state.todos.items.filter((t) => !t.completed).map((t) => t.text)
  );

  return (
    <ul>
      {activeNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
```

## Diagnosis

The selector chains `.filter(...).map(...)`, both of which construct brand-new arrays on every invocation — regardless of whether `state.todos.items` actually changed. `useSelector`'s default comparison is reference equality (`===`); a newly constructed array is never `===` to the previous render's newly constructed array, so `useSelector` reports "changed" on every single dispatch anywhere in the app, forcing a re-render every time, even for dispatches (a theme toggle, an unrelated form field update, anything) that have zero relation to `state.todos`.

## Fix option 1: `shallowEqual` (cheapest fix, minimal code change)

```jsx
import { useSelector, shallowEqual } from 'react-redux';

function ActiveTodoNames() {
  const activeNames = useSelector(
    (state) => state.todos.items.filter((t) => !t.completed).map((t) => t.text),
    shallowEqual
  );

  return (
    <ul>
      {activeNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
```

This stops the re-render (the resulting array's elements are compared one level deep, and are unchanged when `state.todos.items` hasn't changed), but the `.filter`/`.map` chain still re-executes on every dispatch — acceptable for small todo lists, wasteful for very large ones.

## Fix option 2: memoized selector via `reselect` (avoids recomputation too)

```jsx
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

const selectActiveTodoNames = createSelector(
  (state) => state.todos.items,
  (items) => items.filter((t) => !t.completed).map((t) => t.text)
);

function ActiveTodoNames() {
  const activeNames = useSelector(selectActiveTodoNames);

  return (
    <ul>
      {activeNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}
```

`createSelector` only re-runs the filter/map combiner when `state.todos.items` itself changes reference; otherwise, it returns the exact same cached array from before, satisfying `useSelector`'s default reference-equality check without needing `shallowEqual` at all, and without redoing the work when nothing relevant changed.

## Interview follow-ups this problem invites

- "Why prefer `reselect` over `shallowEqual` here specifically?" Because `reselect` also skips the redundant `.filter`/`.map` computation itself on irrelevant dispatches, not just the re-render — meaningful if `state.todos.items` is large or the derivation is more expensive than a simple filter/map.
- "If two different components both need `selectActiveTodoNames`, does defining it once and importing it into both matter?" Yes — a `reselect` selector's memoization cache is tied to the selector instance; sharing one instance across components means they share the same cache (and the same "did the input change" check), avoiding redundant computation across components too, not just across renders of one component. (Note: `reselect` v5 also supports per-component instance creation for cases needing that instead, e.g., a list rendering many rows each with `props.id`-specific derived data.)
