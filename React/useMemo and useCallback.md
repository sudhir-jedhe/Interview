In React, `useMemo` and `useCallback` are both hooks that optimize performance by preventing unnecessary recalculations or re-creations of values and functions. While they serve similar purposes, they are used in different situations.

Here’s a detailed explanation of both:

### **1. `useMemo`**

`useMemo` is a hook that memoizes a computed value. It caches the result of a function call and returns the cached result unless one of the dependencies changes. It’s primarily used to optimize **expensive computations** by recalculating the result only when necessary.

#### **Syntax:**

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- **First argument**: A function that returns the value to be memoized (e.g., the result of a calculation or a transformation).
- **Second argument**: An array of dependencies that determines when the memoized value should be recomputed. If any of these dependencies change, the memoized value is recalculated.

#### **Use case:**

- When you have an expensive function or calculation, and you want to avoid recomputing it unless its dependencies change.

#### **Example:**

```javascript
import React, { useMemo, useState } from "react";

function ExpensiveComponent() {
  const [input, setInput] = useState(0);

  // Expensive calculation
  const expensiveValue = useMemo(() => {
    console.log("Computing expensive value...");
    return input * 1000;
  }, [input]);

  return (
    <div>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={() => setInput(input + 1)}>Increase</button>
    </div>
  );
}
```

In this example, `expensiveValue` will only be recomputed when the `input` state changes. If the `input` state doesn't change, the cached value is used, and the expensive calculation is skipped.

### **2. `useCallback`**

`useCallback` is similar to `useMemo`, but instead of memoizing a value, it memoizes a **function**. It returns a memoized version of the callback function that only changes if one of its dependencies has changed.

#### **Syntax:**

```javascript
const memoizedCallback = useCallback(() => {
  // function logic
}, [dependencies]);
```

- **First argument**: A function that you want to memoize.
- **Second argument**: An array of dependencies. The memoized function is recreated only if one of the dependencies changes.

#### **Use case:**

- When you pass a function down to a child component as a prop, and you want to prevent unnecessary re-renders of the child component by ensuring the function reference remains the same unless its dependencies change.

#### **Example:**

```javascript
import React, { useCallback, useState } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);

  // Memoizing the function to prevent unnecessary re-renders in ChildComponent
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]); // Only recreates the function when `count` changes

  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  );
}

function ChildComponent({ onClick }) {
  console.log("ChildComponent rendered");
  return <button onClick={onClick}>Increment</button>;
}
```

In this example, `handleClick` is memoized using `useCallback`. This ensures that the function reference passed to `ChildComponent` doesn't change on every render, which prevents unnecessary re-renders of `ChildComponent` unless `count` changes.

### **Key Differences Between `useMemo` and `useCallback`**

| Feature               | **`useMemo`**                                             | **`useCallback`**                                                   |
| --------------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| **Purpose**           | Memoizes a **value** (the result of a computation)        | Memoizes a **function** (a callback function)                       |
| **What it optimizes** | Expensive calculations or derived values                  | Function reference stability (to prevent unnecessary re-renders)    |
| **Return value**      | Memoized **value**                                        | Memoized **function**                                               |
| **When to use**       | When you want to prevent re-computation of a value        | When passing a function to child components to prevent re-creations |
| **Common use case**   | Expensive calculations that depend on some state or props | Event handlers or callback functions passed to child components     |

### **When to Use `useMemo` vs. `useCallback`**

- **Use `useMemo`** when you have an expensive calculation that you want to avoid recalculating unless the dependencies change. This is useful for cases like:
  - Expensive mathematical calculations.
  - Transforming large arrays or objects.
  - Filtering or sorting large data sets.
- **Use `useCallback`** when you are passing a function to child components and you want to prevent unnecessary re-renders. This ensures the function reference stays the same unless its dependencies change. It's especially helpful when passing functions as props to child components that are optimized with `React.memo` or `PureComponent`.

### **Example of Both in Action**

Here’s a scenario where both `useMemo` and `useCallback` can be used together:

```javascript
import React, { useState, useMemo, useCallback } from "react";

function ExpensiveComponent() {
  const [input, setInput] = useState(0);

  // Expensive calculation memoized
  const expensiveValue = useMemo(() => {
    console.log("Computing expensive value...");
    return input * 1000;
  }, [input]);

  // Memoized callback function
  const handleClick = useCallback(() => {
    setInput((prevInput) => prevInput + 1);
  }, []); // No dependencies, function won't change unless explicitly required

  return (
    <div>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={handleClick}>Increase Input</button>
    </div>
  );
}
```

In this example:

- `useMemo` memoizes the result of the expensive calculation (`expensiveValue`), ensuring it’s recalculated only when `input` changes.
- `useCallback` memoizes the `handleClick` function, ensuring it’s not re-created on every render of the `ExpensiveComponent`.

### **Conclusion**

- **`useMemo`**: Used to **memoize values** and optimize expensive calculations.
- **`useCallback`**: Used to **memoize functions** and prevent unnecessary re-renders of components that rely on functions as props.

While both hooks are related to performance optimization, they target different aspects of your app—`useMemo` is for values, and `useCallback` is for functions. They are often used together in scenarios where both computation and function stability are important.

**`React.memo`** is a Higher-Order Component (HOC) used to optimize rendering performance in functional components.

By default, when a parent component re-renders, React automatically re-renders **all of its child components**, regardless of whether their props changed. Wrapping a child component in `React.memo` forces React to skip rendering that child if its incoming props are identical to those from the previous render.

---

## How `React.memo` Works Under the Hood

When React renders a component wrapped in `React.memo`, it performs a **shallow comparison** (`Object.is`) between the previous props object and the new props object:

1. **Primitive Props** (strings, numbers, booleans): Compared by value (`"hello" === "hello"` $\rightarrow$ `true`).
2. **Reference Props** (objects, arrays, functions): Compared by memory reference (`{} === {}` $\rightarrow$ `false`).

- If all props are shallowly equal, React **skips the render** and reuses the previous rendered output.
- If any prop reference or primitive value changed, React **re-renders** the component.

```tsx
import { memo } from "react";

interface ExpensiveComponentProps {
  title: string;
  count: number;
}

// Wrapped in memo
export const ExpensiveComponent = memo(function ExpensiveComponent({
  title,
  count,
}: ExpensiveComponentProps) {
  console.log("Rendering ExpensiveComponent...");
  return (
    <div>
      <h3>{title}</h3>
      <p>{count}</p>
    </div>
  );
});
```

---

## When SHOULD You Use `React.memo`?

`React.memo` comes with a performance cost—React has to store previous props in memory and perform prop comparisons on every render. Therefore, you should only use it when all three of these conditions are met:

1. **The component renders often with the exact same props:** It sits inside a parent component that re-renders frequently (e.g., due to typing in an input, dragging a slider, or running a timer).
2. **The component is computationally heavy:** It contains complex rendering logic, handles large lists, or renders a deep subtree of DOM nodes.
3. **Its props change infrequently:** The props passed to it stay identical across most parent re-renders.

---

## The Most Common Trap: Broken Memoization (Reference Equality)

The #1 reason `React.memo` fails to prevent re-renders is passing **unmemoized functions or objects** as props. In JavaScript, inline objects and functions create a **new memory reference on every render**:

```tsx
// ❌ BROKEN MEMOIZATION:
function Parent() {
  const [text, setText] = useState("");

  // New object and function created every time Parent re-renders!
  const config = { theme: "dark" };
  const handleClick = () => console.log("Clicked");

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {/* ExpensiveChild WILL STILL RE-RENDER because config and handleClick change references! */}
      <ExpensiveChild config={config} onClick={handleClick} />
    </div>
  );
}
```

### ✅ The Fix: `useMemo` and `useCallback`

To preserve reference equality and make `React.memo` work, wrap objects in `useMemo` and functions in `useCallback`:

```tsx
import { useState, useMemo, useCallback } from "react";

function Parent() {
  const [text, setText] = useState("");

  // 1. Stable object reference
  const config = useMemo(() => ({ theme: "dark" }), []);

  // 2. Stable function reference
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      {/* Now ExpensiveChild successfully skips re-rendering while typing! */}
      <ExpensiveChild config={config} onClick={handleClick} />
    </div>
  );
}
```

---

## Custom Comparison Functions

If you want to override the default shallow comparison (e.g., comparing deeply nested object props), pass a custom comparison function as the second argument:

```tsx
function arePropsEqual(prevProps: MyProps, nextProps: MyProps) {
  // Return true if passing nextProps would render the SAME output as prevProps.
  // Return false if re-rendering is required.
  return prevProps.item.id === nextProps.item.id;
}

export const MemoizedItem = memo(MyItemComponent, arePropsEqual);
```

> **Note:** Custom comparison functions return the **opposite** boolean logic of `Array.prototype.sort()` or `shouldComponentUpdate`: return `true` to **skip** render, `false` to **re-render**.

---

## Summary Checklist

| Rule               | Recommendation                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Default Choice** | Do **NOT** wrap every component in `React.memo` by default (premature optimization).                               |
| **Best Target**    | Use on heavy list items, leaf components receiving primitive props, or components deferred via `useDeferredValue`. |
| **Pairing**        | Always pair with `useCallback` and `useMemo` in parent components for non-primitive props.                         |
