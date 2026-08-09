Here is a breakdown of how **Component Functions**, **Class Components**, **State**, and **Props** relate to each other in React.

---

## 1. Component Functions vs. Class Components

In React, components define the UI. You can write them as **Functions** (the modern standard) or **Classes** (legacy).

| Feature                      | Function Components (Modern)             | Class Components (Legacy)                                      |
| ---------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| **Syntax**                   | Plain JavaScript function returning JSX. | JS Class extending `React.Component` with a `render()` method. |
| **State Management**         | Handled via the **`useState`** hook.     | Handled via `this.state` and `this.setState()`.                |
| **Side Effects / Lifecycle** | Handled via the **`useEffect`** hook.    | Handled via lifecycle methods (`componentDidMount`, etc.).     |
| **Boilerplate**              | Clean, minimal, and easier to read.      | Verbose; requires managing the `this` keyword.                 |

### Code Comparison

```tsx
// ✅ Modern Function Component
import { useState } from 'react';

function FunctionalCounter({ initialCount }) {
  const [count, setCount] = useState(initialCount);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

```

```tsx
// ⚠️ Legacy Class Component
import React, { Component } from 'react';

class ClassCounter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
  }

  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Count: {this.state.count}
      </button>
    );
  }
}

```

---

## 2. State vs. Props

Both **State** and **Props** hold data that determines what a component renders, but they serve completely different roles regarding data ownership and mutability.

| Characteristic       | Props (Properties)                                                             | State                                                                                       |
| -------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Definition**       | Data passed **into** a component from its parent.                              | Data owned and managed **inside** the component.                                            |
| **Ownership**        | Owned by the Parent component.                                                 | Owned by the component itself.                                                              |
| **Mutability**       | **Read-Only (Immutable)** — A child component must never modify its own props. | **Mutable** via update function (`setCount` or `setState`).                                 |
| **Purpose**          | Configures a component or passes down callbacks.                               | Tracks interactive data that changes over time (e.g., inputs, toggles, loading indicators). |
| **Re-render Effect** | Changing props causes the child component to re-render.                        | Updating state triggers a re-render of the component.                                       |

---

## Visualizing Props vs. State

```
┌─────────────────────────────────────────────────────────────┐
│ PARENT COMPONENT                                            │
│   const [theme, setTheme] = useState('dark');  <-- State    │
│                                                             │
│   // Passes data DOWN as a PROP                             │
│   <ChildComponent theme={theme} />                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ CHILD COMPONENT                                             │
│   function ChildComponent(props) {                          │
│     // props.theme is Read-Only here!                       │
│     const [count, setCount] = useState(0);     <-- State    │
│     return <div>{props.theme} - {count}</div>;              │
│   }                                                         │
└─────────────────────────────────────────────────────────────┘

```

---

## Summary Rules

1. **Use Function Components** for all new React code.
2. **Use Props** when you want to pass configuration, data, or callbacks **down** from a parent component to a child.
3. **Use State** when a component needs to remember data that **changes over time as a result of user interaction** (like input text, open/close toggles, or data fetched from an API).
