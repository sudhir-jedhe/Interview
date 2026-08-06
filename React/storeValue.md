In React, choosing the right way to store values depends on **where** the data needs to be accessed, **how often** it changes, and whether changes should **trigger a UI re-render**.

Here is a breakdown of the primary ways to store values in React:

---

### 1. Local Component State (`useState`)

Used for values that are local to a specific component and **must trigger a re-render** when updated (e.g., input fields, toggles, counters).

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

```

* **Re-renders UI?** Yes.
* **Persists across re-renders?** Yes.
* **Resets on unmount?** Yes.

---

### 2. Mutable References (`useRef`)

Used for storing values that need to persist across re-renders **without triggering a re-render** when changed. Common for DOM element references, timer IDs, or tracking previous values.

```tsx
import { useRef } from 'react';

function Timer() {
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    timerId.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
  };

  return <button onClick={startTimer}>Start Timer</button>;
}

```

* **Re-renders UI?** No.
* **Persists across re-renders?** Yes.
* **Resets on unmount?** Yes.

---

### 3. Complex Local State (`useReducer`)

An alternative to `useState` for managing complex state logic involving multiple sub-values or next-state calculations dependent on previous states (e.g., forms, multi-step wizards).

```tsx
import { useReducer } from 'react';

function reducer(state: { count: number }, action: { type: 'inc' | 'dec' }) {
  switch (action.type) {
    case 'inc': return { count: state.count + 1 };
    case 'dec': return { count: state.count - 1 };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return <button onClick={() => dispatch({ type: 'inc' })}>{state.count}</button>;
}

```

* **Re-renders UI?** Yes.
* **Persists across re-renders?** Yes.
* **Resets on unmount?** Yes.

---

### 4. Context API (`useContext`)

Used for passing values down the component tree **without prop drilling** (e.g., current theme, logged-in user details, active locale).

```tsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div>Current Theme: {theme}</div>;
}

```

* **Re-renders UI?** Yes (re-renders all consuming components when value changes).
* **Scope:** Shared across a wrapped component subtree.

---

### 5. Global Client State Libraries (Zustand, Redux Toolkit)

Used for managing complex global state accessed across completely unrelated components or pages (e.g., shopping cart, active modal popups, user permissions).

```tsx
// Example using Zustand
import { create } from 'zustand';

const useCartStore = create((set) => ({
  cartCount: 0,
  addToCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
}));

function AddButton() {
  const addToCart = useCartStore((state) => state.addToCart);
  return <button onClick={addToCart}>Add to Cart</button>;
}

```

* **Re-renders UI?** Yes (only components subscribing to the changed state slice).
* **Persists across routes?** Yes (entire SPA session).

---

### 6. Server State Caching (TanStack Query / SWR)

Used for managing remote API data, caching, loading/error states, and background refetching. Avoid storing raw API responses in `useState` or Redux.

```tsx
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}

```

* **Re-renders UI?** Yes.
* **Persists?** Cached in memory according to `staleTime`/`gcTime`.

---

### 7. Persistent Browser Storage (`localStorage` / `sessionStorage` / Cookies)

Used to store data that must survive page refreshes or browser restarts (e.g., auth tokens, theme preferences, draft inputs).

```tsx
// Reading initial value from localStorage safely
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('app_theme') || 'light';
});

// Syncing state changes to localStorage
const toggleTheme = (newTheme: string) => {
  setTheme(newTheme);
  localStorage.setItem('app_theme', newTheme);
};

```

* **Re-renders UI?** Reading/writing to browser storage alone does **not** trigger re-renders; sync it with React state or custom hooks.
* **Persists across refreshes?** Yes (`localStorage` survives browser restarts; `sessionStorage` survives tab refreshes).

---

### 8. URL Parameters & Search Params (`useSearchParams`)

Used for state that should be bookmarkable or shareable via links (e.g., search queries, active tab, table filters, pagination numbers).

```tsx
import { useSearchParams } from 'react-router-dom';

function FilterableList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <input
      value={query}
      onChange={(e) => setSearchParams({ q: e.target.value })}
    />
  );
}

```

* **Re-renders UI?** Yes (triggers route updates).
* **Persists?** Yes, embedded in the URL.

---

### Quick Comparison Matrix

| Storage Mechanism     | Triggers Re-render? | Persists Across Re-renders? | Best Used For                                |
| --------------------- | ------------------- | --------------------------- | -------------------------------------------- |
| **`useState`**        | Yes                 | Yes                         | Local component UI state (modals, inputs)    |
| **`useRef`**          | **No**              | Yes                         | Timers, DOM node refs, previous values       |
| **`useReducer`**      | Yes                 | Yes                         | Complex multi-step local state logic         |
| **Context API**       | Yes                 | Yes                         | Theme, current user, tree-scoped settings    |
| **Zustand / Redux**   | Yes                 | Yes                         | Global app state across unrelated views      |
| **TanStack Query**    | Yes                 | Cached                      | API server responses & caching               |
| **`localStorage`**    | No (manual)         | Yes (Hard)                  | Auth tokens, persisted user preferences      |
| **URL Search Params** | Yes                 | Yes (in URL)                | Search queries, active filters, page numbers |
