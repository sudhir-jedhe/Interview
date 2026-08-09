In React, both **`state`** and **`props`** are plain JavaScript objects used to hold data that controls what a component renders, but they serve completely different purposes.

The simplest way to remember the difference is:

* **`props`** are passed **to** a component (like function arguments from a parent).
* **`state`** is managed **within** a component (like local variables inside a function).

---

## What are Props?

**`props`** (short for "properties") are read-only data passed down from a parent component to a child component. They allow components to be reusable and dynamic.

* **Read-Only (Immutable):** A child component must **never** modify its own props. If the props need to change, the parent component must pass new values down.

```tsx
// Parent Component
function Parent() {
  return <Greeting name="Sudhir" role="Developer" />;
}

// Child Component receiving props
function Greeting({ name, role }: { name: string; role: string }) {
  return <h1>Hello, {name}! Role: {role}</h1>;
}

```

---

## What is State?

**`state`** is a component's private, local memory. It holds data that changes over time, usually in response to user interactions (clicks, form inputs, toggles) or network requests.

* **Mutable (via Setter):** State is modified inside the component using setter functions (like `useState` or `useReducer`).
* **Triggers Re-render:** Whenever state updates, React automatically re-renders the component to reflect the new state in the UI.

```tsx
import { useState } from 'react';

function Counter() {
  // Local state variable 'count' and setter 'setCount'
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

```

---

## State vs Props: Side-by-Side Comparison

| Feature                 | `props`                                                   | `state`                                                   |
| ----------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| **Definition**          | Data passed into a component from its parent.             | Data managed locally within a component.                  |
| **Ownership**           | Owned and controlled by the **parent component**.         | Owned and controlled by the **component itself**.         |
| **Mutability**          | **Immutable** (Read-only inside the receiving component). | **Mutable** (Updated via `setState` / `useState` setter). |
| **Modification Method** | Cannot be modified by the receiver.                       | Updated using `setCount(newValue)` or `this.setState()`.  |
| **Initial Values**      | Set by the parent component when rendering the child.     | Initialized inside the component (e.g., `useState(0)`).   |
| **Re-rendering**        | Changes in incoming props trigger a child re-render.      | Changes in local state trigger a component re-render.     |
| **Usage**               | Passing configuration, event callbacks, or static data.   | Handling dynamic UI state, form inputs, modals, toggles.  |

---

## How State and Props Work Together

A parent component often holds **state** and passes it down to a child component as **props**. The parent can also pass down a function as a prop so the child can request state changes in the parent ("lifting state up").

```tsx
import { useState } from 'react';

// Parent Component
export function ParentDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div style={{ background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
      {/* Passing state value AND state update function as props */}
      <ThemeToggleButton isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
    </div>
  );
}

// Child Component receiving props
function ThemeToggleButton({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}>
      Switch to {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}

```

---

## Summary Rule of Thumb

* Use **`props`** to configure a component or pass data/callbacks down the tree.
* Use **`state`** for data that changes over time due to user interaction or async operations.
