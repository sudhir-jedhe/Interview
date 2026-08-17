# Notes: Custom Hooks

## What makes something a custom hook

A custom hook is just a regular JavaScript function that (1) calls one or more built-in hooks (`useState`, `useEffect`, `useRef`, etc.) or other custom hooks internally, and (2) is named starting with `use` by convention. That's it — there's no special React API for "declaring" a hook; it's purely a naming and usage convention that both React's linter and other developers rely on to know a function has hook-like behavior (stateful, order-sensitive, only callable from certain places).

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Modal() {
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <>
      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'}</button>
      {isOpen && <div className="modal">Content</div>}
    </>
  );
}
```

`useToggle` isn't magic — it's a function that happens to call `useState`, and by naming it `useToggle`, React's ESLint plugin (`eslint-plugin-react-hooks`) knows to apply the Rules of Hooks to it and lint calls to `useState`/`useCallback` inside it correctly.

## The Rules of Hooks

Two rules, enforced by convention + lint rule, not by the JS runtime itself:

1. **Only call hooks at the top level.** Never inside loops, conditionals, or nested functions.
2. **Only call hooks from React function components or other custom hooks.** Never from regular JS functions, class components, or outside the render flow.

```jsx
// Violates rule 1 — conditional hook call
function Bad({ show }) {
  if (show) {
    const [value, setValue] = useState(0); // breaks call order between renders
  }
}
```

## Why the rules exist

React tracks hook state by **call order**, not by variable name or any explicit identifier. Internally, each component instance has a linked list of "hook slots," and every render, React walks that list in the same sequence your hook calls appear in the function body, matching the first `useState` call this render to the first `useState` call last render, the second to the second, and so on.

If a hook call is conditionally skipped on some renders, every hook call *after* it shifts by one slot, and React ends up matching the wrong stored state to the wrong `useState` call — corrupting state silently or throwing "Rendered more hooks than during the previous render." This is why hooks can never live inside `if` blocks, loops, or be called conditionally — the *number and order* of hook calls must be identical on every render of a given component instance.

```jsx
function Counter({ skip }) {
  // if `skip` toggles between renders, call order changes and React desyncs state
  if (!skip) {
    const [count, setCount] = useState(0);
  }
  const [other, setOther] = useState('x'); // shifts slots when `skip` flips
}
```

## Real custom hook implementations

**useToggle** — boolean state with a toggle function:

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}
```

**useDebounce** — delays updating a value until it's stopped changing for a given delay:

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // cancel the pending update if value changes again first
  }, [value, delay]);
  return debounced;
}

// usage: only fires a search request 300ms after the user stops typing
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

**useLocalStorage** — state that's synced to `localStorage`, surviving page reloads:

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

**useFetch** — a minimal data-fetching hook with loading/error state and request cancellation:

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      });

    return () => controller.abort(); // cancel if url changes or component unmounts mid-flight
  }, [url]);

  return state;
}
```

## Sharing logic, not state

This trips people up constantly: calling the same custom hook from two different components (or twice in the same component) gives each call site its **own, independent state instance**. Nothing is shared between them unless the hook itself reaches into something external and shared (like `localStorage`, a module-level variable, or Context).

```jsx
function ComponentA() {
  const [isOpen, toggle] = useToggle(); // its own isOpen, starts false
}
function ComponentB() {
  const [isOpen, toggle] = useToggle(); // a completely separate isOpen, also starts false
}
// toggling A's isOpen has zero effect on B's isOpen — they don't know about each other
```

If you actually need shared state across components (not just shared logic), a custom hook alone won't do it — you need Context, a module-level store, or an external state library. `useLocalStorage` is a partial exception: because `localStorage` itself is a shared, external resource, two components using `useLocalStorage('theme', 'light')` will both read the same persisted value on mount, but their in-memory `useState` copies still won't automatically stay in sync with each other without extra work (e.g., listening to the `storage` event).
