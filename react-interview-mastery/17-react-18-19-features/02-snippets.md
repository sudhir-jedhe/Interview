# Snippets: React 18/19 Features

### 1. useTransition keeps typing responsive during an expensive re-render
```jsx
function FilterList({ items }) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [filtered, setFiltered] = useState(items);

  function handleChange(e) {
    setText(e.target.value);
    startTransition(() => {
      setFiltered(items.filter((i) => i.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={text} onChange={handleChange} />
      {isPending && <span> updating...</span>}
      <ul>{filtered.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}
```

### 2. useDeferredValue to defer an expensive derived list
```jsx
function ProductList({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const filtered = useMemo(
    () => expensiveSearch(deferredQuery),
    [deferredQuery]
  );

  return (
    <ul style={{ opacity: isStale ? 0.6 : 1 }}>
      {filtered.map((p) => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

### 3. Automatic batching inside a setTimeout (React 18+)
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState(0);

  function handleClick() {
    setTimeout(() => {
      setCount((c) => c + 1);
      setClicks((c) => c + 1);
      // Both updates batched into a single re-render in React 18+
    }, 0);
  }

  return <button onClick={handleClick}>{count} / {clicks}</button>;
}
```

### 4. Opting out of batching with flushSync
```jsx
import { flushSync } from "react-dom";

function handleClick() {
  flushSync(() => {
    setCount((c) => c + 1); // commits immediately, own render
  });
  flushSync(() => {
    setFlag((f) => !f); // commits immediately, separate render
  });
}
```

### 5. useId for accessible label/input pairing
```jsx
function EmailField({ error }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input id={id} aria-describedby={error ? errorId : undefined} />
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
```

### 6. A minimal Server Component + Client Component split (framework-dependent syntax)
```jsx
// ProductPage.jsx — Server Component (no directive = server by default in an RSC framework)
async function ProductPage({ id }) {
  const product = await db.products.findById(id); // direct server-side data access
  return (
    <div>
      <h1>{product.name}</h1>
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// AddToCartButton.jsx — Client Component (needs interactivity)
"use client";
function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => setAdded(true)}>
      {added ? "Added!" : "Add to cart"}
    </button>
  );
}
```

### 7. useSyncExternalStore subscribing to a browser API
```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine, // client snapshot
    () => true // server snapshot (SSR fallback)
  );
}

function StatusBanner() {
  const online = useOnlineStatus();
  return online ? null : <p>You're offline</p>;
}
```
