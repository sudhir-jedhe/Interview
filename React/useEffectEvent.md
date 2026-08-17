> **Note:** `useEffectEvent` is currently an **experimental** React Hook available in React's canary and experimental channels. Its API and name may change before becoming part of a stable React release.

**`useEffectEvent`** is a React Hook that solves one of the most common frustrations with `useEffect`: separating reactive dependencies (things that should trigger the Effect to re-run) from non-reactive dependencies (things you just want to read the latest value of, without triggering a re-run).

Here is a comprehensive breakdown of its API, usage patterns, and troubleshooting rules.

---

## 1. Reference

### `const onEvent = useEffectEvent(callback)`

* **`callback`**: A function containing the logic you want to run. This function has access to the latest props and state of your component.

**Returns:**
A new function with a **stable identity**. This means the returned `onEvent` function will never change its memory reference across renders. Because it never changes, **you do not need to (and should not) include it in your Effect's dependency array**, yet calling it will always execute with the absolute latest state and props.

---

## 2. Usage Scenarios

### Using an event in an Effect

Imagine you want to log a page visit when a component mounts, and you want to include the current `cartCount` in the log. If you put `cartCount` in the `useEffect` dependency array, the logging will fire every time the user adds an item to the cart. If you leave it out, the linter yells at you.

`useEffectEvent` bridges this gap.

```jsx
import { useEffect, experimental_useEffectEvent as useEffectEvent } from 'react';

function ShoppingCart({ cartCount, roomId }) {
  // 1. Extract the non-reactive logic into an Effect Event
  const onVisit = useEffectEvent((room) => {
    logVisit(room, cartCount); // Always reads the latest cartCount
  });

  useEffect(() => {
    // 2. Call it from inside the Effect
    onVisit(roomId);
  }, [roomId]); // ✅ Only re-runs when roomId changes, NOT when cartCount changes
}

```

### Avoid reconnecting to external systems

If you are connecting to a chat room, you want to reconnect if the `roomId` changes. But if you want to show a toast notification using the current `theme` (dark/light) upon connection, changing the theme shouldn't disconnect and reconnect the chat.

```jsx
const onConnected = useEffectEvent(() => {
  showToast('Connected!', { theme: currentTheme });
});

useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', () => {
    onConnected();
  });
  connection.connect();
  
  return () => connection.disconnect();
}, [roomId]); // Changing the theme will not restart the connection

```

### Using a timer with latest values

When using `setInterval`, you often want to read the latest state without constantly clearing and resetting the interval on every render.

```jsx
const onTick = useEffectEvent(() => {
  console.log("Current count is:", count);
});

useEffect(() => {
  const id = setInterval(() => {
    onTick();
  }, 1000);
  return () => clearInterval(id);
}, []); // Interval stays alive, but onTick always reads the latest count

```

### Using an event listener with latest values

Similarly, if you attach a global `window` event listener (like tracking mouse movements or scroll position), you can use `useEffectEvent` to read state inside the listener without having to remove and re-attach the listener every time the state updates.

### Using Effect Events in custom Hooks

When writing custom Hooks, you can use `useEffectEvent` to encapsulate callbacks passed in by the consumer. This ensures that the consumer doesn't have to wrap their callbacks in `useCallback` just to prevent your internal Effects from re-running infinitely.

---

## 3. Troubleshooting

### I’m getting an error: “A function wrapped in useEffectEvent can’t be called during rendering”

**Cause:** You are calling the returned function directly in the body of your component, like a regular helper function.
**Fix:** Effect Events are strictly for side effects. You can only call them from *inside* a `useEffect`, or from inside another `useEffectEvent`.

```jsx
// ❌ BAD: Calling during render
const onTick = useEffectEvent(() => {...});
onTick(); 

// ✅ GOOD: Calling inside an Effect
useEffect(() => {
  onTick();
}, []);

```

### I’m getting a lint error: “Functions returned from useEffectEvent must not be included in the dependency array”

**Cause:** You added the Effect Event to your `useEffect` dependency array.
**Fix:** Remove it. The entire purpose of `useEffectEvent` is to provide a function with a stable identity that never changes. The React linter explicitly forbids adding it to the dependency array because doing so is redundant and implies a misunderstanding of how the hook works.

### I’m getting a lint error: ”… is a function created with useEffectEvent, and can only be called from Effects”

**Cause:** You are passing the Effect Event down to a child component as a prop (like an `onClick` handler), or passing it to an asynchronous callback (like `.then()`).
**Fix:** Effect Events are not event handlers for UI elements. If you need to pass a function to a button click, use `useCallback` or just a standard function. Effect Events must only be called directly within a `useEffect`.
