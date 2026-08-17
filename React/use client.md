**`'use client'`** is a directive used in React Server Components (RSC) architecture to mark the boundary between server-side code and client-side code. It explicitly tells the bundler that the file and its imported dependency tree belong on the client.

---

## 1. Reference & How It Works

### `'use client'` Directive

* Placing `'use client'` at the very top of a file (before any imports) defines a **Client Boundary**.
* Everything inside that file, as well as any component imported into it, is included in the JavaScript bundle sent to the browser and executed on the client.

---

## 2. When to Use `'use client'`

You need to use `'use client'` whenever your component requires features that only exist or run in the browser:

1. **State and Lifecycle:** Using Hooks like `useState`, `useReducer`, `useEffect`, or `useLayoutEffect`.
2. **Browser APIs:** Accessing `window`, `document`, `localStorage`, geolocation, or canvas.
3. **Event Listeners:** Handling user interactions like `onClick`, `onChange`, `onSubmit`, or `onMouseEnter`.
4. **Custom Hooks:** Writing or using custom hooks that rely on state, effects, or browser APIs.

---

## 3. Usage Scenarios

### Building with interactivity and state

Server Components are purely static and cannot manage state. If you need a button to toggle a dropdown, open a modal, or manage form inputs, that specific interactive piece must be wrapped in a Client Component.

```jsx
// File: Counter.jsx
'use client'; // Marks this as a Client Component boundary

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}

```

### Using client APIs

If your component needs to read from `window.innerWidth` or store data in `localStorage`, it must be a Client Component since those objects do not exist on the server.

### Using third-party libraries

Many third-party UI libraries (like UI component libraries or charting tools) rely heavily on React state, effects, or browser DOM manipulation. To use them inside a Server Component application, you must import them into a file marked with `'use client'`.

---

## 4. Serializable Types Passed from Server to Client

When a Server Component passes data down to a Client Component as props, that data must cross the network boundary between the server and the client. Therefore, props must be **serializable**:

* **Allowed:** Primitives (strings, numbers, booleans, null, undefined), arrays, plain objects, and **React elements** (like JSX nodes).
* **Not Allowed:** Functions, class instances, dates, or promises (unless unwrapped using `use()`).
