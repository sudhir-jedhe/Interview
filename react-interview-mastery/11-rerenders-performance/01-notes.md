# Core Concepts

## Why a component re-renders

There are exactly three things that cause a function component to run again:

1. **Its own state changes** (`useState`/`useReducer` setter is called with a new value).
2. **Its parent re-renders**, regardless of whether the props it receives actually changed.
3. **A context it consumes changes value** (any component calling `useContext(MyContext)` re-renders when the provider's `value` changes, even if the consumer doesn't use the changed part).

Note what's *not* on this list: props changing by themselves do not cause a re-render — a prop change only matters because it's usually the *result* of the parent re-rendering. If a parent re-renders and passes the exact same props, the child still re-renders (unless memoized).

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child />
    </div>
  );
}

function Child() {
  console.log('Child rendered'); // logs on every Parent re-render
  return <p>I don't use count at all</p>;
}
```

## The default mental model: "everything re-renders, and that's fine"

React's reconciliation (the virtual DOM diff) is cheap. Re-running a component function and diffing the resulting element tree against the previous one is usually microseconds. The actual expensive part is **committing** changes to the real DOM, and React only touches the DOM nodes that actually changed. So a re-render is not the same as a DOM update — most re-renders produce an identical tree and cost almost nothing.

This matters because premature optimization (wrapping everything in `memo`/`useMemo`/`useCallback`) adds complexity and its own overhead (extra comparisons, extra memory) without measurable benefit in most apps. Default to writing plain components; optimize only once you've identified an actual slow interaction.

## `React.memo` and its shallow-comparison caveat

`React.memo(Component)` skips re-rendering a component if its props are shallowly equal to the previous render's props. "Shallow" means `Object.is` per prop — nested objects/arrays are compared by reference, not deep value.

```jsx
const Row = React.memo(function Row({ item, onSelect }) {
  console.log('Row render', item.id);
  return <li onClick={() => onSelect(item.id)}>{item.label}</li>;
});
```

This works great if `item` and `onSelect` are referentially stable across renders. It silently stops working the moment the parent passes a **new object, array, or function literal** each render — which is extremely common:

```jsx
function List({ items }) {
  // BUG: new function identity every render defeats Row's memo
  return items.map(item => (
    <Row key={item.id} item={item} onSelect={(id) => console.log(id)} />
  ));
}
```

Fix with `useCallback`/`useMemo` to stabilize the reference, or restructure so the callback doesn't need to be recreated (e.g., pass `id` and handle selection via event delegation or a stable dispatch function from `useReducer`).

## Identifying unnecessary re-renders

You don't need a tool to reason about this, but the React DevTools **Profiler** is the standard way to confirm it: it records a session, shows a flamegraph of which components rendered and *why* (the "ranked" and "why did this render" info), and lets you compare commit durations. The workflow is: record an interaction, look for components that rendered but whose output didn't visibly change, then ask which of the three triggers caused it.

## Common performance mistakes

- **Inline object/array/function props** — `<Comp style={{color: 'red'}} />` or `<Comp onClick={() => f()} />` creates a new reference every render, breaking `memo` and causing effects with that value as a dependency to re-fire.
- **Huge, flat component trees** — one giant component holding all state means every keystroke re-renders everything beneath it. Splitting state closer to where it's used shrinks the blast radius.
- **Unkeyed or badly-keyed lists** — using array index as `key` when the list can reorder/insert/delete causes React to misattribute state and DOM nodes between items, leading to bugs and extra DOM churn (see comparisons file).

## Virtualization for long lists

When a list has hundreds/thousands of rows, the bottleneck isn't re-renders — it's the sheer number of DOM nodes. **Virtualization** renders only the rows currently visible in the viewport (plus a small buffer), swapping content in and out as the user scrolls, keeping DOM node count roughly constant. Reach for `react-window` (or `react-virtual`/`@tanstack/react-virtual`) when a list is long, rows are uniform-ish height, and initial render or scroll performance is measurably janky — not by default for every list.

## Splitting components to narrow re-render scope

Moving fast-changing state into its own small component (e.g., a search input's value) prevents that state change from re-rendering unrelated siblings. This is often more effective than `memo`/`useCallback` gymnastics because it removes the re-render trigger entirely rather than trying to short-circuit it after the fact.
