**`useEffect`** is a React Hook that lets you synchronize a component with an external system.

In React, the main job of a component is to render UI based on props and state. Anything that falls outside of this pure rendering cycle—like fetching data from a server, manually changing the DOM, or setting up a subscription—is called a **side effect**. `useEffect` is the designated place to put these side effects.

---

## How It Works

The hook takes two arguments: a **setup function** (what you want to do) and an optional **dependency array** (when you want to do it). It also allows you to return a **cleanup function** to undo the effect when the component unmounts or before it runs again.

```javascript
import { useEffect } from 'react';

useEffect(() => {
  // 1. Setup: The side effect logic goes here
  const connection = createConnection();
  connection.connect();

  // 2. Cleanup (Optional): Undo the effect
  return () => {
    connection.disconnect();
  };
}, []); // 3. Dependencies: Controls when the effect runs

```

### The Dependency Array

The second argument dictates the execution timing. This is where most bugs happen, so understanding it is critical.

| Dependency Array                            | When does the effect run?                                                          |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Omitted** `useEffect(() => {...})`        | Runs after **every single render** of the component.                               |
| **Empty** `useEffect(() => {...}, [])`      | Runs exactly **once** after the initial render (on mount).                         |
| **Values** `useEffect(() => {...}, [x, y])` | Runs on mount, and then **only if** `x` or `y` have changed since the last render. |

---

## Common Scenarios & Use Cases

1. **Fetching Data (API Calls)**
Fetching data from a REST API or GraphQL endpoint when a component loads. You typically use an empty dependency array `[]` to fetch on mount, or an array with an ID `[userId]` to refetch when the user changes.
2. **Event Listeners and Subscriptions**
Subscribing to a WebSocket, listening for a window `resize` event, or tracking mouse movements. The cleanup function is mandatory here to remove the listener using `window.removeEventListener`.
3. **Timers and Intervals**
Setting up a `setTimeout` or `setInterval`. The cleanup function must call `clearTimeout` or `clearInterval` to prevent memory leaks if the component unmounts before the timer fires.
4. **Interacting with Third-Party Libraries**
Initializing a non-React library (like a charting tool or Google Maps) that requires attaching itself to a specific DOM node (usually accessed via a `useRef`).

---

## Interview Questions on `useEffect`

### Junior / Entry-Level

**1. How do you trigger a `useEffect` to run only once?**

* **What to say:** Pass an empty array `[]` as the second argument. This tells React that your effect doesn't depend on any values from props or state, so it never needs to re-run.

**2. What happens if you forget to pass the dependency array?**

* **What to say:** The effect will run after every single render. If you are doing something like fetching data inside that effect and updating state, it will cause an infinite loop (fetch -> update state -> re-render -> fetch).

### Mid-Level

**3. What is the cleanup function in `useEffect` and when does it run?**

* **What to say:** The cleanup function is the function you `return` from inside the effect. It runs right before the component unmounts, *and* right before the next effect runs on subsequent renders. It is used to clean up subscriptions, timers, or event listeners to prevent memory leaks.

**4. Can you make the `useEffect` callback an `async` function?**

* **What to say:** No, you cannot directly pass an `async` function like `useEffect(async () => {...}, [])`. React expects the return value of the effect to be a cleanup function (or nothing), but `async` functions automatically return a Promise. The correct way is to define the `async` function *inside* the effect and immediately call it.

### Senior / Advanced Level

**5. What is a "stale closure" in `useEffect` and how do you fix it?**

* **What to say:** A stale closure happens when an effect captures state or props from an older render because those variables were not included in the dependency array. To fix it, you must either add the missing dependencies to the array, use the updater function form of state (`setCount(c => c + 1)`), or use `useRef` to hold mutable values that don't trigger re-renders.

**6. How do you handle "race conditions" when fetching data in `useEffect`?**

* **What to say:** If a user clicks between "Profile 1" and "Profile 2" quickly, the network request for Profile 1 might resolve *after* Profile 2, causing the UI to display the wrong data. You handle this by using a local boolean flag (e.g., `let ignore = false`) inside the effect. In the cleanup function, you set `ignore = true`. When the fetch promise resolves, you only update the state `if (!ignore)`. (Alternatively, use AbortController to cancel the fetch entirely).

**`useEffect`** is a React Hook that lets you synchronize a component with an external system (like a network, a browser API, or a third-party library).

Here is a comprehensive guide covering its API, advanced usage patterns, and solutions to common troubleshooting scenarios.

---

## 1. Reference

### `useEffect(setup, dependencies?)`

* **`setup`**: A function containing your Effect's logic. It may optionally return a **cleanup function**. When your component mounts, React runs the setup function. On subsequent re-renders, if dependencies have changed, React runs the cleanup function (with old values), then the setup function (with new values). When the component unmounts, React runs the cleanup function one last time.
* **`dependencies` (Optional)**: An array of all reactive values (props, state, variables) referenced inside the `setup` function.
* If omitted, the Effect runs after *every* render.
* If an empty array `[]`, the Effect runs only on mount (and cleanup on unmount).
* If `[x, y]`, the Effect runs when `x` or `y` change.

---

## 2. Usage

### Connecting to an external system

Some components need to stay connected to a network, browser API, or third-party library while they are on screen.

```jsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  
  return () => {
    connection.disconnect(); // Cleanup prevents memory leaks
  };
}, [roomId]); 

```

### Wrapping Effects in custom Hooks

If you find yourself writing the same Effect repeatedly, extract it into a custom Hook. This hides the messy implementation details from your component.

```jsx
function useChatRoom(roomId) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}

// In your component:
useChatRoom(roomId);

```

### Controlling a non-React widget

When you need to integrate a third-party library that manipulates the DOM directly (like Google Maps or a video player), use an Effect.

```jsx
useEffect(() => {
  const map = new MapWidget(mapRef.current);
  map.setZoom(zoomLevel);
  
  return () => map.destroy();
}, [zoomLevel]);

```

### Fetching data with Effects

When fetching data in an Effect, you must handle **race conditions** (when an older request resolves after a newer one). Use a cleanup function with a boolean flag or an `AbortController`.

```jsx
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) setTodos(json);
  }

  startFetching();

  return () => { ignore = true; }; // Ignores stale responses
}, [userId]);

```

### Specifying reactive dependencies

You cannot "choose" your dependencies. If your Effect reads a prop or state variable, it **must** be in the dependency array. If you don't want the Effect to re-run when that value changes, you must rewrite the Effect code so it doesn't need that value.

### Updating state based on previous state from an Effect

If you read a state variable inside an Effect just to update it, adding it to the dependency array will cause the Effect to re-run constantly.
**Fix:** Use the state updater function.

```jsx
// ❌ BAD: Re-runs the effect every time count changes
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, [count]);

// ✅ GOOD: Effect runs once. Updater function handles the math.
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);

```

### Removing unnecessary object & function dependencies

Objects and functions created inside a component get a new memory reference on every render. If they are used as Effect dependencies, they will trigger the Effect every time.
**Fix:** Move static objects/functions *outside* the component, or define them *inside* the Effect itself.

```jsx
// Define it inside the Effect so it doesn't trigger re-runs
useEffect(() => {
  const options = { serverUrl: 'https://api.com', roomId };
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);

```

### Reading the latest props and state from an Effect

Sometimes you want to read the latest state in an Effect without triggering the Effect to re-run when that state changes (e.g., logging a page visit with the current shopping cart item count). In React 18, the standard workaround is to use a `useRef` to hold the latest value. (React is developing a new experimental hook called `useEffectEvent` to solve this cleanly).

### Displaying different content on the server and the client

If your app uses Server-Side Rendering (SSR), `window` or `localStorage` aren't available on the server. If you render different HTML on the server vs. the client, hydration will crash.
**Fix:** Render a fallback on the server, and update it in an Effect (which only runs on the client).

```jsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) return <div>Loading...</div>; // Server sees this
return <div>{window.localStorage.getItem('user')}</div>; // Client sees this

```

---

## 3. Troubleshooting

### My Effect runs twice when the component mounts

**Cause:** You are running React in Strict Mode (`<StrictMode>`) in development. React intentionally mounts, unmounts, and remounts your component to test if your cleanup logic works correctly.
**Fix:** Do not try to stop it. If your app breaks because the Effect runs twice, it means your Effect is missing a proper cleanup function. Add the cleanup function, and the double-run will be invisible to the user.

### My Effect runs after every re-render

**Cause:** You forgot the dependency array entirely.
**Fix:** Change `useEffect(() => {...})` to `useEffect(() => {...}, [])` (or include your dependencies).

### My Effect keeps re-running in an infinite cycle

**Cause:** Your Effect is updating a state variable, and that same state variable is in the dependency array (either directly or passed down as an object/function).
**Fix:** Use the state updater function (`setCount(c => c + 1)`), or remove the state update from the Effect if it belongs in an event handler (like a button click).

### My cleanup logic runs even though my component didn’t unmount

**Cause:** This is intended behavior. Effects do not just clean up on unmount; they clean up **before every re-run**. If your dependency array is `[userId]`, and `userId` changes, React cleans up the old connection before setting up the new one.
**Fix:** No fix needed. This ensures your component doesn't suffer from memory leaks or stale data.

### My Effect does something visual, and I see a flicker before it runs

**Cause:** `useEffect` is deferred. It runs *after* the browser has already painted the screen. If your Effect mutates the DOM (like measuring an element and changing its height), the user will see the original height for a split second, followed by the new height.
**Fix:** Replace `useEffect` with `useLayoutEffect`. It blocks the browser from painting until the Effect finishes executing.
