When a button click increases a count by more than one (often doubling, tripling, or jumping unexpectedly), it is almost always caused by one of four common issues in React:

---

### 1. React `StrictMode` Double-Executing Event Handlers in Development

If you have written state logic that **directly mutates variables outside of state**, or if you are calling an impure function inside your event handler or render body, React 18+ `StrictMode` will invoke it twice in development mode to catch bugs.

#### ❌ The Bug (Direct Mutation or Impure Increments)

```jsx
let globalCount = 0; // External variable

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    globalCount++; // Impure side-effect inside handler!
    setCount(globalCount);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}

```

#### ✅ The Fix

Always use functional state updates based strictly on the previous React state value:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}

```

---

### 2. Invoking the Function Immediately in JSX (`onClick={handleClick()}`)

A very common beginner mistake is placing parentheses `()` after the function name inside `onClick`. This **executes the function immediately during rendering**, which triggers a state update, forcing another render, and creating an infinite loop or multiple increments.

#### ❌ The Bug

```jsx
// ❌ Instantly runs on render, NOT on click!
<button onClick={handleClick()}>Increment</button>

```

#### ✅ The Fix

Pass the function reference without parentheses, or wrap it in an anonymous callback:

```jsx
// ✅ Correct: Passes the function reference
<button onClick={handleClick}>Increment</button>

// ✅ Correct: Passes an anonymous callback
<button onClick={() => handleClick()}>Increment</button>

```

---

### 3. Event Bubbling (Duplicate Listeners on Parent & Child)

If your button is nested inside another element (like a `<div>`, `<form>`, or `<card>`) that *also* has a click listener, clicking the button triggers **both** click handlers due to DOM event bubbling.

#### ❌ The Bug

```jsx
<div onClick={handleIncrement}> {/* Listener 1 */}
  <button onClick={handleIncrement}>Increment</button> {/* Listener 2 */}
</div>

```

*Clicking the button fires `handleIncrement` twice (once for button, once for parent div).*

#### ✅ The Fix

Stop propagation in the child button's handler:

```jsx
const handleButtonClick = (e) => {
  e.stopPropagation(); // Prevents event from bubbling up to parent
  setCount((prev) => prev + 1);
};

```

---

### 4. Duplicate Event Listeners Attached in `useEffect`

If you are attaching a global native DOM event listener inside `useEffect` (e.g., `window.addEventListener('click', ...)`), and you forget to provide a **cleanup function**, every single render will attach *another* event listener to the window.

#### ❌ The Bug

```jsx
useEffect(() => {
  window.addEventListener('click', handleIncrement);
  // Missing cleanup! Every re-render adds another listener!
});

```

#### ✅ The Fix

Add a cleanup function and appropriate dependency array:

```jsx
useEffect(() => {
  window.addEventListener('click', handleIncrement);

  // Cleanup function removes listener when component unmounts or updates
  return () => {
    window.removeEventListener('click', handleIncrement);
  };
}, []);

```

---

### Summary Diagnostic Checklist

| Cause                           | Symptoms                                                   | How to Verify                                                          |
| ------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Parentheses in JSX**          | Count updates continuously or jumps instantly on page load | Check for `onClick={handleClick()}`                                    |
| **Event Bubbling**              | Count increases by +2 on every click                       | Check if a parent `<div>` or `<form>` also has `onClick`               |
| **Missing `useEffect` Cleanup** | Count jumps by +1, then +2, +3, +4 on subsequent clicks    | Check `useEffect` for `addEventListener` without `removeEventListener` |
| **StrictMode Impurity**         | Count increments by +2 only in local dev environment       | Check if you are mutating variables outside React state                |

In React 18, **Automatic Batching** is a feature where React automatically groups multiple state updates triggered within the same event loop tick into a single re-render. This improves performance by avoiding unnecessary intermediate renders.

However, how automatic batching behaves when you update state multiple times in a row depends directly on whether you pass a **direct value** (`setCount(c + 1)`) or a **functional update** (`setCount(c => c + 1)`).

---

### Scenario 1: Passing Direct Values — `setCount(c + 1)`

If you call `setCount(c + 1)` multiple times synchronously inside an event handler:

```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1); // setCount(0 + 1) -> 1
  setCount(count + 1); // setCount(0 + 1) -> 1
  setCount(count + 1); // setCount(0 + 1) -> 1
};

```

#### What Happens

1. During the execution of `handleClick`, the value of `count` in the current render scope is constant (`0`).
2. Each call evaluates to `setCount(0 + 1)`.
3. React **batches** all three updates into a single re-render at the end of the handler.
4. **Final Result:** `count` becomes **`1`**, not `3`.

---

### Scenario 2: Passing a Functional Update — `setCount(c => c + 1)`

If you pass an updater function (`c => c + 1`):

```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount((c) => c + 1); // Queue: [c => c + 1]
  setCount((c) => c + 1); // Queue: [c => c + 1]
  setCount((c) => c + 1); // Queue: [c => c + 1]
};

```

#### What Happens

1. Instead of computing the next state value immediately using a stale closed-over variable, React adds each updater function to a **pending state queue**.
2. React **still batches** all three calls so that **only 1 re-render occurs**.
3. During that single re-render, React processes the queue sequentially:

* First function receives `0` $\rightarrow$ returns `1`
* Second function receives `1` $\rightarrow$ returns `2`
* Third function receives `2` $\rightarrow$ returns `3`

1. **Final Result:** `count` becomes **`3`** (after a single re-render).

---

### How React 18 Expanded Automatic Batching

Before React 18, batching only worked inside native React event handlers (like button `onClick`s). State updates inside `setTimeout`, native `Promise.then` resolution, or asynchronous callbacks were **not** batched, causing a separate re-render for every call.

In React 18, **all state updates are automatically batched everywhere**:

```jsx
// React 18 automatically batches ALL of these into 1 single re-render:
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React 18 batches both updates -> Only 1 re-render occurs!
}, 1000);

```

---

### Opting Out of Automatic Batching

In rare edge cases where you need a state update to immediately flush to the DOM and force a re-render before running subsequent code, React 18 provides `flushSync`:

```jsx
import { flushSync } from 'react-dom';

const handleClick = () => {
  // Forces React to flush this state change and re-render the DOM immediately
  flushSync(() => {
    setCount((c) => c + 1);
  });
  
  // Runs after the DOM has been updated for the first count change
  flushSync(() => {
    setFlag((f) => !f);
  });
};

```

---

### Summary Checklist

| Pattern                                 | Batched into 1 Re-render? | Final Count (starting from 0)       |
| --------------------------------------- | ------------------------- | ----------------------------------- |
| `setCount(count + 1)` $\times 3$        | **Yes**                   | **`1`** (Stale closure value)       |
| `setCount(c => c + 1)` $\times 3$       | **Yes**                   | **`3`** (Queued functional updates) |
| Async / `setTimeout` updates (React 18) | **Yes**                   | Batched automatically               |
