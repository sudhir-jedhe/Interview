Here is a curated list of interview questions focused specifically on the **`useState`** hook, ranging from basic concepts to advanced React rendering behaviors.

### Junior / Entry-Level

**1. What is `useState` and what does it return?**

* **What they are looking for:** A basic understanding of the syntax. You should explain that `useState` is a hook that allows functional components to hold and manage local state. It returns an array with exactly two elements: the current state value, and a function to update that state. (Mentioning array destructuring is a plus).

**2. How do you update an object or an array stored in `useState`?**

* **What they are looking for:** The concept of **immutability**. You must never mutate state directly (e.g., `state.name = "John"`). Instead, you must create a completely new object or array reference, typically using the spread operator: `setState({ ...state, name: "John" })` or `setArray([...array, newItem])`.

**3. What happens when you call the state updater function?**

* **What they are looking for:** Understanding the React lifecycle. Calling the updater function tells React that the component's state has changed, which queues a **re-render** of that component and all of its children with the new state value.

---

### Mid-Level

**4. Why does `console.log(state)` immediately after calling `setState(newValue)` print the old state?**

* **What they are looking for:** Understanding of closures and how React batches updates. The `setState` function does not mutate the current state variable; it requests a future re-render with the new value. The `console.log` runs in the current render cycle (closure), which still holds the old value.

**5. What is the "updater function" (or functional update) form of `setState`, and when should you use it?**

* **What they are looking for:** Knowing how to use `setState(prevState => prevState + 1)`. You should explain that this is required when your new state depends on the previous state. Because state updates can be batched or delayed, using the current state variable directly might result in a "stale closure" (calculating the new state based on outdated information).

**6. What is "lazy initialization" in `useState`?**

* **What they are looking for:** Knowing how to pass a function instead of a value to the initial state: `useState(() => computeExpensiveValue())`. You should explain that if you pass a direct value (like a heavy calculation or `localStorage.getItem`), it runs on *every single render*, even though React only uses it on the first render. Passing a function ensures the heavy computation is only executed once during the initial mount.

---

### Senior / Advanced Level

**7. How does React handle multiple `setState` calls in the same function? What changed in React 18?**

* **What they are looking for:** Knowledge of **Automatic Batching**. If you call `setCount` and `setTheme` in the same function, React batches them together and only triggers one re-render for performance.
* **The React 18 detail:** Before React 18, batching only happened inside React event handlers (like `onClick`). Inside `setTimeout` or Promises, it would trigger multiple re-renders. React 18 introduced universal Automatic Batching, meaning updates inside timeouts and fetch promises are now also batched into a single render.

**8. If you call `setState` with the exact same value it currently holds, what does React do?**

* **What they are looking for:** Knowledge of React's bailout mechanism. React uses the `Object.is()` comparison algorithm to compare the new state to the old state. If they are exactly the same, React "bails out" and skips re-rendering the component and its children entirely.

**9. When would you choose `useReducer` instead of `useState`?**

* **What they are looking for:** Architectural decision-making. You should use `useState` for simple, independent variables (like booleans, strings, or simple objects). You should transition to `useReducer` when state logic becomes complex, when multiple sub-values depend on each other, or when the next state depends heavily on the previous state and requires specific actions (like managing a complex form or a shopping cart).
