# Anti-Pattern: Forgetting to Memoize Selectors

The last entry in this topic's anti-pattern list, and one of the most mechanical to both spot and fix once you know the signature.

## The bug

```javascript
// A selector that builds a new array/object every time it's called
function selectCompletedTodos(state) {
  return state.todos.filter((todo) => todo.completed); // .filter() ALWAYS returns a new array
}

function CompletedList() {
  const completedTodos = useSelector(selectCompletedTodos);
  console.log('CompletedList rendered');
  return <ul>{completedTodos.map((t) => <li key={t.id}>{t.text}</li>)}</ul>;
}
```

Every time *any* action is dispatched — even one that has nothing to do with todos, like a UI theme toggle — `useSelector` re-runs `selectCompletedTodos`. `.filter()` always returns a brand-new array instance, even when its output would be element-for-element identical to last time. `useSelector`'s default `===` comparison sees a new reference and forces `CompletedList` to re-render, even though the actual completed-todos data hasn't changed at all. In an app with many such unmemoized selectors, this compounds into what's commonly called a "re-render storm": dispatching one small, unrelated action cascades into dozens of components re-rendering because their selectors all happened to allocate new references on every call.

## The fix: `createSelector` from `reselect` (or RTK, which re-exports it)

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectTodos = (state) => state.todos;

const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter((todo) => todo.completed)
);
```

`createSelector` caches the last inputs and last output. On the next call, it first re-runs only the cheap input selectors (`selectTodos`) and compares their results to last time by reference; only if an input actually changed does it re-run the expensive/allocating transform (`.filter()`) and produce a new output reference. If `state.todos` didn't change (an unrelated theme-toggle action, for instance), `selectCompletedTodos` returns the *exact same array reference* as last time, `useSelector`'s `===` check sees no change, and `CompletedList` correctly skips re-rendering.

## Where this bites hardest

The cost scales with (a) how expensive the transform is (sorting, filtering, or mapping over a large collection is worse than a cheap property access) and (b) how often unrelated actions dispatch relative to how often the selector's actual inputs change. A selector doing an expensive `.sort()` over a large list, called from a component that's mounted app-wide (a header, a global notification badge), recomputing on every single dispatched action regardless of relevance, is the worst-case version of this bug — and it's also one of the easiest to fix once identified, since it's almost always a mechanical wrap-in-`createSelector` change with no logic rewrite required. Topic `07-selectors-reselect` covers `reselect`'s memoization mechanics (cache size, multiple-argument selectors, per-instance memoization for lists) in full depth; this entry exists to name it explicitly as one of the concrete anti-patterns worth actively grepping for in code review — any inline selector function passed directly to `useSelector` that contains `.filter()`, `.map()`, `.sort()`, or an object/array literal is a candidate.
