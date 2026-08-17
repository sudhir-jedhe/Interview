**`useDebugValue`** is a React Hook that lets you add custom labels to your custom Hooks in the React Developer Tools extension.

It does not affect how your component renders or behaves in production. Its sole purpose is to improve the developer experience by making it easier to inspect what is happening inside complex custom Hooks during debugging.

Here is a detailed breakdown of its API and usage patterns.

---

## 1. Reference

### `useDebugValue(value, format?)`

* **`value`**: The value you want to display in the React DevTools. This can be of any type (string, number, object, boolean).
* **`format` (Optional)**: A formatting function. It takes the `value` as its argument and returns a formatted string to display. This is used as a performance optimization to prevent expensive calculations when the DevTools are closed.

**Returns:**
`useDebugValue` does not return anything.

---

## 2. Usage Scenarios

### Adding a label to a custom Hook

When you build a custom Hook, its internal state is often difficult to decipher at a glance in the React DevTools. You can call `useDebugValue` to give it a clear, readable label.

**Note:** You should only call `useDebugValue` at the top level of your *custom Hooks*. It does not do anything if called directly inside a standard component.

```jsx
import { useState, useEffect, useDebugValue } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  // ... code to handle online/offline events ...

  // Adds a clear label in React DevTools: e.g., "OnlineStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}

function App() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Connected' : '❌ Disconnected'}</h1>;
}

```

If you inspect the `<App/>` component in React DevTools, you will see `OnlineStatus: "Online"` instead of having to dig into the hook's internal `useState` boolean.

### Deferring formatting of a debug value

Sometimes, formatting a value for debugging requires an expensive computation (like parsing a complex date, iterating through a large array, or serializing a massive object).

If you format the value directly in the first argument, that expensive computation will run on *every single render* of your component, slowing down your app even when the React DevTools are completely closed.

**The Fix:** Pass a formatting function as the second argument. React will only execute this function if the React DevTools are actually open and inspecting that specific component.

```jsx
import { useState, useDebugValue } from 'react';

function useComplexData() {
  const [data, setData] = useState(new Date());

  // ❌ BAD: Runs on every render, even in production!
  // useDebugValue(data.toISOString());

  // ✅ GOOD: The function only runs when DevTools is actively inspecting it
  useDebugValue(data, (date) => date.toISOString());

  return data;
}

```

### When to use `useDebugValue`

You do not need to add `useDebugValue` to every custom Hook you write.

* **Do use it** for shared libraries or highly complex custom Hooks where the internal state is difficult to understand (like `useMediaQuery`, `useAuth`, or `useForm`).
* **Do not use it** for simple, one-off hooks in your application where the internal `useState` or `useReducer` values are already obvious.
