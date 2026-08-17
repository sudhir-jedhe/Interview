# Notes: useRef & DOM Access

## The core mechanic

`useRef(initialValue)` returns a plain object shaped `{ current: initialValue }` that is stable across the component's entire lifetime — the same object reference every render. You can read and write `.current` freely, and doing so does **not** trigger a re-render, unlike `useState`.

```jsx
function Counter() {
  const renderCount = useRef(0);
  renderCount.current += 1; // mutating during render — fine for this specific purpose
  return <p>Rendered {renderCount.current} times</p>;
}
```

This is the key mental model difference from `useState`: `useState` changes are meant to drive what's on screen (they schedule a re-render); `useRef` changes are for bookkeeping that the component needs to remember but that shouldn't, by itself, cause the UI to update.

## Accessing DOM nodes

The most common use: attach a ref to a JSX element, and after the browser paints, `.current` points at the real DOM node.

```jsx
function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // runs after mount, DOM node exists by then
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
```

`inputRef.current` is `null` during the initial render (before the DOM exists) and gets set by React right after the commit phase, before effects run — which is exactly why DOM ref access belongs in `useEffect` (or an event handler), not directly in the render body.

Common DOM-ref use cases: focus management, reading layout (`getBoundingClientRect`), scrolling an element into view, integrating imperative third-party libraries (charting libraries, video players) that need a raw DOM node to mount into.

## Storing mutable values across renders

The other major use has nothing to do with the DOM — `useRef` is the standard way to keep a mutable value alive between renders without causing re-renders when it changes. Two classic examples:

**Previous value tracking:**

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; // updates AFTER this render commits, so during render it still holds the old value
  });
  return ref.current;
}

function PriceDisplay({ price }) {
  const prevPrice = usePrevious(price);
  const direction = prevPrice === undefined ? null : price > prevPrice ? 'up' : 'down';
  return <span className={direction}>{price}</span>;
}
```

**Interval/timeout IDs:**

```jsx
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback; // always keep the latest callback without re-running the interval effect
  });

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

Storing `callback` in a ref instead of a dependency avoids tearing down and restarting the interval every time the parent re-renders with a new inline function — the interval only resets when `delay` actually changes.

## Why ref mutations don't update the UI

Because React's render cycle is driven by state changes (via `useState`/`useReducer`) and prop changes from a parent re-rendering — `.current` mutations are invisible to React's scheduler entirely. If you mutate a ref and expect the screen to reflect it immediately, it won't, until *something else* (a state update) causes a re-render, at which point the ref's current value will be read fresh. This is a frequent source of confusion: "I set `ref.current = true` but the UI didn't update" — because nothing told React to re-render.

## forwardRef

By default, function components don't accept `ref` as a regular prop — React reserves it as a special attribute for attaching to DOM nodes or class instances. If you write a custom component and someone tries `<MyInput ref={someRef} />`, `ref` is stripped out and never reaches your component's props; `someRef.current` stays `null`.

`forwardRef` fixes this by explicitly opting a component in to receiving a ref, which it can then attach to one of its own internal DOM nodes:

```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} className="fancy" {...props} />;
});

function Form() {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current.focus(); }, []);
  return <FancyInput ref={inputRef} />;
}
```

## useImperativeHandle

Sometimes you don't want to expose the raw DOM node through a forwarded ref — you want to expose a curated, limited API instead. `useImperativeHandle` customizes what `ref.current` looks like from the parent's perspective:

```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
  }));
  return <input ref={inputRef} {...props} />;
});
// parent gets { focus, clear } instead of the raw <input> node
```

Use this sparingly — it's an escape hatch for imperative APIs (focus, scroll, play/pause) that don't map cleanly to props, not a general pattern for parent-child communication (which should normally flow through props/state).
