**`useSyncExternalStore`** is a specialized React hook introduced in **React 18** designed for subscribing to external state stores outside of React (such as Redux, Zustand, browser APIs, or custom global stores).

It guarantees that your components subscribe to external stores safely without causing **tearing**—a visual bug in Concurrent React where different parts of the screen display different values for the exact same state.

---

## Syntax

```tsx
const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?);

```

### Parameters:

1. **`subscribe`**: A function that takes a `callback` and registers it with the store. When the store changes, it calls `callback()`. Returns a cleanup function that unsubscribes.
2. **`getSnapshot`**: A function that returns the current snapshot of data from the store. If the store hasn't changed, returning the same immutable value avoids unnecessary re-renders.
3. **`getServerSnapshot`** _(optional)_: A function returning the initial snapshot of data during Server-Side Rendering (SSR) and hydration.

---

## Why Was It Created? (Solving "Tearing")

In React 18 Concurrent Rendering, React can pause a re-render in the middle of a component tree to handle an urgent user event (like typing).

If an external store (like a global Redux store or browser window width) mutates **while React is paused mid-render**, components rendered _before_ the pause would show old state, while components rendered _after_ the pause would show new state. This inconsistent UI split is called **tearing**.

`useSyncExternalStore` detects external mutations during rendering and forces React to synchronously re-evaluate the render, ensuring complete UI consistency.

---

## Real-World Example 1: Subscribing to a Browser API (Online Status)

A common use case is subscribing to browser state (like `navigator.onLine`) without needing `useEffect` + `useState`.

```tsx
import { useSyncExternalStore } from "react";

// 1. Subscribe function: Registers native browser listener
function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

// 2. Snapshot function: Reads current browser state
function getOnlineSnapshot() {
  return navigator.onLine;
}

export function ChatStatus() {
  // Automatically updates whenever the browser goes online or offline!
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot);

  return (
    <div className="status-badge">
      <span className={isOnline ? "bg-green" : "bg-red"} />
      {isOnline ? "Connected" : "Offline - Reconnecting..."}
    </div>
  );
}
```

---

## Real-World Example 2: Building a Custom Global Store

If you want to build a lightweight, Redux-like global store without third-party dependencies:

```tsx
import { useSyncExternalStore } from "react";

// 1. Create a minimal store class
function createStore<T>(initialState: T) {
  let currentState = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => currentState,
    setState: (nextState: T | ((prev: T) => T)) => {
      currentState =
        typeof nextState === "function"
          ? (nextState as Function)(currentState)
          : nextState;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// Create store instance
export const counterStore = createStore(0);

// 2. Custom Hook wrapper
export function useCounterStore() {
  return useSyncExternalStore(counterStore.subscribe, counterStore.getState);
}

// 3. Component Usage
export function CounterDisplay() {
  const count = useCounterStore();
  return <h1>Count: {count}</h1>;
}

export function CounterControls() {
  return (
    <button onClick={() => counterStore.setState((c) => c + 1)}>
      Increment Global Count
    </button>
  );
}
```

---

## When SHOULD You Use It?

- **Building State Libraries:** Essential for library authors maintaining state management tools (Redux, Zustand, MobX, Jotai).
- **Subscribing to Browser APIs:** WebSockets, `window.matchMedia`, `navigator.onLine`, `window.location`, or IndexedDB mutations.

## When Should You NOT Use It?

- **Standard React State:** Do NOT use it for state internal to React. Use `useState`, `useReducer`, or `useContext` instead.

Subscribing to CSS media queries using `useSyncExternalStore` and `window.matchMedia` is a clean pattern because it gives you real-time responsive values without the extra boilerplate or re-renders associated with standard `useEffect` and `useState` setups.

---

## The Implementation

Here is a reusable `useMediaQuery` custom hook built with `useSyncExternalStore`:

```tsx
import { useSyncExternalStore, useCallback } from "react";

export function useMediaQuery(query: string): boolean {
  // 1. Subscribe function: Registers the change listener on the media query list
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);

      // Modern browsers support addEventListener on MediaQueryList
      matchMedia.addEventListener("change", callback);

      // Return cleanup function to unsubscribe
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query],
  );

  // 2. Client snapshot: Evaluates whether the media query currently matches
  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  // 3. Server snapshot (SSR/Next.js fallback): Prevents hydration errors on the server
  const getServerSnapshot = () => {
    return false; // Default to mobile/desktop fallback during server rendering
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

---

## Component Usage Example

You can now use this hook directly in any component to conditionally render layout elements or trigger logic based on screen breakpoints:

```tsx
import { useMediaQuery } from "./useMediaQuery";

export function NavigationBar() {
  // Pass any valid CSS media query string
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <nav className={isDarkMode ? "dark-theme" : "light-theme"}>
      <div className="logo">My App</div>

      {/* Conditionally render mobile drawer vs desktop menu bar */}
      {isMobile ? (
        <button
          className="hamburger-menu"
          onClick={() => console.log("Open Menu")}
        >
          🍔 Menu
        </button>
      ) : (
        <ul className="desktop-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      )}
    </nav>
  );
}
```

---

## Why This Pattern is Superior to `useEffect` + `useState`

1. **Hydration Protection:** Providing `getServerSnapshot` gives server-side rendering frameworks (like Next.js or Remix) a safe default value during SSR, preventing hydration mismatch errors.
2. **Zero Tearing:** If a user resizes their window or turns their device rapidly during a Concurrent React render, React guarantees the UI evaluates matching breakpoints consistently across the entire component tree.
3. **No Unnecessary Re-renders:** Memory references stay stable because listeners attach directly to the browser's native `MediaQueryList` object.
   Zustand achieves its minimal footprint and fast updates because it completely decouples **state storage** from React's rendering pipeline.

Instead of wrapping your app in deeply nested React Context providers, Zustand maintains state in a plain JavaScript closure (outside of React) and uses **`useSyncExternalStore`** to connect components directly to specific slices of that store.

---

## 1. Under the Hood: How Zustand Builds Its Store

At its core, a Zustand store is created by `vanilla.ts` (Zustand's plain JS core) without any React code. It consists of a simple closure containing three things:

1. `state`: A plain JavaScript object holding the current state values.
2. `listeners`: A JavaScript `Set` storing callback functions.
3. `setState` / `getState` / `subscribe`: Standard methods to read, mutate, and observe changes.

### A Simplified Vanilla Store (Zustand Core)

```typescript
// Simplified version of Zustand's core vanilla store
export function createStore(createState) {
  let state;
  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      state = replace ? nextState : Object.assign({}, state, nextState);
      // Notify all registered listeners when state changes!
      listeners.forEach((listener) => listener());
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener); // Unsubscribe cleanup
  };

  state = createState(setState, getState);
  return { setState, getState, subscribe };
}
```

---

## 2. Connecting to React via `useSyncExternalStoreWithSelector`

To bind this plain JS store to React components safely, Zustand leverages **`useSyncExternalStoreWithSelector`** (an official package maintained by the React core team built on top of `useSyncExternalStore`).

When you call `useBearStore(state => state.bears)` inside a component, here is what Zustand does behind the scenes:

```typescript
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

export function useStore(api, selector = (s) => s, equalityFn) {
  // Pass store methods directly into useSyncExternalStore
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe, // 1. How React listens for store changes
    api.getState, // 2. How React gets current state on client
    api.getServerState, // 3. How React gets state on SSR (hydration)
    selector, // 4. Extracts ONLY the target slice (e.g., state.bears)
    equalityFn, // 5. Compares if slice changed (Object.is by default)
  );

  return slice;
}
```

---

## 3. Why This Architecture Makes Zustand So Fast

### A. Selective Re-rendering (No Context Overhead)

In traditional React Context, updating any value in the context value object triggers a re-render for **every component consuming that context**, even if they don't care about that specific modified field.

With Zustand:

```tsx
// This component ONLY re-renders when `bears` changes!
// Changes to `fish`, `userName`, or other state fields are completely ignored.
const bears = useBearStore((state) => state.bears);
```

`useSyncExternalStoreWithSelector` runs the `selector` against the new state whenever the store updates. If `equalityFn(prevSlice, newSlice)` returns `true`, React **completely skips re-rendering** the component.

### B. Direct Execution Outside React's Lifecycle

State updates are executed directly via `useBearStore.getState().increment()`. Because actions aren't dispatched through React's `useReducer` or `useState` queue, there is zero dispatcher overhead.

### C. Transient Updates (Bypassing React Entirely)

Because the Zustand store lives in vanilla JS, you can subscribe to state changes or read state imperatively outside of React components (like in websockets, utility functions, or event listeners) without causing component renders at all:

```typescript
// Subscribe to changes outside of React (e.g. for canvas animation loops)
const unsub = useBearStore.subscribe(
  (state) => state.bears,
  (bears) => console.log("Bears updated:", bears),
);
```

---

## Summary

Zustand stays lightweight ($\sim 1\text{ KB}$) by avoiding complex internal fiber mechanics or Provider trees. It delegates the subscription and tearing-protection responsibilities entirely to React's native **`useSyncExternalStore`**, using simple closure-based pub/sub state management underneath.
