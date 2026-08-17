**`use`** is a powerful React API (introduced in React 19) that lets you read the value of a resource—either a **Context** or a **Promise**—directly inside your component or custom hook.

Unlike traditional hooks (which must always be called at the top level of a component), **`use` can be called conditionally** inside `if` statements and loops.

---

## 1. Reference

### `const value = use(resource);`

* **`resource`**: Either a Context object (created with `createContext`) or a Promise.
* **Returns:** The resolved value of the context or the resolved data from the promise.

---

## 2. Usage Scenarios

### Reading Context conditionally (with `use`)

Traditional hooks like `useContext` follow strict rules and cannot be placed inside `if` statements. The `use` API allows you to read context conditionally.

```jsx
import { use, createContext } from 'react';

const ThemeContext = createContext('light');

function Button({ showTheme }) {
  // ✅ Perfectly valid! `use` can be called inside conditional blocks.
  if (showTheme) {
    const theme = use(ThemeContext);
    return <button className={theme}>Themed Button</button>;
  }

  return <button>Standard Button</button>;
}

```

### Reading a Promise with `use` (Data Fetching)

When you pass a Promise to `use`, it integrates seamlessly with **`<Suspense>`**. While the promise is pending, React suspends rendering and shows the nearest Suspense fallback. Once the promise resolves, it returns the data.

```jsx
import { use, Suspense } from 'react';

// Assume fetchUser returns a Promise
function UserProfile({ userPromise }) {
  // Reads the promise. Suspends until the promise resolves!
  const user = use(userPromise);

  return <h2>Welcome back, {user.name}</h2>;
}

function App({ userPromise }) {
  return (
    <Suspense fallback={<p>Loading user profile...</p>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

```

### Streaming data from server to client

You can pass promises created on the server directly down to client components as props. The client component can then use the `use` API to unwrap that promise on-the-fly as streaming chunks arrive.

---

## 3. Troubleshooting

### I’m getting an error: “Suspense Exception: This is not a real error!”

* **Cause:** This isn't actually a crash. Under the hood, React implements Suspense by throwing a special internal Promise. If you wrapped your component in a `try...catch` block that catches *all* errors, you accidentally intercepted React's internal mechanism.
* **Fix:** Never catch exceptions globally around a component that uses `use` or `<Suspense>` unless you explicitly rethrow the error (`if (isSuspenseException(err)) throw err;`).

### I’m getting a warning: “A component was suspended by an uncached promise”

* **Cause:** You created a new Promise directly inside the render body of your component (e.g., `const promise = fetch('/api')`). Because components re-render frequently, this creates a brand-new promise on every single render, causing an infinite loop of re-fetching and suspending.
* **Fix:** Always cache or memoize your promises outside the component (e.g., using a caching library like TanStack Query, React Server Components, or caching the promise reference in a module scope or parent state).
