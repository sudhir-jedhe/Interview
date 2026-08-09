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
