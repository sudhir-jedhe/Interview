The **`use()`** API (introduced in React 19) is a versatile React function that allows you to read the value of a **Promise** or a **Context** directly inside the render phase.

While it looks like a hook, `use()` breaks the fundamental rules that govern traditional React hooks, bringing unprecedented flexibility to asynchronous data fetching and context consumption.

---

## 1. How `use()` Differs from Traditional Hooks

The key technical difference lies in **where and how** `use()` can be called inside a component:

| Feature                       | Traditional Hooks (`useState`, `useEffect`, `useContext`)                                                           | The `use()` API                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Conditional Calling**       | ❌ **FORBIDDEN.** Must be called at the top level. Cannot be placed inside `if` statements, loops, or early returns. | ✅ **ALLOWED.** Can be called conditionally inside `if` blocks, `try/catch`, or loops.               |
| **Resource Types**            | Manages component state, lifecycles, or context values.                                                             | Accepts a **Promise** or a **React Context**.                                                       |
| **Integration with Suspense** | Needs custom wrapper libraries (or manual `useEffect` + `useState`) to trigger Suspense boundaries.                 | **Native Suspense support.** Passing a Promise automatically suspends the component until resolved. |
| **Call Location**             | Only inside the body of a React Function Component or Custom Hook.                                                  | Can be called conditionally inside components and render functions.                                 |

---

## 2. Using `use()` to Read Promises (Async Data)

When you pass a Promise to `use(promise)`, React suspends rendering until the Promise resolves. If the Promise rejects, it triggers the nearest **Error Boundary**.

### Code Example: Conditional Promise Resolution

```tsx
import { use, Suspense } from 'react';

// Fetching function returning a Promise
function fetchUserDetails(userId: string): Promise<{ name: string; role: string }> {
  return fetch(`/api/users/${userId}`).then((res) => res.json());
}

interface UserProfileProps {
  userPromise: Promise<{ name: string; role: string }>;
  showDetails: boolean;
}

export function UserProfile({ userPromise, showDetails }: UserProfileProps) {
  // ✅ CONDITIONAL CALL: Traditional hooks cannot do this!
  if (!showDetails) {
    return <p>Details hidden.</p>;
  }

  // Suspends component until userPromise resolves!
  const user = use(userPromise);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Role: {user.role}</p>
    </div>
  );
}

// Parent component providing the Suspense boundary
export function App() {
  const userPromise = fetchUserDetails('user_123');

  return (
    <Suspense fallback={<div>Loading user profile...</div>}>
      <UserProfile userPromise={userPromise} showDetails={true} />
    </Suspense>
  );
}

```

> ⚠️ **Important Promise Caching Rule:** The Promise passed to `use()` **must be created outside the render phase** (e.g., in a Server Component, event handler, or cached via a memoized store). If you create a new Promise inside the render function (`use(fetch(...))`), it will trigger an infinite re-fetch loop on every render!

---

## 3. Using `use()` to Read Context

`use(Context)` can be used as a direct replacement for `useContext(Context)`. The advantage is that you can read context conditionally inside `if` statements.

### Code Example: Conditional Context Consumption

```tsx
import { createContext, use } from 'react';

const ThemeContext = createContext<'light' | 'dark'>('light');

export function Card({ isCustomTheme }: { isCustomTheme: boolean }) {
  if (isCustomTheme) {
    // ✅ Read context conditionally!
    const theme = use(ThemeContext);
    return <div className={`card card-${theme}`}>Themed Card</div>;
  }

  return <div className="card">Default Card</div>;
}

```

---

## 4. Why Was `use()` Introduced?

1. **Simplifies Client-Side Data Fetching:** Eliminates the boilerplate of setting up three `useState` variables (`data`, `isLoading`, `error`) alongside `useEffect` for basic async operations.
2. **Server Components Integration:** Server Components can fetch data asynchronously and pass unresolved Promises as props down to Client Components. The Client Component then resolves the Promise using `use()`, enabling parallel data streaming with Suspense.
3. **Flexible Architecture:** Relieves developers from strict "Top-Level Hook Only" constraints when reading context or resolving asynchronous values.

---

## Summary Matrix

| Metric                      | `useContext(Context)` | `use(Promise)`                 | `use(Context)`              |
| --------------------------- | --------------------- | ------------------------------ | --------------------------- |
| **Accepts**                 | React Context         | Promise                        | React Context               |
| **Top-Level Only?**         | Yes                   | **No** (Can be inside `if`)    | **No** (Can be inside `if`) |
| **Triggers Suspense?**      | No                    | **Yes**                        | No                          |
| **Error Boundary Trigger?** | No                    | **Yes** (On Promise rejection) | No                          |
