**`useMemo`** is a built-in React Hook that **caches (memoizes) the calculated result of a function** between component re-renders.

While `useCallback` caches a *function instance*, `useMemo` caches the *return value* of a function calculation.

---

## 1. Syntax

```tsx
const cachedValue = useMemo(calculateValue, dependencies);

```

* **`calculateValue`**: A pure function with no arguments that performs the computation and returns a value.
* **`dependencies`**: An array of reactive values (props, state, or variables declared in the component) referenced inside `calculateValue`.
* **Returns**: The cached result on initial render. On subsequent renders, React returns the cached value unless one of the `dependencies` changes.

---

## 2. Primary Use Cases

### Case 1: Skipping Expensive Calculations

If you have a computationally heavy operation (e.g., sorting 10,000 items or running complex data transformations), running it on every render can freeze the UI when unrelated state changes.

#### ❌ Without `useMemo`

```tsx
function ItemList({ items, filterText }: { items: Item[]; filterText: string }) {
  const [theme, setTheme] = useState('light');

  // ❌ Runs on EVERY single render, even when toggling `theme`!
  const visibleItems = filterHeavyList(items, filterText);

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <List items={visibleItems} />
    </div>
  );
}

```

#### ✅ With `useMemo`

```tsx
import { useState, useMemo } from 'react';

function ItemList({ items, filterText }: { items: Item[]; filterText: string }) {
  const [theme, setTheme] = useState('light');

  // ✅ Re-runs ONLY when `items` or `filterText` changes.
  // Toggling `theme` returns the cached list instantly!
  const visibleItems = useMemo(() => {
    return filterHeavyList(items, filterText);
  }, [items, filterText]);

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <List items={visibleItems} />
    </div>
  );
}

```

---

### Case 2: Preserving Referential Equality to Prevent Child Re-renders

In JavaScript, `{}` or `[]` creates a brand new memory reference on every render. If you pass an object or array to a child wrapped in `React.memo` (or to a `useEffect` dependency array), the reference change triggers unnecessary re-renders or effect runs.

```tsx
import React, { useState, useMemo } from 'react';

const UserCard = React.memo(({ config }: { config: { role: string; active: boolean } }) => {
  console.log('UserCard rendered!');
  return <div>Role: {config.role}</div>;
});

export function Dashboard({ role }: { role: string }) {
  const [count, setCount] = useState(0);

  // ✅ Keeps the same object reference in memory unless `role` changes
  const config = useMemo(() => {
    return { role, active: true };
  }, [role]);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {/* UserCard will NOT re-render when clicking the count button! */}
      <UserCard config={config} />
    </div>
  );
}

```

---

## 3. `useMemo` vs `useCallback`

Both hooks rely on dependency arrays to manage caching, but they store different targets:

| Hook              | What it Caches                        | Equivalency                                                       |
| ----------------- | ------------------------------------- | ----------------------------------------------------------------- |
| **`useMemo`**     | The **return value** of a calculation | `useMemo(() => fn(), deps)`                                       |
| **`useCallback`** | The **function itself**               | `useCallback(fn, deps)` is identical to `useMemo(() => fn, deps)` |

---

## 4. When Should You Use (and Avoid) `useMemo`?

### Skip `useMemo` for

1. **Trivial operations:** Basic operations like array mapping over small arrays (<100 items), string concatenation, or simple math take less than 1ms. `useMemo` adds memory and comparison overhead that can be slower than the calculation itself.
2. **Every variable in your component:** Overusing `useMemo` pollutes code readability and increases memory usage.

### Use `useMemo` when

1. Measuring execution time shows a noticeable delay (e.g., filtering thousands of items or transforming deep JSON trees).
2. You pass an object/array as a prop to a child wrapped in `React.memo`.
3. You pass an object/array into a dependency array of `useEffect`, `useCallback`, or another `useMemo`.

Before wrapping calculations in `useMemo`, you should quantify whether the computation is actually causing a frame drop or performance bottleneck. As a general rule, an operation should take **> 1ms** (or run repeatedly over large datasets) to justify the memory overhead and dependency tracking of `useMemo`.

Here are the two primary ways to measure calculation performance in React.

---

## Method 1: Using `console.time` / `performance.now()`

The most direct way to measure a specific function's execution time is using `performance.now()` or `console.time()` inside your component or utility functions.

### Example: Benchmarking a Calculation

```tsx
import React, { useState, useMemo } from 'react';

// Simulated heavy calculation (e.g., sorting/filtering 50,000 items)
function expensiveFilter(items: string[], query: string) {
  // Start timing
  const start = performance.now();

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  // End timing
  const end = performance.now();
  const duration = end - start;

  // Log execution time with visual warning if > 1ms
  if (duration > 1) {
    console.warn(`[Heavy Calc] expensiveFilter took ${duration.toFixed(2)} ms`);
  } else {
    console.log(`[Fast Calc] expensiveFilter took ${duration.toFixed(2)} ms`);
  }

  return filtered;
}

export function FilterList({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(0);

  // --- BENCHMARKING WITHOUT useMemo FIRST ---
  // Every time `count` changes, this function runs.
  // Check your browser console to see the execution duration in ms!
  const filteredItems = expensiveFilter(items, query);

  // --- BENCHMARKING WITH useMemo SECOND ---
  /*
  const filteredItems = useMemo(() => {
    return expensiveFilter(items, query);
  }, [items, query]);
  */

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>
        Unrelated Counter: {count}
      </button>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Results: {filteredItems.length}</p>
    </div>
  );
}

```

### How to interpret the logs

1. Click the **Unrelated Counter** button multiple times while watching the DevTools Console.
2. If `expensiveFilter took 0.05 ms`, **do not use `useMemo**`. The memory and dependency-checking overhead of `useMemo` costs more than the calculation itself.
3. If `expensiveFilter took 12.40 ms`, **use `useMemo**`. Re-running a 12ms operation on every render will cause noticeable UI stuttering (12ms eats up almost the entire 16.6ms frame budget for 60fps rendering).

---

## Method 2: Using React `<Profiler>` Component

React provides a built-in `<Profiler>` component that measures how long a subtree takes to render and *why* it rendered.

### Example: Profiling Render Duration

```tsx
import React, { useState, Profiler, ProfilerOnRenderCallback } from 'react';

// Callback function executed on every render of the profiled subtree
const onRenderCallback: ProfilerOnRenderCallback = (
  id, // The "id" prop of the Profiler tree
  phase, // "mount" (initial render) or "update" (re-render)
  actualDuration, // Time spent rendering the committed update
  baseDuration, // Estimated time to render the entire subtree without memoization
  startTime, // When React began rendering this update
  commitTime // When React committed this update
) => {
  console.log(`[Profiler - ${id}] Phase: ${phase}`);
  console.log(`Actual Duration: ${actualDuration.toFixed(2)} ms`);
  console.log(`Base Duration: ${baseDuration.toFixed(2)} ms`);
};

export function PerformanceTestApp({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light');

  return (
    <div>
      <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
        Toggle Theme ({theme})
      </button>

      {/* Wrap the component you want to measure in <Profiler> */}
      <Profiler id="FilteredListSubtree" onRender={onRenderCallback}>
        <DataList items={items} query={query} />
      </Profiler>
    </div>
  );
}

function DataList({ items, query }: { items: string[]; query: string }) {
  // Heavy computation without memoization
  const processedData = items.filter((item) => item.includes(query));

  return (
    <ul>
      {processedData.slice(0, 10).map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

```

---

## Method 3: Using Chrome DevTools & React Developer Tools

For visual analysis across your entire application without adding benchmark code:

1. **Install React Developer Tools Extension** in Chrome/Firefox.
2. Open DevTools and navigate to the **⚛️ Profiler** tab.
3. Click the **Record (●)** button.
4. Perform interactions in your app (e.g., click buttons, type in inputs).
5. Stop recording and inspect the **Flamegraph**:

* **Yellow/Orange bars:** Components that took a long time to render.
* **Green bars:** Fast components.
* **Grey bars:** Components that were skipped or did not re-render.

---

## The Rule of Thumb Decision Matrix

| Measured Duration | Action Required                          | Reason                                                                                                                    |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **< 1 ms**        | ❌ **Do NOT use `useMemo**`               | The operation is near-instant. Adding `useMemo` increases memory consumption and dependency array checking cost.          |
| **1 ms – 10 ms**  | ⚠️ **Use `useMemo` if called frequently** | Acceptable for occasional renders, but will drop frames if triggered by high-frequency events (like scrolling or typing). |
| **> 16 ms**       | ✅ **Use `useMemo` immediately**          | Exceeds the 16.6ms threshold required to maintain 60 FPS animation smoothness, causing visible UI lag.                    |

Explain how the React Compiler auto-memoizes components and removes the need for useMemo and useCallback.

The **React Compiler** (originally codenamed React Forget) is an optimizing compiler for React that automatically handles memoization at build time.

By analyzing your code with strict JavaScript and React rules, the compiler automatically inserts fine-grained memoization into component render outputs, eliminating the need to manually write `useMemo`, `useCallback`, or `React.memo`.

---

## The Problem: Manual Memoization Overhead

Before React 19 and the React Compiler, developers had to manually optimize performance by wrapping functions, calculations, and components in memoization hooks:

```tsx
// ❌ Traditional Manual Approach (Verbose & Error-Prone)
function UserList({ users, filterQuery, onSelectUser }) {
  // 1. Manual useMemo for calculations
  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.name.includes(filterQuery));
  }, [users, filterQuery]);

  // 2. Manual useCallback for functions
  const handleSelect = useCallback(
    (id) => {
      onSelectUser(id);
    },
    [onSelectUser]
  );

  return <List items={filteredUsers} onItemClick={handleSelect} />;
}

```

### Why Manual Memoization Failed

* **Developer Overhead:** Developers constantly had to decide *what* and *when* to memoize.
* **Dependency Array Bugs:** Missing dependencies led to subtle stale closure bugs, while extra dependencies broke memoization.
* **Coarse Granularity:** `useMemo` and `useCallback` only memoized individual variables or functions—not the actual rendering steps or JSX elements.

---

## How the React Compiler Works

Instead of relying on developer annotations, the React Compiler compiles your standard React code into an optimized form using **auto-generated reactive caches** (often represented as an internal `$[]` cache array).

It analyzes data flow and dependencies across your entire component function and memoizes:

1. **Values and expressions** (replacing `useMemo`).
2. **Function references** (replacing `useCallback`).
3. **JSX element trees** (replacing `React.memo`).

### 1. Source Code You Write

You write clean, idiomatic React without any manual memoization hooks:

```tsx
// ✅ You write clean JavaScript/React
function UserList({ users, filterQuery, onSelectUser }) {
  const filteredUsers = users.filter((u) => u.name.includes(filterQuery));

  const handleSelect = (id) => {
    onSelectUser(id);
  };

  return <List items={filteredUsers} onItemClick={handleSelect} />;
}

```

### 2. What the Compiler Generates (Mental Model)

At build time (via Babel or Vite plugins), the compiler transforms your code into something similar to this underlying structure:

```js
// ⚙️ Compiled Output (Simplified Conceptual Representation)
function UserList(props) {
  const $ = useMemoCache(8); // Allocates a fine-grained internal cache slot
  const { users, filterQuery, onSelectUser } = props;

  // Cache filteredUsers: re-calculate ONLY if users or filterQuery changes
  let filteredUsers;
  if ($[0] !== users || $[1] !== filterQuery) {
    filteredUsers = users.filter((u) => u.name.includes(filterQuery));
    $[0] = users;
    $[1] = filterQuery;
    $[2] = filteredUsers;
  } else {
    filteredUsers = $[2];
  }

  // Cache handleSelect callback: recreate ONLY if onSelectUser changes
  let handleSelect;
  if ($[3] !== onSelectUser) {
    handleSelect = (id) => {
      onSelectUser(id);
    };
    $[3] = onSelectUser;
    $[4] = handleSelect;
  } else {
    handleSelect = $[4];
  }

  // Cache the rendered JSX element tree!
  let jsx;
  if ($[5] !== filteredUsers || $[6] !== handleSelect) {
    jsx = <List items={filteredUsers} onItemClick={handleSelect} />;
    $[5] = filteredUsers;
    $[6] = handleSelect;
    $[7] = jsx;
  } else {
    jsx = $[7];
  }

  return jsx;
}

```

---

## Key Advantages of the React Compiler

### 1. Fine-Grained Value & JSX Memoization

Unlike `React.memo` (which checks if an entire component's props changed), the React Compiler memoizes individual JSX nodes and expressions. If only 1 out of 5 sub-elements in a component needs updating, React skips re-creating the other 4 elements entirely.

### 2. Automatic Dependency Inference

The compiler performs static analysis to automatically infer dependencies. It never misses a dependency or includes unnecessary ones, eliminating stale closure bugs.

### 3. Progressive Adoption

The React Compiler runs during your build step (e.g., Babel/Vite/Next.js build) and works alongside existing legacy `useMemo` and `useCallback` calls. You don't need to rewrite existing codebases to start using it.

---

## Rules the Compiler Enforces (Rules of React)

For the compiler to safely optimize your components, your code must strictly adhere to the **Rules of React**:

1. **Components must be pure:** Given the same inputs (props, state, context), a component should always return the same JSX.
2. **No mutation of existing props/state:** Never directly mutate props or state objects (e.g., `props.user.name = 'Alex'`). Use immutable updates instead.
3. **No side effects in render:** Side effects (like DOM mutations, network requests, or timers) must live in event handlers or `useEffect`, not during the component render phase.

---

## Comparison Summary

| Metric                 | Manual Memoization (React 18 & Earlier)                                   | React Compiler                                                   |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Developer DX**       | Heavy boilerplate (`useMemo`, `useCallback`, `React.memo`).               | Clean, standard JavaScript syntax.                               |
| **Bug Risk**           | High (incorrect dependency arrays cause stale closures or broken caches). | Zero (compiler infers exact dependency tree).                    |
| **Optimization Scope** | Coarse-grained (manual variables and top-level components).               | Fine-grained (individual expressions, functions, and JSX slots). |
| **Runtime Overhead**   | Manual Hook calls and dependency checking in runtime.                     | Optimized, low-overhead index-based caching (`useMemoCache`).    |
