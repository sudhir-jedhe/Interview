Just as different programming languages have their own idioms, React has core rules and conventions that ensure your application remains predictable, performant, and bug-free.

Here is a breakdown of the foundational **Rules of React**, focusing on component purity and hook constraints.

---

## 1. Components and Hooks Must Be Pure

Purity is the cornerstone of React's rendering model. A **pure function** is one that:

* **Always returns the exact same JSX/output** given the exact same props, state, and context.
* **Does not mutate** any variables, objects, or DOM nodes that existed *before* rendering started.

### Why does purity matter?

React relies on the ability to run your component and hook functions multiple times (re-rendering, concurrent rendering, or aborting renders) without changing the overall outcome. If your component has side effects directly inside its render body (such as modifying global variables, setting timers, or fetching data directly in render), your app will experience unpredictable UI glitches, race conditions, and synchronization bugs.

### Where do side effects belong?

Side effects (like subscriptions, network requests, manual DOM mutations, or timers) must be placed inside **Event Handlers** or **Effects (`useEffect`)**, never directly inside the render cycle of a Component or Custom Hook.

---

## 2. Rules of Hooks

Hooks are functions starting with `use` (like `useState`, `useEffect`, or custom hooks) that let you "hook into" React state and lifecycle features from function components. To ensure React can correctly associate state with the right component across multiple renders, you must follow two strict rules:

### Rule 1: Only Call Hooks at the Top Level

* **Do not call Hooks inside loops, conditions, or nested functions.**
* **Why:** React relies on the **chronological order** in which Hooks are called on every single render to map state variables correctly. If you place a Hook inside an `if` statement or a loop, a conditional branch could cause the hook call order to shift between renders, corrupting React's internal state mapping and crashing your app.

### Rule 2: Only Call Hooks from React Functions

* Only call Hooks from **React function components** or **custom Hooks** (functions whose names start with `use`).
* **Do not call Hooks from regular JavaScript functions, event handlers, or class components.**
* **Why:** This ensures that all stateful logic in a component is clearly visible and tied directly to React's component lifecycle.
