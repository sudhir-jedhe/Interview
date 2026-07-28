The `useRef` hook in React is used to persist values across renders without causing re-renders itself. It's typically used for accessing DOM elements directly or keeping track of mutable state that doesn’t need to trigger re-renders when changed.

### Key Use Cases for `useRef`:

Here are some of the most common scenarios where `useRef` is used, particularly in relation to `forwardRef`:

### 1. **Accessing DOM Elements**

When you need to interact with a DOM element (e.g., for focus, measuring, or animations), `useRef` provides a reference to that element. `forwardRef` is often used to pass a ref down to a child component so the parent can directly interact with the child's DOM element.

**Example:**

```jsx
import React, { useRef } from "react";

function InputComponent(props, ref) {
  return <input ref={ref} />;
}

// Using forwardRef to forward the ref to the input
const ForwardedInput = React.forwardRef(InputComponent);

function ParentComponent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // Focus on the input field
  };

  return (
    <>
      <ForwardedInput ref={inputRef} />
      <button onClick={focusInput}>Focus the input</button>
    </>
  );
}

export default ParentComponent;
```

In this example, the `ref` is forwarded from the parent (`ParentComponent`) to the `InputComponent` using `forwardRef`. This allows the parent component to access the DOM node of the input field and call `focus()` on it.

### 2. **Handling Imperative Code in Functional Components**

Functional components don't have instance methods like class components, but sometimes you need to invoke imperative methods (e.g., focusing an input, scrolling to an element, etc.). `useRef` can be used to hold references to methods that can be called imperatively.

**Example:**

```jsx
import React, { useRef } from "react";

function TimerComponent(props, ref) {
  const timerId = useRef(null);

  const startTimer = () => {
    timerId.current = setInterval(() => {
      console.log("Timer running");
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
  };

  React.useImperativeHandle(ref, () => ({
    startTimer,
    stopTimer,
  }));

  return (
    <div>
      <h2>Timer</h2>
    </div>
  );
}

const ForwardedTimer = React.forwardRef(TimerComponent);

function ParentComponent() {
  const timerRef = useRef();

  return (
    <>
      <ForwardedTimer ref={timerRef} />
      <button onClick={() => timerRef.current.startTimer()}>Start Timer</button>
      <button onClick={() => timerRef.current.stopTimer()}>Stop Timer</button>
    </>
  );
}

export default ParentComponent;
```

Here, `useImperativeHandle` allows the parent to invoke methods like `startTimer` and `stopTimer` on the child component using `ref`.

### 3. **Persisting Values Across Renders Without Re-triggering Re-renders**

`useRef` is useful when you need to persist values (e.g., previous state, counters) across renders without causing a re-render when those values change.

**Example:**

```jsx
import React, { useRef, useState } from "react";

function CounterComponent() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  // Store the previous count value
  React.useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <h1>Current count: {count}</h1>
      <h2>Previous count: {prevCountRef.current}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default CounterComponent;
```

In this case, `prevCountRef` holds the previous value of `count`, but changing `prevCountRef` doesn’t trigger a re-render, allowing us to track state changes without causing unnecessary updates.

### 4. **Forwarding Ref for Custom Components**

`forwardRef` allows you to pass refs from parent components to child components. This is especially useful when you want to expose a DOM element or instance method in a custom component to its parent.

**Example:**

```jsx
import React from "react";

const CustomButton = React.forwardRef((props, ref) => {
  return (
    <button ref={ref} {...props}>
      {props.children}
    </button>
  );
});

function ParentComponent() {
  const buttonRef = useRef();

  const handleClick = () => {
    console.log(buttonRef.current); // Access the DOM element
  };

  return (
    <div>
      <CustomButton ref={buttonRef} onClick={handleClick}>
        Click Me
      </CustomButton>
    </div>
  );
}

export default ParentComponent;
```

Here, the `ref` is forwarded to the `button` element inside `CustomButton`, so the parent component can interact with the button directly.

### Why Use `forwardRef`?

`forwardRef` is useful when:

- **Exposing a DOM element**: If a parent component needs to access a DOM element or method in a child component, `forwardRef` helps pass down the reference.
- **Custom Components**: If you're creating a custom component (like a button, input, or modal) and you want to allow parents to interact with its underlying DOM, you need `forwardRef`.
- **Imperative Code**: When you need to expose imperative methods (e.g., `focus`, `scrollTo`) to parents, `forwardRef` is a key part of making that possible in functional components.

In summary, `useRef` allows you to persist values across renders without re-renders, and `forwardRef` allows you to pass refs to child components for direct interaction with their DOM elements or methods.

The `useRef` hook in React serves two distinct primary purposes:

1. **Accessing DOM nodes directly** (the most common use case).
2. **Storing mutable values that persist across re-renders without triggering a re-render** when changed.

Think of `useRef` as a plain JavaScript object `{ current: initialValue }` where updating `.current` changes the value immediately without causing React to re-evaluate the component tree.

---

## Scenario 1: Accessing and Manipulating DOM Elements

Directly interacting with the DOM is required for managing focus, measuring element sizes, or triggering media playback.

### Example: Programmatically Focusing an Input Field

```tsx
import { useRef } from "react";

export function SearchForm() {
  // Bind ref to an HTMLInputElement
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    // Focus the input DOM node directly
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Search..." />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}
```

---

## Scenario 2: Storing Timer and Interval IDs

Timer IDs returned by `setTimeout` or `setInterval` need to persist across renders so they can be cleared later, but saving them in `useState` would trigger unnecessary re-renders every time a timer starts or stops.

### Example: Stopwatch / Timer Cleanup

```tsx
import { useState, useRef } from "react";

export function Stopwatch() {
  const [seconds, setSeconds] = useState(0);

  // Store timer ID in a ref so mutating it doesn't cause a re-render
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current !== null) return;

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Reset ref
    }
  };

  return (
    <div>
      <h2>Time: {seconds}s</h2>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

---

## Scenario 3: Storing Previous State or Prop Values

Since mutating a ref does not trigger a re-render, you can record state inside `useEffect` to compare a current prop/state value against its value from the previous render.

### Example: Tracking Previous State Value

```tsx
import { useState, useEffect, useRef } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef<number>(0);

  useEffect(() => {
    // Update ref AFTER render completes
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCountRef.current}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

---

## Scenario 4: Preventing the First/Initial Execution of a `useEffect`

`useEffect` always runs after the initial component mount. If you want an effect to run **only when a dependency updates** (skipping the first mount), use a ref as a flag.

### Example: Skip Effect on Initial Mount

```tsx
import { useState, useEffect, useRef } from "react";

export function UserProfile({ userId }: { userId: string }) {
  const [data, setData] = useState(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      // Skip running logic on initial mount
      isInitialMount.current = false;
      return;
    }

    console.log(`User ID changed to: ${userId}. Fetching updated analytics...`);
  }, [userId]);

  return <div>Profile for user: {userId}</div>;
}
```

---

## Scenario 5: Storing Mutable Instances (e.g., Third-Party Library Objects)

When initializing non-React instances (like WebSocket connections, Chart.js instances, or Mapbox maps), storing them in `useRef` ensures they persist for the lifetime of the component without re-initializing on every render.

### Example: Maintaining a Single WebSocket Connection

```tsx
import { useEffect, useRef } from "react";

export function LiveChat() {
  // Store active WebSocket instance
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket once on mount
    socketRef.current = new WebSocket("wss://example.com/chat");

    socketRef.current.onmessage = (event) => {
      console.log("New message received:", event.data);
    };

    return () => {
      // Clean up connection on unmount
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = (msg: string) => {
    // Use the persistent socket instance
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    }
  };

  return <button onClick={() => sendMessage("Hello!")}>Send Hello</button>;
}
```

---

## Summary Matrix

| Scenario                                                      | Use `useState` | Use `useRef`            |
| ------------------------------------------------------------- | -------------- | ----------------------- |
| **Values rendered directly in UI / JSX**                      | ✅ Yes         | ❌ No (UI won't update) |
| **Direct DOM Manipulation** (`.focus()`, `.scrollIntoView()`) | ❌ No          | ✅ Yes                  |
| **Storing Timers, Intervals, or Animation Frame IDs**         | ❌ No          | ✅ Yes                  |
| **Tracking Previous Props or State**                          | ❌ No          | ✅ Yes                  |
| **Third-Party Class/Instance Storage** (WebSocket, Chart.js)  | ❌ No          | ✅ Yes                  |

By default, standard React components cannot receive a `ref` attribute—React reserves `ref` as a top-level prop (similar to `key`) and ignores it if passed to a standard custom component.

To pass a `ref` through a child component down to a native HTML DOM node, you wrap the child component using **`forwardRef`** in React 18, or pass `ref` directly as a standard prop in **React 19**.

---

## 1. React 18: Using `forwardRef`

In React 18 and earlier, wrap your child component function with `React.forwardRef()`. The render function receives two arguments: `props` and `ref`.

### Child Component (`CustomInput.tsx`)

```tsx
import { forwardRef } from "react";

interface CustomInputProps {
  label: string;
  placeholder?: string;
}

// forwardRef takes two generic parameters: <HTMLTargetType, PropsType>
export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, placeholder }, ref) => {
    return (
      <label className="input-group">
        <span>{label}</span>
        {/* Pass the forwarded ref down to the native HTML element */}
        <input ref={ref} type="text" placeholder={placeholder} />
      </label>
    );
  },
);

// Optional: Set displayName for cleaner debugging in React DevTools
CustomInput.displayName = "CustomInput";
```

### Parent Component (`Parent.tsx`)

```tsx
import { useRef } from "react";
import { CustomInput } from "./CustomInput";

export function ParentForm() {
  // Create a ref pointing to the HTMLInputElement inside the child
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <CustomInput
        ref={inputRef}
        label="Username"
        placeholder="Enter username..."
      />
      <button onClick={handleFocus}>Focus Child Input</button>
    </div>
  );
}
```

---

## 2. React 19: Direct `ref` as a Prop (No `forwardRef` Needed)

In **React 19**, `forwardRef` is deprecated. React treat `ref` as a normal prop, meaning you can pass `ref` directly into functional components without wrapping them!

### Child Component in React 19

```tsx
interface CustomInputProps {
  label: string;
  // Declare 'ref' directly in props
  ref?: React.Ref<HTMLInputElement>;
}

export function CustomInput({ label, ref }: CustomInputProps) {
  return (
    <label className="input-group">
      <span>{label}</span>
      <input ref={ref} type="text" />
    </label>
  );
}
```

---

## When to Use Ref Forwarding

- **Re-usable Component Libraries:** Passing refs to custom inputs, buttons, or modals so consumers can measure DOM nodes or handle focus.
- **Managing Focus/Scroll:** Triggering `.focus()`, `.scrollIntoView()`, or media controls (`.play()`, `.pause()`) on native child elements.
- **Integrating with Third-Party DOM Libraries:** Attaching libraries like D3, Chart.js, or GSAP directly to child DOM nodes.

Explain how useImperativeHandle works with useRef to expose custom child functions.

By default, passing a `ref` down to a child component (using `forwardRef` in React 18 or direct `ref` props in React 19) exposes the **entire raw DOM node** (e.g., `<input>`) to the parent.

**`useImperativeHandle`** is a built-in React hook that lets you **customize and restrict** what the parent component can access through that `ref`. Instead of exposing the whole DOM element, you choose exact custom methods or properties to expose.

---

## Why Use `useImperativeHandle`?

1. **Encapsulation & Security:** Keeps internal component implementation details private. The parent can't arbitrarily mutate DOM styles or attributes.
2. **Exposing Custom Actions:** Lets the child expose higher-level methods (e.g., `reset()`, `scrollToBottom()`, or `validate()`) instead of raw DOM manipulation.

---

## Syntax and Structure

`useImperativeHandle` accepts three arguments:

```tsx
useImperativeHandle(ref, createHandle, [dependencies]);
```

1. **`ref`**: The ref forwarded from the parent.
2. **`createHandle`**: A function returning an object containing the custom methods exposed to the parent.
3. **`[dependencies]`** _(optional)_: Dependency array for the handle function (re-creates the handle if dependencies change).

---

## Real-World Example: Custom Video Player Controls

Here, a child `<VideoPlayer>` hides its internal `<video>` tag and exposes _only_ custom `.play()`, `.pause()`, and `.reset()` methods to the parent.

### Child Component (`VideoPlayer.tsx`)

```tsx
import { useRef, useImperativeHandle, forwardRef } from "react";

// 1. Define the TypeScript interface for exposed custom methods
export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  reset: () => void;
}

interface VideoPlayerProps {
  src: string;
}

// React 18 syntax with forwardRef (or direct ref prop in React 19)
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src }, ref) => {
    // Internal ref bound to the actual <video> DOM element
    const videoRef = useRef<HTMLVideoElement>(null);

    // 2. Customize the object exposed to the parent via 'ref'
    useImperativeHandle(ref, () => ({
      play() {
        videoRef.current?.play();
      },
      pause() {
        videoRef.current?.pause();
      },
      reset() {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      },
    }));

    return <video ref={videoRef} src={src} width="400" />;
  },
);

VideoPlayer.displayName = "VideoPlayer";
```

### Parent Component (`App.tsx`)

```tsx
import { useRef } from "react";
import { VideoPlayer, VideoPlayerRef } from "./VideoPlayer";

export function App() {
  // 3. Create ref typed with VideoPlayerRef
  const playerRef = useRef<VideoPlayerRef>(null);

  return (
    <div>
      <VideoPlayer ref={playerRef} src="https://example.com/video.mp4" />

      {/* Parent calls exposed imperative methods safely */}
      <button onClick={() => playerRef.current?.play()}>Play</button>
      <button onClick={() => playerRef.current?.pause()}>Pause</button>
      <button onClick={() => playerRef.current?.reset()}>Reset Video</button>
    </div>
  );
}
```

---

## Summary Checklist for `useImperativeHandle`

- **Pairing:** Always pair `useImperativeHandle` with `useRef` and `forwardRef` (or a `ref` prop).
- **Declarative First:** Avoid overusing `useImperativeHandle`. Most parent-child communication should happen declaratively via props and state.
- **Best Use Cases:** Modals (`open()`, `close()`), form controls (`focus()`, `clear()`, `validate()`), media controls (`play()`, `seek()`), and animations.

In React, the standard way to access a DOM element is by using **`useRef`**.

## Accessing a DOM Element

```jsx
import { useRef } from "react";

function SearchBox() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```

**How it works:**

- `useRef(null)` creates a ref object.
- React assigns the DOM element to `inputRef.current`.
- You can then call DOM methods such as `focus()`, `scrollIntoView()`, etc.

---

# Production Use Cases of `useRef`

## 1. Auto-Focus a Form Field

**Scenario:** Login page should focus the username field when loaded.

```jsx
const usernameRef = useRef();

useEffect(() => {
  usernameRef.current.focus();
}, []);
```

**Used in:** Login forms, search bars, OTP screens.

---

## 2. Scroll to a Section

**Scenario:** Clicking "View Details" should scroll to the details section.

```jsx
const detailsRef = useRef();

const showDetails = () => {
  detailsRef.current.scrollIntoView({
    behavior: "smooth",
  });
};
```

**Used in:** E-commerce product pages, FAQs, landing pages.

---

## 3. Store Previous Value Without Re-rendering

**Scenario:** Compare the current and previous search term.

```jsx
const previousSearch = useRef("");

useEffect(() => {
  previousSearch.current = searchText;
}, [searchText]);
```

**Used in:** Analytics, change detection, audit tracking.

---

## 4. Timer / Interval IDs

**Scenario:** Stop a polling API call.

```jsx
const intervalRef = useRef();

useEffect(() => {
  intervalRef.current = setInterval(fetchData, 5000);

  return () => clearInterval(intervalRef.current);
}, []);
```

**Used in:** Dashboards, stock prices, chat applications.

---

## 5. Prevent Unnecessary Re-renders

Unlike `useState`, updating a ref does **not** trigger a re-render.

```jsx
const renderCount = useRef(0);

renderCount.current++;
```

**Used in:** Performance tracking and caching values.

---

## 6. Integrating Third-Party Libraries

**Scenario:** Initialize a chart or map.

```jsx
const chartRef = useRef();

useEffect(() => {
  const chart = new Chart(chartRef.current, config);
}, []);
```

**Used in:**

- Chart.js
- D3.js
- Google Maps
- Video players

---

## 7. Detect Click Outside a Component

**Scenario:** Close a dropdown when the user clicks elsewhere.

```jsx
const dropdownRef = useRef();

useEffect(() => {
  const handleClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  document.addEventListener("click", handleClick);

  return () => document.removeEventListener("click", handleClick);
}, []);
```

**Used in:** Dropdowns, modals, tooltips.

---

## 8. Managing Video or Audio Elements

```jsx
const videoRef = useRef();

const playVideo = () => {
  videoRef.current.play();
};
```

**Used in:** Streaming platforms, e-learning portals.

---

## 9. Avoid Duplicate API Calls

**Scenario:** Ensure an API is called only once.

```jsx
const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return;

  hasFetched.current = true;
  fetchUsers();
}, []);
```

**Used in:** Initial data loading and React Strict Mode workarounds.

---

## 10. Store Mutable Values Across Renders

```jsx
const websocketRef = useRef(null);

useEffect(() => {
  websocketRef.current = new WebSocket(url);

  return () => websocketRef.current.close();
}, []);
```

**Used in:** Chat apps, real-time dashboards, notification systems.

---

## React Interview Question

**Q:** What is the difference between `useRef` and `useState`?

| useRef                   | useState          |
| ------------------------ | ----------------- |
| Does not cause re-render | Causes re-render  |
| Stores mutable values    | Stores UI state   |
| Access DOM elements      | Drives UI updates |
| `ref.current = value`    | `setState(value)` |

### Real-world interview answer

> "`useRef` is primarily used for accessing DOM elements and storing mutable values that should persist across renders without triggering a re-render. Common production use cases include focusing inputs, scrolling, managing timers, integrating third-party libraries, tracking previous values, handling WebSocket instances, and detecting outside clicks."

When you have **multiple `useState` calls**, React may re-render the component whenever any state changes. React 18 automatically batches many updates, but there are still techniques to reduce unnecessary re-renders.

## 1. Combine Related State with `useReducer`

### Problem

```jsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
```

### Better

```jsx
const initialState = {
  firstName: "",
  lastName: "",
  email: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

**Use case:** Large forms, checkout pages, profile screens.

---

## 2. Memoize Child Components with `React.memo`

### Problem

Parent re-renders and all children re-render.

```jsx
const UserCard = React.memo(({ user }) => {
  return <div>{user.name}</div>;
});
```

**Use case:** Dashboard widgets, tables, product cards.

---

## 3. Use `useCallback` for Event Handlers

Without `useCallback`, a new function is created on every render.

```jsx
const handleSave = useCallback(() => {
  saveUser();
}, []);
```

Combined with `React.memo`, this prevents unnecessary child renders.

---

## 4. Use `useMemo` for Expensive Calculations

```jsx
const filteredUsers = useMemo(() => {
  return users.filter((user) => user.name.includes(searchText));
}, [users, searchText]);
```

**Use case:** Search, filtering, sorting large datasets.

---

## 5. Split State into Smaller Components

### Bad

```jsx
function Dashboard() {
  const [profile, setProfile] = useState();
  const [notifications, setNotifications] = useState();
  const [analytics, setAnalytics] = useState();
}
```

Every update re-renders the whole dashboard.

### Better

```jsx
<Profile />
<Notifications />
<Analytics />
```

Each component manages its own state.

---

## 6. Store Non-UI Values in `useRef`

If a value doesn't affect the UI, don't use state.

```jsx
const requestCount = useRef(0);

requestCount.current++;
```

Updating a ref does not trigger a re-render.

---

## 7. React 18 Automatic Batching

React batches multiple state updates in the same event.

```jsx
const handleClick = () => {
  setCount((c) => c + 1);
  setLoading(true);
  setMessage("Saved");
};
```

React performs a single re-render.

---

## Real-World Interview Scenario

### Scenario

A financial dashboard contains:

- User profile
- Portfolio summary
- Transaction list
- Notifications

Updating a notification should not re-render the entire dashboard.

### Solution

```jsx
const Notifications = React.memo(() => {
  // notification logic
});

const Portfolio = React.memo(() => {
  // portfolio logic
});
```

Use:

- `React.memo` for child components
- `useCallback` for handlers
- `useMemo` for expensive calculations
- `useReducer` for complex state
- `useRef` for mutable values that don't affect UI

### Interview Answer

> Multiple `useState` hooks themselves are not usually the problem because React batches updates. To mitigate unnecessary re-renders, use `React.memo` for child components, `useCallback` for stable function references, `useMemo` for expensive computations, `useReducer` for complex related state, and `useRef` for mutable values that shouldn't trigger UI updates. Also, split large components into smaller focused components so updates remain localized.
