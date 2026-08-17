# Notes: useMemo & useCallback

## useMemo: caching a computed value

`useMemo(fn, deps)` re-runs `fn` and caches its return value, only recomputing when one of the values in `deps` changes between renders. On every render where deps are unchanged, React returns the cached value without calling `fn` again.

```jsx
function ProductList({ products, filterText }) {
  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(filterText)),
    [products, filterText]
  );
  return <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

Without `useMemo`, `products.filter(...)` reruns on *every* render of `ProductList`, including renders triggered by completely unrelated state elsewhere in the app (if this component re-renders for other reasons). For a cheap filter over a small array, that's irrelevant. For a heavy computation (sorting/filtering thousands of rows, complex derived calculations), it can matter.

## useCallback: caching a function reference

`useCallback(fn, deps)` returns the *same function reference* across renders as long as `deps` haven't changed, instead of creating a brand-new function every render (which is what happens by default — every render of a component recreates every function defined in its body).

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // stable reference forever

  return <ExpensiveChild onClick={handleClick} />;
}
```

`useCallback(fn, deps)` is literally equivalent to `useMemo(() => fn, deps)` — it's a convenience wrapper for the specific "memoize a function" case. Anywhere you'd write `useMemo(() => someFunction, deps)`, `useCallback(someFunction, deps)` does the same thing with less ceremony.

## Why referential equality matters

JavaScript compares objects and functions by reference, not by structural equality — `{} !== {}` and `(() => {}) !== (() => {})` even though they "look the same." This matters in two places React cares about deeply:

**1. `React.memo`.** A memoized component skips re-rendering if its props are shallowly equal to last time. If you pass an inline object or function as a prop, it's a *new reference* every render of the parent, so the shallow-equality check always fails and the memoization is defeated — `ExpensiveChild` re-renders every time regardless of `React.memo`.

```jsx
const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
  console.log('ExpensiveChild render');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {/* New arrow function every render defeats React.memo entirely */}
      <ExpensiveChild onClick={() => console.log('clicked')} />
    </>
  );
}
```

**2. `useEffect` (and `useMemo`/`useCallback`) dependency arrays.** If an object or function is listed as a dependency and it's recreated every render, the effect reruns every render too, regardless of whether anything meaningful actually changed.

```jsx
function Search({ query }) {
  const options = { caseSensitive: false }; // new object every render

  useEffect(() => {
    runSearch(query, options);
  }, [query, options]); // options is "new" every render → effect fires every render
}
```

## When memoization is actually worth it

Memoization has a cost too — React has to store the cached value/deps and compare deps on every render, which is not free. `useMemo`/`useCallback` are worth reaching for when:

- The computation is genuinely expensive (sorting/filtering large arrays, heavy math), not a cheap map/filter over a handful of items.
- The value/function is passed to a `React.memo`-wrapped child, and you specifically want to prevent that child from re-rendering.
- The value/function is a dependency of another hook (`useEffect`, `useMemo`), and referential stability prevents that hook from re-running unnecessarily.

They are **not** automatically a performance win for every computation and every callback — wrapping trivial values (`useMemo(() => a + b, [a, b])`) or every single handler in a component with no memoized children adds cognitive overhead and a small runtime cost for no measurable benefit. Profile first; don't reflexively wrap everything.

## Classic dependency-array bugs

**Missing a dependency** — using a value inside the memoized function/computation without listing it, so the cached result goes stale:

```jsx
function Cart({ items, taxRate }) {
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate),
    [items] // BUG: taxRate is used but not listed — total won't update when tax rate changes
  );
}
```

**Depending on something that changes every render** (an inline object/array/function created fresh each time), which defeats memoization entirely by forcing recomputation every render anyway — see the `options` example above.

**Wrapping a callback in `useCallback` with stale closed-over state**, same root cause as any stale closure:

```jsx
function Form() {
  const [value, setValue] = useState('');
  const handleSubmit = useCallback(() => {
    console.log(value); // always logs '' — closure captured value from mount
  }, []); // should be [value]
}
```

## useMemo(() => fn, []) vs useCallback(fn, [])

They produce the exact same result — `useCallback` is defined internally as `useMemo(() => callback, deps)`. Use `useCallback` when memoizing a function (clearer intent, less boilerplate); reach for `useMemo` when memoizing any non-function value, or in the rare case you need to memoize a function as part of a larger returned object/array.
