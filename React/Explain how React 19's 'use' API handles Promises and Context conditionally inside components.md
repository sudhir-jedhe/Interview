React 19’s **`use` API** represents a major shift in how React components consume resources during render.

Unlike traditional React Hooks (which strictly require unconditional, top-level execution under the "Rules of Hooks"), **`use` is an API function** that can be called conditionally (inside `if` statements) and within loops.

It serves two primary roles:

1. **Reading Context conditionally or after early returns.**
2. **Unwrapping Promises directly in render** (integrating natively with `<Suspense>` and Error Boundaries).

---

# Architecture of the `use` API

```text
                                React Component Render
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                             │
         use(ThemeContext)                               use(dataPromise)
                   │                                             │
      Reads nearest Context value                    Checks Promise Status
      (Allowed inside `if` / `for`)                   /                 \
                   │                            (Pending)            (Resolved)
                   ▼                               │                     ▼
        Returns context value                      ▼             Returns resolved data
                                           [ SUSPENDS ]
                                   (Triggers nearest <Suspense>)

```

---

## 1. Handling Context Conditionally

Historically, `useContext(MyContext)` had to be placed at the very top of a component. Even if a component only needed context under specific conditions, it was forced to subscribe to that context on every single render pass.

With `use(MyContext)`, you can wrap context consumption inside `if` statements, guard clauses, or early returns.

### Code Example: Conditional Context Consumption

```tsx
import { use } from 'react';
import { ThemeContext } from './ThemeContext';
import { UserContext } from './UserContext';

interface ProfileProps {
  showDetails: boolean;
  userRole: 'admin' | 'guest';
}

export function ProfileCard({ showDetails, userRole }: ProfileProps) {
  // Early return - no context is read or subscribed to!
  if (!showDetails) {
    return <div>Minimal Preview</div>;
  }

  // ✅ Read ThemeContext conditionally inside an if statement
  const theme = use(ThemeContext);

  let adminSettings = null;
  if (userRole === 'admin') {
    // ✅ Read UserContext conditionally inside a nested block
    const user = use(UserContext);
    adminSettings = <span>Admin Access: {user.permissions}</span>;
  }

  return (
    <div className={`card-${theme}`}>
      {adminSettings}
    </div>
  );
}

```

### Key Differences: `useContext` vs. `use(Context)`

| Feature                 | `useContext(Context)`                      | `use(Context)`                                           |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------- |
| **Execution Placement** | Top-level of component only                | **Allowed in `if` statements, loops, and after returns** |
| **Subscription Cost**   | Subscribes on every render, even if unused | Subscribes **only when the branch executing `use` runs** |
| **Provider Lookup**     | Finds nearest provider above component     | Finds nearest provider above component                   |

---

## 2. Unwrapping Promises in Render

Passing a Promise to `use(promise)` tells React to **pause (suspend) component rendering** until the Promise resolves.

* **Pending:** Component suspends and hands rendering control over to the nearest `<Suspense>` fallback.
* **Resolved:** React resumes rendering and `use()` returns the unwrapped data value.
* **Rejected:** React throws the rejection error up to the nearest **Error Boundary**.

### Code Example: Conditional Promise Resolution & Suspense

```tsx
import { use, Suspense } from 'react';

// Promise created outside render or cached via framework (e.g. Next.js / React cache)
function UserDetails({ 
  userPromise, 
  loadExtraDetails 
}: { 
  userPromise: Promise<{ name: string; id: string }>;
  loadExtraDetails: boolean;
  extraDetailsPromise?: Promise<{ bio: string }>;
}) {
  // 1. Unwraps the primary user promise
  const user = use(userPromise);

  let bio = "No bio requested";
  
  // 2. ✅ Conditionally unwrap a secondary promise ONLY if requested!
  if (loadExtraDetails && extraDetailsPromise) {
    const extra = use(extraDetailsPromise);
    bio = extra.bio;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{bio}</p>
    </div>
  );
}

// Parent Wrapper with Suspense
export function App({ userPromise }: { userPromise: Promise<any> }) {
  return (
    <Suspense fallback={<div>Loading user profile...</div>}>
      <UserDetails userPromise={userPromise} loadExtraDetails={true} />
    </Suspense>
  );
}

```

---

## 3. Critical Rules & Common Pitfalls of `use(promise)`

While `use()` breaks the classic "Rules of Hooks," it introduces its own set of strict runtime constraints:

### Rule 1: Promises MUST Be Cached Across Renders

You **cannot** construct a new Promise directly inside the render body passed to `use()`.

```tsx
// ❌ WRONG: Creates a new Promise on EVERY render!
// Causes an infinite loop of Suspense fallbacks.
function BadComponent() {
  const data = use(fetch('/api/data').then(res => res.json())); 
}

// ✅ CORRECT: Promise created outside render, passed as prop, or cached via `cache()`
const cachedPromise = fetch('/api/data').then(res => res.json());

function GoodComponent({ dataPromise = cachedPromise }) {
  const data = use(dataPromise); // Reuses the exact same Promise instance across renders
}

```

### Rule 2: `use()` CANNOT Be Called Inside `try...catch` Blocks

Because `use(promise)` works under the hood by throwing a Promise exception to trigger Suspense, placing `use()` inside a standard `try...catch` block will accidentally catch React's internal Suspense trigger.

```tsx
// ❌ WRONG: Intercepts React's internal Suspense signal
function BadErrorHandling({ dataPromise }: { dataPromise: Promise<any> }) {
  try {
    const data = use(dataPromise); // Catches Suspense exception!
  } catch (err) {
    return <div>Error loading data</div>;
  }
}

// ✅ CORRECT: Handle promise rejection using an Error Boundary
<ErrorBoundary fallback={<div>Failed to load data</div>}>
  <Suspense fallback={<div>Loading...</div>}>
    <DataComponent dataPromise={dataPromise} />
  </Suspense>
</ErrorBoundary>

```

---

## Summary Matrix

| Metric                        | `useContext(Context)` | `use(Context)`       | `use(Promise)`                                     |
| ----------------------------- | --------------------- | -------------------- | -------------------------------------------------- |
| **Input Resource**            | React Context Object  | React Context Object | JavaScript `Promise` instance                      |
| **Can Be Conditional (`if`)** | ❌ No                  | ✅ **Yes**            | ✅ **Yes**                                          |
| **Can Be in Loops (`for`)**   | ❌ No                  | ✅ **Yes**            | ✅ **Yes**                                          |
| **Suspense Integration**      | N/A                   | N/A                  | ✅ **Triggers `<Suspense>` fallback** while pending |
| **Error Handling**            | N/A                   | N/A                  | Triggered via **Error Boundaries** on rejection    |
