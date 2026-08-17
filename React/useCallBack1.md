**`useCallback`** is a React Hook that lets you cache a function definition between re-renders.

In JavaScript, functions are objects. Every time a component re-renders, any function defined inside it is re-created as a brand new object in memory (`function A !== function B`). `useCallback` tells React to save the original function and return that exact same memory reference on subsequent renders, as long as its dependencies haven't changed.

> **Note on React Compiler (React 19+):** The React Compiler automatically memoizes values and functions under the hood. If you are using the compiler, you rarely need to write manual `useCallback` calls anymore.

Here is a detailed breakdown of the API, usage patterns, and troubleshooting strategies.

---

## 1. Reference

### `const cachedFn = useCallback(fn, dependencies)`

* **`fn`**: The function value you want to cache. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render.
* **`dependencies`**: An array of reactive values (props, state, and variables declared inside your component) referenced inside the `fn`.

**Returns:**
On the initial render, it returns the `fn` you passed. On subsequent renders, it returns the *already stored* `fn` from the last render (if dependencies haven't changed), or the *new* `fn` (if dependencies have changed).

---

## 2. Usage Scenarios

### Skipping re-rendering of components

This is the most common use case. When you pass a function as a prop to a child component wrapped in `React.memo`, you must ensure the function's memory reference doesn't change, or you will break the memoization and force the child to re-render.

```jsx
import { useCallback, memo } from 'react';

// Memoized child component
const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  console.log("ShippingForm rendered");
  return <form onSubmit={onSubmit}>...</form>;
});

function CheckoutPage({ productId }) {
  // If we didn't use useCallback here, ShippingForm would re-render 
  // every time CheckoutPage re-renders (like when typing in a local input)
  const handleSubmit = useCallback((orderDetails) => {
    post('/api/checkout', { productId, ...orderDetails });
  }, [productId]); // Only recreate function if productId changes

  return <ShippingForm onSubmit={handleSubmit} />;
}

```

### Updating state from a memoized callback

If your callback needs to update state based on the previous state, you might be tempted to add that state to the dependency array. However, this causes the callback to be recreated every time the state changes, defeating the purpose of memoization.

**The Fix:** Use the updater function form of state setting.

```jsx
// ❌ BAD: Recreates the function every time 'todos' changes
const handleAdd = useCallback((text) => {
  setTodos([...todos, { id: nextId++, text }]);
}, [todos]); 

// ✅ GOOD: Uses the updater function, removing 'todos' from dependencies
const handleAdd = useCallback((text) => {
  setTodos(prevTodos => [...prevTodos, { id: nextId++, text }]);
}, []); // Function reference now stays identical forever

```

### Preventing an Effect from firing too often

If you call a function inside a `useEffect`, React's linter will ask you to add that function to the Effect's dependency array. If that function isn't memoized, it will trigger the Effect on every single render (often causing infinite loops if the Effect fetches data and updates state).

```jsx
function SearchResults({ query }) {
  // 1. Memoize the fetch function
  const fetchResults = useCallback(async () => {
    const response = await api.search(query);
    setResults(response.data);
  }, [query]); // Recreate only when query changes

  // 2. Safely use it as an Effect dependency
  useEffect(() => {
    fetchResults();
  }, [fetchResults]); // Only fires when fetchResults reference changes
}

```

### Optimizing a custom Hook

If you are writing a custom Hook, it is a best practice to wrap any functions that it returns into `useCallback`. This ensures that consumers of your Hook can safely pass those functions into `useEffect` dependencies or `React.memo` components without performance penalties.

```jsx
function useToggle(initialValue) {
  const [value, setValue] = useState(initialValue);

  // Consumers can safely pass toggle() to memoized child components
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle];
}

```

---

## 3. Troubleshooting

### Every time my component renders, useCallback returns a different function

**Cause:** Your dependency array contains a value that is changing its memory reference on every render. This happens frequently with object literals, arrays, or other unmemoized functions.

```jsx
// ❌ BAD: optionsObject is recreated every render
const optionsObject = { server: 'https://api.com' }; 

const fetchItem = useCallback(() => {
  api.get(optionsObject);
}, [optionsObject]); // This busts the cache every render!

```

**Fix:** Move static objects outside the component, or wrap them in `useMemo`.

```jsx
// ✅ GOOD: optionsObject is outside, so its reference never changes
const optionsObject = { server: 'https://api.com' }; 

```

### I need to call useCallback for each list item in a loop, but it’s not allowed

**Cause:** React enforces the "Rules of Hooks"—you cannot call hooks inside `for` loops, `map`, or `if` statements.

```jsx
// ❌ BAD: Calling hooks in a loop
function ReportList({ items }) {
  return (
    <ul>
      {items.map(item => {
        // ERROR: React will crash
        const handleClick = useCallback(() => log(item), [item]);
        return <li onClick={handleClick}>{item.title}</li>;
      })}
    </ul>
  );
}

```

**Fix:** Extract the list item into its own component. This allows you to call hooks at the top level of that new component, or pass the item's ID directly up to a single parent callback.

```jsx
// ✅ GOOD: Extract a component
function ReportItem({ item, onLog }) {
  // You can use hooks here if needed, or just rely on the parent
  return <li onClick={() => onLog(item.id)}>{item.title}</li>;
}

function ReportList({ items }) {
  // One memoized function for the whole list
  const handleLog = useCallback((id) => {
    console.log("Logged", id);
  }, []);

  return (
    <ul>
      {items.map(item => (
        <ReportItem key={item.id} item={item} onLog={handleLog} />
      ))}
    </ul>
  );
}

```
