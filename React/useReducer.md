Here is a curated list of interview questions focused on the **`useReducer`** hook, ranging from fundamental concepts to advanced architecture decisions.

### Junior / Entry-Level

**1. What is `useReducer` and how does it differ from `useState`?**

* **What they are looking for:** You should explain that `useReducer` is an alternative to `useState` for managing more complex local state. While `useState` is great for simple, independent values, `useReducer` is better when state logic involves multiple sub-values, deep objects, or when the next state depends heavily on the previous state.

**2. What arguments does `useReducer` take, and what does it return?**

* **What they are looking for:** Knowledge of the syntax. It takes two primary arguments: a **reducer function** and an **initial state** (and an optional third argument for lazy initialization). It returns an array with exactly two elements: the **current state** and a **dispatch function** used to trigger state updates.

**3. What is an "action" in the context of `useReducer`?**

* **What they are looking for:** An action is a standard JavaScript object dispatched to the reducer to describe *what happened*. By convention, it usually has a `type` property (a string like `'ADD_TODO'`) and a `payload` property containing any data needed to perform the update.

---

### Mid-Level

**4. What is a "reducer function" and what are its strict rules?**

* **What they are looking for:** You must emphasize that a reducer is a **pure function** that takes the current `state` and an `action`, and returns a completely new `state`.
* **The Golden Rules:** It must *never* mutate the existing state directly (always return a new object/array), and it must *never* contain side effects (no API calls, no random numbers, no local storage manipulation inside the reducer).

**5. How do you implement "lazy initialization" with `useReducer`?**

* **What they are looking for:** You should explain the third argument of `useReducer`. If you pass an `init` function as the third argument, React will pass the initial state (the second argument) into this function to calculate the starting state. This is useful for expensive calculations or reading from `localStorage` so it only runs once on the initial mount, not on every re-render.

**6. Why is a `switch` statement commonly used inside a reducer?**

* **What they are looking for:** While not strictly required, a `switch` statement evaluating `action.type` is the cleanest and most readable way to handle multiple different state transitions in a single function. You should also mention returning the default `state` (or throwing an error) in the `default` case to handle unknown actions.

---

### Senior / Advanced Level

**7. How do you handle asynchronous operations (like fetching data) with `useReducer`?**

* **What they are looking for:** This is a trap question. You **cannot** do async operations inside a reducer function because reducers must be pure and synchronous.
* **The Solution:** You must perform the asynchronous logic (like `fetch()`) *inside* a `useEffect` or an event handler, and then `dispatch` synchronous actions based on the promise's lifecycle (e.g., dispatching `'FETCH_START'`, then awaiting the data, then dispatching `'FETCH_SUCCESS'` or `'FETCH_ERROR'`).

**8. When would you choose `useReducer` + `useContext` over a global state library like Redux or Zustand?**

* **What they are looking for:** Architectural nuance. Combining `useReducer` and `useContext` is great for medium-scale state (like theme, auth, or a complex multi-step form) without adding third-party dependencies.
* **The Caveat:** You must mention performance. Native Context triggers a re-render for *every* consumer when the state changes. Redux and Zustand use selectors to prevent unnecessary re-renders. Therefore, native Context + Reducer is bad for high-frequency updates (like tracking mouse movements or rapid keystrokes) but excellent for low-frequency global state.

**9. How do you avoid unnecessary re-renders when passing a `dispatch` function down via Context?**

* **What they are looking for:** You should explain that the `dispatch` function returned by `useReducer` has a stable identity—it does not change between re-renders. However, if you pass `{ state, dispatch }` in a single Context value object, that object gets recreated every render, causing all children to re-render.
* **The Fix:** You should split them into two separate contexts: a `StateContext` and a `DispatchContext`. Components that only need to trigger actions can consume the `DispatchContext` without being forced to re-render when the state updates.
