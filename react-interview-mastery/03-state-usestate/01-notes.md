# State & `useState`

## Mechanics

`useState(initialValue)` returns a pair: the current value and a setter function. Each call to the setter schedules a re-render with the new value:

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`initialValue` is only used on the *first* render ever — on every subsequent render, React ignores the argument and returns whatever the current state is. State is preserved across re-renders of the same component instance, and reset when the component unmounts and a fresh instance mounts (or when its `key` changes, forcing React to treat it as a new instance).

## Updates are asynchronous and batched

Calling the setter doesn't update `count` synchronously in the current closure — it schedules an update. React processes state updates and re-renders as a batch, typically at the end of the current event handler (and, since React 18, in timeouts/promises/native handlers too — "automatic batching"):

```jsx
function Example() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // still logs the OLD value — this render's closure
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`count` inside `handleClick` is a value captured from the render that created this closure; it doesn't magically update mid-function just because you called `setCount`. The DOM/UI updates only after React re-renders with the new state.

## Functional updates solve the "multiple updates, same tick" problem

Calling `setCount(count + 1)` twice in the same handler only increments once, because both calls read the same stale `count` from the closure:

```jsx
function Bad() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(count + 1); // count is 0 -> schedules "set to 1"
    setCount(count + 1); // count is STILL 0 in this closure -> schedules "set to 1" again
  }
  return <button onClick={handleClick}>{count}</button>; // only +1, not +2
}
```

Pass a function to the setter instead — React guarantees it's called with the latest pending state, letting updates chain correctly:

```jsx
function Good() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // correctly sees the result of the previous update
  }
  return <button onClick={handleClick}>{count}</button>; // +2
}
```

Use functional updates whenever the new state depends on the previous state — it's a safe default, not just a bug fix for edge cases.

## State is immutable — never mutate directly

React detects state changes by comparing references (`Object.is`), not by deep-inspecting values. Mutating an array or object in place keeps the same reference, so React doesn't know anything changed and won't re-render:

```jsx
// Wrong
function Bad() {
  const [items, setItems] = React.useState([]);
  function addItem(item) {
    items.push(item);      // mutates in place, same reference
    setItems(items);       // React sees the same reference -> may skip re-render
  }
}

// Correct — always create a new reference
function Good() {
  const [items, setItems] = React.useState([]);
  function addItem(item) {
    setItems(prev => [...prev, item]);
  }
  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }
  function updateItem(id, patch) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)));
  }
}
```

This applies to objects too: `setUser(prev => ({ ...prev, name: 'New Name' }))`, never `user.name = 'New Name'; setUser(user)`.

## Lazy initial state

If computing the initial value is expensive (parsing localStorage, heavy computation), pass a function instead of a value. React calls it exactly once, on the first render only — passing a plain expensive call directly would re-run it on every render even though its result is discarded after the first:

```jsx
// Bad: runs expensiveParse() on every render, even though only the first result is used
const [data, setData] = React.useState(expensiveParse(rawInput));

// Good: React only invokes this function once
const [data, setData] = React.useState(() => expensiveParse(rawInput));
```

## Lifting state up

When two sibling components need to share or stay in sync with the same piece of state, the state should live in their closest common ancestor, which then passes the value and updater callbacks down as props:

```jsx
function TemperatureConverter() {
  const [celsius, setCelsius] = React.useState(0);
  return (
    <>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitDisplay value={celsius * 9 / 5 + 32} />
    </>
  );
}
```

Neither `CelsiusInput` nor `FahrenheitDisplay` owns the state themselves — the parent is the single source of truth, which keeps the two views trivially in sync without needing to coordinate directly with each other.
