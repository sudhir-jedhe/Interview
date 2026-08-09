In programming and React, a **side effect** is any operation that affects something outside the scope of the currently executing function, or interacts with the "outside world."

Because React component functions are supposed to be **pure** (given the same props and state, they should simply compute and return JSX), any logic that goes beyond returning JSX is considered a side effect.

---

## 1. What is a Side Effect?

Common examples of side effects in React include:

* **Fetching data** from an external API or database.
* **Manually manipulating the DOM** (e.g., calling `element.focus()` or updating `document.title`).
* **Setting up timers or intervals** (`setTimeout`, `setInterval`).
* **Subscribing to external services** (e.g., WebSockets, browser event listeners like `window.addEventListener('resize')`).
* **Writing to storage** (`localStorage.setItem()`).

---

## 2. When Does `useEffect` Run?

`useEffect` is designed to run **after React has finished rendering the component and updated the DOM**. This ensures your side effects don't block the browser from painting the screen for the user.

The exact timing of when `useEffect` executes depends on its **Dependencies Array** (the second argument):

### A. No Dependencies Array (`useEffect(() => {})`)

```tsx
useEffect(() => {
  console.log('Runs after EVERY render');
});

```

* **Runs:** On the initial mount **AND after every single re-render** (whenever any prop or state changes).
* **Cleanup:** Runs before every subsequent effect execution and when the component unmounts.

---

### B. Empty Dependencies Array (`useEffect(() => {}, [])`)

```tsx
useEffect(() => {
  console.log('Runs ONCE after initial mount');
}, []);

```

* **Runs:** Exactly **once** after the component renders on the screen for the first time (component mount).
* **Cleanup:** Runs once when the component unmounts (is removed from the DOM).

---

### C. With Specific Dependencies (`useEffect(() => {}, [count, userId])`)

```tsx
useEffect(() => {
  console.log('Runs when count or userId changes');
}, [count, userId]);

```

* **Runs:** On the initial mount, AND whenever the value of `count` or `userId` changes between renders.
* **Cleanup:** Runs before the effect executes again with new values, and when the component unmounts.

---

## 3. The Execution Lifecycle Sequence

When a component renders or re-renders, React follows this strict timeline:

1. **Render Phase:** React executes your component function and calculates the new virtual DOM.
2. **DOM Commit:** React updates the actual browser DOM.
3. **Browser Paint:** The browser draws the changes on the screen so the user sees the update.
4. **Cleanup Phase:** React executes the **cleanup function** from the *previous* `useEffect` (if dependencies changed).
5. **Effect Phase:** React executes the **new `useEffect` function**.

---

## 4. The Cleanup Function

If your `useEffect` returns a function, React treats it as a **cleanup function**:

```tsx
useEffect(() => {
  // 1. Setup Phase
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // 2. Cleanup Function
  return () => {
    clearInterval(timer); // Clears timer to prevent memory leaks!
  };
}, []);

```

React runs this cleanup function:

* Right before the effect re-runs (if dependencies change).
* When the component is about to unmount (leave the screen).
