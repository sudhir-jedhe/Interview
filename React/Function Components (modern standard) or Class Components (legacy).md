In React, components can be written using either **Function Components** (modern standard) or **Class Components** (legacy).

Since React 16.8 (2019), **Function Components with Hooks are the industry standard** and recommended for all new React codebases.

---

## Key Differences At a Glance

| Feature                      | Function Component (Modern)                                       | Class Component (Legacy)                                                         |
| ---------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Syntax**                   | Plain JavaScript function (or arrow function) returning JSX.      | ES6 Class extending `React.Component` with a `render()` method.                  |
| **State Management**         | Handled via **`useState`** / **`useReducer`** Hooks.              | Handled via `this.state` object and `this.setState()` method.                    |
| **Side Effects / Lifecycle** | Handled via **`useEffect`** / **`useLayoutEffect`** Hooks.        | Handled via lifecycle methods (`componentDidMount`, `componentDidUpdate`, etc.). |
| **Boilerplate Code**         | Concise, concise syntax, minimal lines of code.                   | Verbose; requires `constructor`, `this` binding, and extended class boilerplate. |
| **Performance**              | Slightly better memory footprint (no class instance allocations). | Requires instantiating class objects in memory.                                  |
| **Error Boundaries**         | Not directly supported as a hook (requires class fallback).       | Supported natively via `componentDidCatch` and `getDerivedStateFromError`.       |

---

## Code Comparison

Here is how both types of components implement a simple counter with an automated document title update.

### 1. Function Component (Modern React with Hooks)

```tsx
import React, { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  // Replaces componentDidMount AND componentDidUpdate
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

```

### 2. Class Component (Legacy ES6 Class)

```tsx
import React, { Component } from 'react';

interface State {
  count: number;
}

export class Counter extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    // 1. Initializing state
    this.state = { count: 0 };
  }

  // 2. Lifecycle method for initial mount
  componentDidMount() {
    document.title = `Count: ${this.state.count}`;
  }

  // 3. Lifecycle method for state updates
  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`;
  }

  // Event handler requiring function binding or arrow function
  handleIncrement = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleIncrement}>
          Increment
        </button>
      </div>
    );
  }
}

```

---

## Detailed Comparison

### 1. Syntax & Readability

* **Function Components:** Pure JavaScript functions that take `props` as arguments and return JSX directly. They don't require `this` references or class instantiations.
* **Class Components:** Require extending `React.Component`, defining a `render()` method, and managing the `this` execution context (which often leads to bugs if event handlers are not properly bound).

### 2. State Management

* **Function Components:** Use the `useState` or `useReducer` hooks. State values are independent and updated individually.
* **Class Components:** State is always a single combined object (`this.state`). Updating state requires `this.setState()`, which performs a shallow merge of the new state into the old state object.

### 3. Lifecycle vs. Side Effects

* **Function Components:** `useEffect` unifies mounting, updating, and unmounting into a single declarative API. You group side-effect code by what it *does* rather than when it *fires*.
* **Class Components:** Code is split across imperative lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`). Related logic (e.g., setting up and removing a event listener) must be split into two separate methods.

---

## When Should You Use Class Components?

You almost **never** need to write new Class Components today, with two exceptions:

1. **Error Boundaries:** React does not yet have a hook equivalent for `componentDidCatch` or `getDerivedStateFromError`. Building an Error Boundary still requires a class component.
2. **Maintaining Legacy Codebases:** Working in older React codebases created before React 16.8.

---

## Summary Recommendation

Always default to **Function Components with Hooks**. They produce cleaner, more composable code that works seamlessly with modern React features like **Server Components**, **Concurrent Mode**, and **Custom Hooks**.
