`useState` is the core React Hook used to declare and manage **local state** inside a functional component.

When state updates, React re-renders the component to reflect the changes in the UI.

---

## 1. Basic Syntax

```tsx
import { useState } from 'react';

const [state, setState] = useState(initialState);

```

* **`state`**: The current value of the state variable.
* **`setState`**: The setter function used to update the state and trigger a re-render.
* **`initialState`**: The starting value (can be a primitive, object, array, or function).

---

## 2. Fundamental Patterns

### A. Updating State Directly

Pass the next value directly into the updater function:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

```

### B. Updating Based on Previous State (Functional Updates)

When the new state depends on the previous state—or when updates happen in rapid succession—pass a callback function. This avoids stale state bugs caused by closure snapshots:

```tsx
// ✅ Correct: Uses updater function to prevent stale state values
function IncrementThreeTimes() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}

```

### C. Updating Objects and Arrays

React state is treated as **immutable**. Never mutate objects or arrays directly—always create a new reference using the spread operator (`...`) or non-mutating array methods:

```tsx
// Objects
const [user, setUser] = useState({ name: 'Alex', age: 25 });

const updateAge = () => {
  setUser((prev) => ({ ...prev, age: prev.age + 1 }));
};

// Arrays
const [items, setItems] = useState(['Apple', 'Banana']);

const addItem = (newItem: string) => {
  setItems((prev) => [...prev, newItem]);
};

```

### D. Lazy State Initialization

If calculating the initial state involves heavy computation (e.g., parsing `localStorage`), pass a function to `useState` instead of executing the operation directly:

```tsx
// ❌ Bad: Runs on EVERY render
const [data, setData] = useState(expensiveComputation());

// ✅ Good: Runs ONLY ONCE during initial component mount
const [data, setData] = useState(() => expensiveComputation());

```

---

## 3. Crucial Rules & Gotchas

1. **Top-Level Only:** Call `useState` at the top level of your component. Do NOT call it inside loops, conditions, or nested functions.
2. **Updates Are Asynchronous & Batched:** Calling `setState` does **not** update the local variable immediately on the next line of code. React batches state updates within event handlers to optimize rendering performance.
3. **Reference Comparison (`Object.is`):** If you pass the exact same value (by memory reference) to `setState`, React skips re-rendering the component.

---

## 4. Modern React Alternatives

Depending on your use case, `useState` might not always be the optimal choice:

| Use Case                                     | Preferred Alternative                |
| -------------------------------------------- | ------------------------------------ |
| Complex state logic with multiple sub-values | `useReducer`                         |
| Global or deeply nested state                | React Context API, Zustand, or Jotai |
| Form actions & server mutations (React 19+)  | `useActionState`                     |
| Instant UI feedback during async actions     | `useOptimistic`                      |

Compare useState and useReducer in React with code examples.
Both **`useState`** and **`useReducer`** are built-in React hooks used to manage local component state. While they serve the same underlying purpose—triggering a re-render when state changes—they handle state updates differently.

---

### Core Comparison

| Metric               | `useState`                                                                      | `useReducer`                                                                      |
| -------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Primary Use Case** | Independent, simple state variables (strings, numbers, booleans, simple forms). | Complex state shapes, nested objects, or multiple interdependent state variables. |
| **Update Mechanism** | Direct value setting or functional updates: `setState(newValue)`.               | Dispatching action objects: `dispatch({ type, payload })`.                        |
| **Logic Location**   | Event handlers inside the component.                                            | Centralized inside an external reducer function.                                  |
| **Testing**          | Requires rendering the component to test handler logic.                         | Reducer functions are pure functions and can be unit-tested in isolation.         |
| **Code Footprint**   | Low boilerplate.                                                                | Moderate boilerplate (actions, switch/case statements, initial state).            |

---

### Example 1: `useState` (Best for Simple State)

`useState` is ideal when managing independent pieces of state or basic UI toggles.

```tsx
import React, { useState } from 'react';

export function SimpleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
      <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

```

---

### Example 2: `useReducer` (Best for Interdependent/Complex State)

`useReducer` shines when managing state objects where **multiple properties change together** or when state transitions depend on specific business rules.

#### Scenario: Form State with Validation, Loading, and Error States

```tsx
import React, { useReducer } from 'react';

// 1. Define State and Action Types
interface FormState {
  username: string;
  email: string;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string };

const initialState: FormState = {
  username: '',
  email: '',
  isSubmitting: false,
  error: null,
  success: false,
};

// 2. Pure Reducer Function (Isolated from Component Rendering)
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        error: null, // Clear errors as user types
      };
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };
    case 'SUBMIT_SUCCESS':
      return {
        ...initialState, // Reset fields on success
        success: true,
      };
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        error: action.error,
      };
    default:
      return state;
  }
}

// 3. Component
export function ComplexForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });

    try {
      // Simulate API Call
      await new Promise((res, rej) =>
        setTimeout(() => (state.email.includes('@') ? res(true) : rej('Invalid Email')), 1000)
      );
      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'SUBMIT_ERROR', error: String(err) });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '300px' }}>
      {state.success && <p style={{ color: 'green' }}>Form submitted successfully!</p>}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

      <input
        type="text"
        placeholder="Username"
        value={state.username}
        onChange={(e) =>
          dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value })
        }
        disabled={state.isSubmitting}
      />

      <input
        type="email"
        placeholder="Email"
        value={state.email}
        onChange={(e) =>
          dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })
        }
        disabled={state.isSubmitting}
      />

      <button type="submit" disabled={state.isSubmitting}>
        {state.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

```

---

### When to Choose Which?

* **Use `useState` when:**

1. The state consists of primitives (strings, numbers, booleans).
2. State variables are independent of one another (e.g., `isOpen`, `selectedId`).
3. The update logic is simple (e.g., `setCount(c => c + 1)`).

* **Use `useReducer` when:**

1. Multiple state variables update in response to a single event (e.g., fetching data updates `isLoading`, `data`, and `error` simultaneously).
2. The next state depends heavily on the previous state.
3. You want to extract complex business logic out of the component file for unit testing.
4. You are passing `dispatch` down through deep component trees via Context (dispatch functions have stable references across re-renders).
