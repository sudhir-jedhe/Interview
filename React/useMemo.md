`useMemo` is a React Hook that **caches (memoizes) the result of a calculation** between re-renders.

It prevents expensive computations from running on every single render unless one of its dependencies changes.

---

## 1. Syntax

`useMemo` takes two arguments: a calculation function and a dependency array.

```tsx
import { useMemo } from 'react';

const cachedValue = useMemo(() => {
  // 1. Expensive calculation logic
  return computeExpensiveValue(a, b);
}, [a, b]); // 2. Dependency array

```

* **On initial render:** React calls the calculation function and returns its result.
* **On subsequent renders:**
* If dependencies (`a` or `b`) **have not changed**, React skips the function and returns the cached result from the previous render.
* If dependencies **have changed**, React re-runs the calculation function and caches the new result.

---

## 2. Primary Use Cases

### A. Skipping Expensive Recalculations

If you have an operation that processes large arrays or performs heavy filtering/sorting, wrapping it in `useMemo` keeps your component responsive.

```tsx
import { useState, useMemo } from 'react';

function ProductList({ products, filterText }) {
  const [count, setCount] = useState(0);

  // ❌ Without useMemo: Re-filters thousands of items even when `count` changes!
  // const visibleProducts = filterProducts(products, filterText);

  // ✅ With useMemo: Only re-filters when `products` or `filterText` changes
  const visibleProducts = useMemo(() => {
    return products.filter((item) => item.name.includes(filterText));
  }, [products, filterText]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Re-render ({count})</button>
      <List items={visibleProducts} />
    </div>
  );
}

```

---

### B. Preserving Referential Equality to Avoid Child Re-renders

In JavaScript, `{}` or `[]` creates a **new object reference** in memory on every render pass. If you pass an object or array to a child component wrapped in `React.memo`, the child will re-render regardless because its props changed reference.

Wrapping the object in `useMemo` preserves its reference across renders:

```tsx
import { useMemo } from 'react';

function Dashboard({ userId, theme }) {
  // ✅ Keeps the same object reference in memory unless `theme` changes
  const chartOptions = useMemo(() => {
    return {
      color: theme === 'dark' ? '#fff' : '#000',
      showGrid: true,
    };
  }, [theme]);

  // HeavyChart wrapped in React.memo will now skip re-renders if `userId` changes!
  return <HeavyChart options={chartOptions} />;
}

```

---

## 3. Difference Between `useMemo` and `useCallback`

Both hooks cache values between renders based on dependencies, but they memoize different things:

| Hook              | What it Memoizes                      | Return Value                                        | Common Equivalent         |
| ----------------- | ------------------------------------- | --------------------------------------------------- | ------------------------- |
| **`useMemo`**     | The **result** of calling a function. | Any calculated value (`number`, `object`, `array`). | `useMemo(() => fn, deps)` |
| **`useCallback`** | The **function instance itself**.     | The memoized function.                              | `useCallback(fn, deps)`   |

---

## 4. When NOT to Use `useMemo`

Overusing `useMemo` introduces memory overhead and code complexity. Avoid using it in these situations:

1. **For cheap operations:** Basic array operations on small lists (`.map()`, `.filter()` on < 100 items), primitive math, or string concats don't need memoization. The overhead of `useMemo` can actually be slower than the calculation itself.
2. **Without measuring performance first:** Don't add `useMemo` everywhere "just in case." Use React DevTools Profiler to identify actual rendering bottlenecks before optimizing.
3. **To handle side effects:** Never run side effects inside `useMemo`'s function. Use `useEffect` for side effects.

---

## Summary Checklist

```
           Is the calculation noticeably slow (e.g., thousands of array items)?
                                       │
                      ┌────────────────┴────────────────┐
                      │                                 │
                   YES (Slow)                       NO (Fast)
                      │                                 │
              Use `useMemo`                     Calculate directly
                                                in render body

```

**`useMemo`** is a React Hook that lets you cache the result of an expensive calculation between re-renders.

When a component re-renders, React re-runs the entire component body from top to bottom. If you have a calculation that loops through tens of thousands of items, filters complex data structures, or generates heavy objects, re-running it on every render can cause noticeable UI stuttering. `useMemo` tells React to skip recalculating the value unless one of its dependencies has changed.

> **Note on React Compiler (React 19+):** The React Compiler automatically memoizes values and calculations under the hood. If you are using the compiler, you rarely need to write manual `useMemo` calls anymore.

Here is a comprehensive breakdown of its API, usage patterns, and troubleshooting strategies.

---

## 1. Reference

### `const cachedValue = useMemo(calculateValue, dependencies)`

* **`calculateValue`**: A function that calculates the value you want to cache. It should take no arguments, be **pure** (return the exact same output given the same inputs), and return any type of value. React will call this function during initial render.
* **`dependencies`**: An array of all reactive values (props, state, and local variables) referenced inside `calculateValue`.

**Returns:**
On initial render, it returns the result of calling `calculateValue`. On subsequent renders, it will either return the already cached value from the last render (if dependencies haven't changed) or call `calculateValue` again and return the new result.

---

## 2. Usage Scenarios

### Skipping expensive recalculations

If you are filtering or transforming a massive dataset, you can wrap the calculation in `useMemo` so it only runs when the data or search query actually changes.

```jsx
import { useState, useMemo } from 'react';

function TodoList({ todos, filter }) {
  // This expensive filter will ONLY re-run if 'todos' or 'filter' changes.
  // Typing in an unrelated local input will not trigger this calculation.
  const visibleTodos = useMemo(() => {
    console.log('Calculating expensive filtered todos...');
    return todos.filter(todo => todo.status === filter);
  }, [todos, filter]);

  return (
    <ul>
      {visibleTodos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}

```

### Skipping re-rendering of components

Just like `useCallback` caches function references, `useMemo` can cache **object references**. When you pass an object prop to a child component wrapped in `React.memo`, you must memoize that object, or a new object literal (`{}`), created on every render, will break memoization.

```jsx
import { useMemo, memo } from 'react';

const Chart = memo(function Chart({ data }) {
  return <div>Rendering heavy chart...</div>;
});

function ParentComponent({ userId }) {
  // Without useMemo, this object is recreated every render, 
  // forcing the memoized Chart component to re-render needlessly.
  const chartConfig = useMemo(() => {
    return { theme: 'dark', endpoint: `/api/users/${userId}/stats` };
  }, [userId]);

  return <Chart data={chartConfig} />;
}

```

### Preventing an Effect from firing too often

If your `useEffect` depends on an object or array, placing that object directly in the dependency array will cause the Effect to re-run on every render (because object references change every time). You can use `useMemo` to stabilize the object reference.

```jsx
function ShippingModal({ address }) {
  // Stabilize the options object so the Effect doesn't infinite loop
  const shippingOptions = useMemo(() => {
    return { street: address.street, city: address.city };
  }, [address.street, address.city]);

  useEffect(() => {
    analytics.logShippingView(shippingOptions);
  }, [shippingOptions]); // Safe to use as a dependency now
}

```

### Memoizing a dependency of another Hook

If you have a custom Hook or another Hook that depends on a calculated object or array, memoizing it prevents cascading re-renders and re-runs of dependent hooks.

### Memoizing a function (Alternative to `useCallback`)

While `useCallback` is designed specifically for caching functions, `useMemo` can actually achieve the exact same result. In fact, under the hood, `useCallback(fn, deps)` is strictly equivalent to `useMemo(() => fn, deps)`.

```jsx
// These two lines do the exact same thing:
const handleClick = useCallback(() => doSomething(id), [id]);
const handleClick = useMemo(() => () => doSomething(id), [id]);

```

---

## 3. Troubleshooting

### My calculation runs twice on every re-render

**Cause:** You are running React in Strict Mode (`<StrictMode>`) in development. React intentionally runs your calculation function twice to check that it is pure and has no side effects.
**Fix:** No fix needed. This behavior only occurs in development and is completely invisible in production.

### My `useMemo` call is supposed to return an object, but returns `undefined`

**Cause:** You used curly braces `{}` inside your arrow function without an explicit `return` statement. In JavaScript arrow functions, `{}` signifies a function block, not an object literal, unless wrapped in parentheses.

```jsx
// ❌ BAD: Returns undefined because {} is treated as a function body
const badObj = useMemo(() => { 
  name: 'John' 
}, []);

// ✅ GOOD: Wrap the object literal in parentheses
const goodObj = useMemo(() => ({ 
  name: 'John' 
}), []);

```

### Every time my component renders, the calculation in `useMemo` re-runs

**Cause:** One of your dependencies is changing its memory reference on every render (commonly an unmemoized object, array, or function defined inline).

**Fix:** Inspect your dependency array. If an object is listed as a dependency, wrap that object in `useMemo` as well, or extract primitive values (like `id` or `name`) out of the object and put those primitives into the dependency array instead.

### I need to call `useMemo` for each list item in a loop, but it’s not allowed

**Cause:** Just like all other hooks, `useMemo` violates the "Rules of Hooks" if placed inside a `map()` loop, `for` loop, or `if` statement.

**Fix:** Extract the list item into its own child component, and place the `useMemo` call at the top level inside that new component.
