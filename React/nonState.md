In a React function component, there are **three common ways** to store values, depending on how long you need them to persist.

## 1. Local Variable

```jsx
function Counter() {
  let count = 0;

  const increment = () => {
    count++;
    console.log(count);
  };

  return <button onClick={increment}>Increment</button>;
}
```

### Problem

A local variable is recreated on every render.

```jsx
let count = 0;
```

After a re-render, `count` goes back to `0`.

**Use case:** Temporary values used only during a single render.

---

## 2. `useRef` (Recommended for Non-State Values)

```jsx
import { useRef } from "react";

function Counter() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current++;
    console.log(countRef.current);
  };

  return <button onClick={increment}>Increment</button>;
}
```

### Benefits

- Persists across renders.
- Updating it does **not** trigger a re-render.
- Ideal for mutable values that are not displayed in the UI.

### Real-world examples

- Timer IDs
- Previous values
- WebSocket instances
- API request counters
- DOM element references

---

## 3. `useState` (When UI Must Update)

```jsx
const [count, setCount] = useState(0);
```

Use state when changing the value should update the UI.

---

## Interview Answer

> For a non-state or instance-like variable in a React function component, I would use `useRef`. A ref persists across renders and can store mutable values without causing a re-render when updated. This makes it suitable for timers, previous values, DOM references, WebSocket connections, and other data that should survive re-renders but does not need to be displayed in the UI. Local variables are recreated on every render, while `useState` should be used only when UI updates are required.
