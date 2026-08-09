**No, you must never call React Hooks inside conditions (`if`/`else`), loops (`for`/`while`), or nested functions.**

Hooks must **always be called at the top level** of your React component (or custom Hook), before any early returns.

---

## Why Is This Mandatory? (Rules of Hooks)

React relies on the **order in which Hooks are called** to track component state across re-renders.

React does **not** identify Hook state by name or key. Instead, internally, React keeps an array/linked list of state memory cells for each component instance. Every time a component renders, React reads these memory cells by stepping through them in **exact sequential index order** (Index 0, Index 1, Index 2...).

### What Happens If You Put a Hook Inside a Condition?

```tsx
// ❌ BROKEN: Conditional Hook call alters the sequence!
function UserProfile({ isLoggedIn }: { isLoggedIn: boolean }) {
  // Hook 0: Always called first
  const [theme, setTheme] = useState('dark');

  // Hook 1: Conditionally called!
  if (isLoggedIn) {
    useEffect(() => {
      fetchUserData();
    }, []);
  }

  // Hook 2 (or Hook 1?): Order breaks!
  const [count, setCount] = useState(0);

  return <div>...</div>;
}

```

* **Render 1 (`isLoggedIn = true`):**
* Hook 0 ➔ `useState('dark')` (Index 0)
* Hook 1 ➔ `useEffect(...)` (Index 1)
* Hook 2 ➔ `useState(0)` (Index 2)

* **Render 2 (`isLoggedIn = false`):**
* Hook 0 ➔ `useState('dark')` (Index 0)
* Hook 1 ➔ `useState(0)` (React matches this against Index 1, which was previously `useEffect`!) 💥 **React state breaks or crashes!**

---

## Where and When Can You Use Hooks?

### ✅ DO Call Hooks

1. **At the top level of React Function Components.**
2. **At the top level of Custom Hooks** (functions named `useSomething`).

```tsx
// ✅ CORRECT: Top-level declaration
function UserProfile({ isLoggedIn }: { isLoggedIn: boolean }) {
  // 1. All hooks declared at the very top
  const [theme, setTheme] = useState('dark');
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Put condition INSIDE the hook, not around the hook!
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  // 2. Early returns can happen AFTER hooks
  if (!isLoggedIn) {
    return <p>Please log in.</p>;
  }

  return <div>Welcome!</div>;
}

```

### ❌ DO NOT Call Hooks

* Inside `if` / `else` conditions.
* Inside `for`, `while`, or `.map()` loops.
* Inside event handlers (`onClick`, `onSubmit`).
* Inside class components.
* Inside standard JavaScript utility functions.

---

## How to Handle Conditional or Looped Logic Correctly

### 1. Conditional Side Effects

Instead of placing `useEffect` inside a condition, **place the condition inside the `useEffect` body**:

```tsx
// ❌ WRONG
if (shouldFetch) {
  useEffect(() => { fetchApi(); }, []);
}

// ✅ CORRECT
useEffect(() => {
  if (shouldFetch) {
    fetchApi();
  }
}, [shouldFetch]);

```

### 2. Conditional Hooks with React Query / Custom Fetching

If you use data-fetching hooks like `@tanstack/react-query`, use the `enabled` option instead of conditionally rendering the hook:

```tsx
// ✅ CORRECT: Controlled via hook options
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: Boolean(userId), // Skips execution if userId is undefined
});

```

### 3. Dynamic Lists / Loops

If you need state or effects for multiple items in a list, **extract each item into its own child component**:

```tsx
// ❌ WRONG: Calling useState inside a loop
function TodoList({ items }: { items: string[] }) {
  return items.map((item) => {
    const [checked, setChecked] = useState(false); // 💥 BANNED!
    return <li key={item}>{item}</li>;
  });
}

// ✅ CORRECT: Extract to a separate child component
function TodoItem({ item }: { item: string }) {
  const [checked, setChecked] = useState(false); // ✅ Top-level inside child
  return <li>{item}</li>;
}

function TodoList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <TodoItem key={item} item={item} />
      ))}
    </ul>
  );
}

```
