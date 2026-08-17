# Notes: React 18/19 Features

## Concurrent rendering — "interruptible," not "faster"

The single biggest conceptual shift in React 18 is concurrent rendering. It does not make any individual render faster. What it does is let React start rendering an update, pause partway through if something more urgent comes in (like a keystroke), work on the urgent thing first, and then either resume or throw away the paused work. Before React 18, rendering was synchronous and uninterruptible once started — a big update would block the main thread until it finished, including blocking user input. Concurrency is opt-in: you get it by using `createRoot` (the React 18 default) and specifically by using APIs like `useTransition` and `useDeferredValue` that tell React "this update is allowed to be interrupted."

## useTransition

`useTransition` marks a state update as non-urgent ("a transition"), so React can interrupt it to handle higher-priority updates (like typing) first:

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // urgent: keep the input responsive
    startTransition(() => {
      setResults(expensiveFilter(e.target.value)); // non-urgent
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

The input stays snappy because `setQuery` runs at normal priority, while `setResults` — which might trigger an expensive re-render of a big list — can be interrupted mid-render if the user types another character. `isPending` tells you the transition is still in flight, useful for a subtle loading indicator.

## useDeferredValue

`useDeferredValue` is the "value" counterpart to `useTransition` — instead of wrapping a state setter, you defer a value itself, letting React re-render with the old value while it computes the new one in the background:

```jsx
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => expensiveFilter(deferredQuery), [deferredQuery]);
  return <List items={results} />;
}
```

Use `useDeferredValue` when you don't control the state update itself (e.g., the value comes from a prop) and can't wrap it in `startTransition` at the source.

## Automatic batching

Before React 18, React only batched multiple `setState` calls together into a single re-render inside React event handlers. Outside of them — inside `setTimeout`, native event listeners, or Promise callbacks — every `setState` triggered its own separate re-render. React 18 batches everywhere automatically:

```jsx
function handleClick() {
  setTimeout(() => {
    setCount((c) => c + 1);
    setFlag((f) => !f);
    // React 17: two re-renders. React 18: one re-render.
  }, 1000);
}
```

This is a real behavior change worth knowing explicitly, because code that relied on synchronous, per-`setState` re-renders outside event handlers (rare, but it happens) can behave differently after upgrading. You can opt out for a specific update with `flushSync` if you truly need an immediate, unbatched render.

## React Server Components (RSC)

Server Components render entirely on the server and send the result (not JavaScript) to the client — zero client-side JS for that component, no hydration cost, direct access to server-only resources (databases, file system) without an API layer. Client Components are the "normal" React components you already know: they render on the client (after optional server-side rendering for the initial HTML) and can use state, effects, and browser APIs. The mental model: Server Components describe *what* to render using server-only data; Client Components handle *interactivity*. You can't use `useState` or `onClick` in a Server Component — that's the client's job.

## "use client" / "use server"

These are directives (string literals at the top of a file) that mark a boundary in an RSC-enabled framework (like Next.js App Router). `"use client"` at the top of a file says "this component and its subtree render on the client" — it's the escape hatch from the server-component default. `"use server"` marks a function as a Server Action, callable from client code but executed on the server (e.g., form submissions that need to write to a database without a hand-rolled API route). These only matter in frameworks that implement the RSC contract; they aren't standalone React APIs you use in a plain client-rendered app.

## useId

`useId` generates a stable, unique ID string, primarily for accessibility attributes (`aria-describedby`, label/input pairing) that must match between server-rendered and client-hydrated HTML:

```jsx
function LabeledInput() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Name</label>
      <input id={id} />
    </>
  );
}
```

Don't use it as a React `key` for list items — it's for accessibility/DOM attribute IDs, not list identity.

## useSyncExternalStore (brief)

`useSyncExternalStore` lets you safely subscribe a component to an external (non-React) data store — like a browser API or a third-party state library — in a way that's compatible with concurrent rendering, avoiding tearing (different parts of the UI showing inconsistent snapshots of the store during a concurrent render). Most app code doesn't call it directly; it's primarily a low-level primitive that state management library authors use internally.
