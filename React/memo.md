**`memo`** is a higher-order component in React that lets you skip re-rendering a component when its props haven't changed.

Normally, when a parent component re-renders, React recursively re-renders all of its child components by default. If a child component performs heavy rendering or receives props that haven't changed, wrapping it in `memo` tells React to check the props and skip re-rendering if they are identical.

> **Note on React Compiler (React 19+):** The React Compiler automatically applies component memoization under the hood. If you are using the compiler, manual `memo` calls are generally redundant.

---

## 1. Reference

### `const MemoizedComponent = memo(SomeComponent, arePropsEqual?)`

* **`SomeComponent`**: The component you want to memoize. `memo` does not mutate your component; it returns a new, memoized version of it.
* **`arePropsEqual` (Optional)**: A custom comparison function of the signature `function arePropsEqual(prevProps, nextProps)`. It should return `true` if `prevProps` and `nextProps` are equal (preventing re-render), or `false` if they are different (triggering a re-render). If omitted, React compares every prop using shallow equality (`Object.is`).

---

## 2. Usage Scenarios

### Skipping re-rendering when props are unchanged

If a component renders heavy UI based on specific props, wrapping it in `memo` ensures it only updates when those specific props change, ignoring parent re-renders.

```jsx
import { memo } from 'react';

// This component will only re-render if `name` or `age` changes
const UserProfile = memo(function UserProfile({ name, age }) {
  console.log('UserProfile rendered!');
  return <div>{name} ({age})</div>;
});

```

### Updating a memoized component using state

A memoized component still re-renders when its **own internal state** changes or when a **context** it reads updates. `memo` only guards against parent prop changes.

### Minimizing prop changes

Because `memo` relies on shallow equality (`Object.is`), passing objects, arrays, or inline functions as props will break memoization because their memory references change on every render. To make `memo` effective, ensure your props are primitive values or are memoized using `useMemo` and `useCallback`.

### Specifying a custom comparison function

If shallow equality is too strict or too loose for your use case, you can provide a custom comparison function.

```jsx
const ProductCard = memo(function ProductCard({ product }) {
  return <div>{product.title} - ${product.price}</div>;
}, (prevProps, nextProps) => {
  // Only re-render if the product ID or price actually changes
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price
  );
});

```

---

## 3. Troubleshooting

### My component re-renders when a prop is an object, array, or function

* **Cause:** JavaScript compares objects and functions by reference, not value. Even if two objects have identical contents (`{ id: 1 } === { id: 1 }` evaluates to `false`), they are distinct references in memory. Every time the parent re-renders, new object or function literals are created, breaking `memo`.
* **Fix:**
* For objects and arrays, wrap them in `useMemo` in the parent component.
* For functions, wrap them in `useCallback` in the parent component.
* Alternatively, pass primitive values (like `productId` instead of the whole `product` object) down as props.
