**Memoization** in React is an optimization technique used to improve application performance by caching (remembering) the results of expensive function calculations or rendered components, and reusing them when the inputs (props, state, or dependencies) have not changed.

In React, unnecessary re-renders or heavy recalculations can slow down the user interface. Memoization helps by skipping redundant work.

---

## The 3 Main Memoization Tools in React

React provides three built-in tools for memoization, each addressing a specific performance bottleneck:

| Tool              | Purpose                | What it Caches            | Primary Use Case                                                                                                    |
| ----------------- | ---------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **`React.memo`**  | Higher-Order Component | Rendered **Component UI** | Prevents a child component from re-rendering if its props haven't changed.                                          |
| **`useMemo`**     | React Hook             | **Calculated Value**      | Prevents expensive calculations/computations from running on every render.                                          |
| **`useCallback`** | React Hook             | **Function Reference**    | Prevents re-creating callback functions on every render (useful when passing functions to `React.memo` components). |

---

## 1. `React.memo`: Memoizing Components

By default, when a parent component re-renders, **all of its child components re-render too**, even if their props didn't change. Wrapping a child component in `React.memo` tells React to skip re-rendering if its props are shallowly equal to the previous render's props.

### Example

```jsx
import React from 'react';

// Child component wrapped in React.memo
const ExpensiveChild = React.memo(function ExpensiveChild({ count }) {
  console.log('Child rendered!');
  return <div>Count: {count}</div>;
});

function Parent() {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState('');

  return (
    <div>
      {/* Typing here changes 'text' state, causing Parent to re-render.
          However, ExpensiveChild will NOT re-render because 'count' prop stayed the same! */}
      <input value={text} onChange={(e) => setText(e.target.value)} />
      
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      
      <ExpensiveChild count={count} />
    </div>
  );
}

```

---

## 2. `useMemo`: Memoizing Expensive Calculations

`useMemo` caches the **return value** of a function between renders. It only recalculates the value when one of its dependencies changes.

### Syntax

```javascript
const cachedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

```

### Example

```jsx
import { useState, useMemo } from 'react';

function ProductList({ products }) {
  const [filter, setFilter] = useState('');

  // Filtering a list of 10,000 items is expensive.
  // useMemo ensures filtering ONLY runs when 'products' or 'filter' changes,
  // NOT when other unrelated component states change.
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter((p) => p.name.includes(filter));
  }, [products, filter]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {filteredProducts.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

```

---

## 3. `useCallback`: Memoizing Function References

In JavaScript, functions are objects. Every time a component renders, every function declared inside it is recreated from scratch with a **new memory reference**.

If you pass a function as a prop to a `React.memo` child component, `React.memo` will see a "new" function prop on every render and re-render anyway. `useCallback` caches the **function instance itself** across renders.

### Example

```jsx
import React, { useState, useCallback } from 'react';

// Child wrapped in React.memo
const Button = React.memo(({ onClick, children }) => {
  console.log(`Rendering button: ${children}`);
  return <button onClick={onClick}>{children}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // useCallback keeps the exact same function reference unless 'count' changes.
  // This allows <Button> to successfully skip re-rendering when 'text' changes.
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []); // Empty dependency array = function reference never changes

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={handleIncrement}>Increment</Button>
    </div>
  );
}

```

---

## How Shallow Comparison Works in Memoization

React compares old and new props/dependencies using **shallow comparison** (`Object.is`):

* **Primitive values** (`number`, `string`, `boolean`): Compared by value ($5 === 5$ is `true`).
* **Reference types** (`objects`, `arrays`, `functions`): Compared by memory reference (`{} === {}` is `false`).

This is why passing inline objects (`style={{ color: 'red' }}`) or inline functions (`onClick={() => ...}`) directly to memoized components breaks `React.memo` unless they are wrapped in `useMemo` or `useCallback`.

---

## When SHOULD You Use Memoization?

Memoization is not free—it consumes memory to store cached values and adds computational overhead for dependency checking.

**Use memoization when:**

1. **Heavy Computations:** You are processing/filtering large datasets or performing complex math loops ($1000+$ items).
2. **Preventing Re-renders of Heavy Subtrees:** A child component renders a large, complex DOM tree or slow components, and re-renders frequently with the same props.
3. **Stable Hook Dependencies:** A function or object is passed as a dependency to another `useEffect` or custom hook.

---

## When SHOULD YOU AVOID Memoization?

1. **Cheap Operations:** Do not memoize simple tasks like string concatenation, basic array mapping over 10 items, or basic math operations. The memoization overhead costs more than the recalculation.
2. **Every Single Component/Function Prematurely:** Wrapping every function in `useCallback` or every component in `React.memo` clutters code and degrades performance due to excessive dependency checking.
3. **Components that Almost Always Receive New Props:** If props change on every single render anyway, `React.memo` does useless work checking props before re-rendering every time.
