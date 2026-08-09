The **Render Phase** and **Commit Phase** are the two distinct stages React goes through every time it displays or updates a component on the screen.

React separates this work into two phases so it can pause, yield, or batch work in memory without showing an incomplete or glitched UI to the user.

---

## The 3-Step Screen Update Lifecycle

Think of React as a restaurant:

1. **Trigger:** A customer places an order (State or Prop change).
2. **Render Phase (In the Kitchen):** The chef prepares and cooks the dish in private.
3. **Commit Phase (At the Table):** The waiter delivers the meal to the customer (DOM update & Browser Paint).

```
   ┌───────────────────────────────────────────────────────────┐
   │ 1. TRIGGER                                                │
   │    • Initial Mount OR State Update (`setState`)           │
   └─────────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
   ┌───────────────────────────────────────────────────────────┐
   │ 2. RENDER PHASE (Pure & Synchronous / Concurrent)          │
   │    • Calls Component functions                            │
   │    • Computes new Virtual DOM                             │
   │    • Runs `useMemo` & `useCallback`                       │
   │    • Performs Diffing (Reconciliation)                    │
   └─────────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
   ┌───────────────────────────────────────────────────────────┐
   │ 3. COMMIT PHASE (Side Effects & Screen Paint)             │
   │    • Mutates actual DOM nodes                             │
   │    • Browser Paints pixels onto the screen                │
   │    • Runs `useLayoutEffect` (synchronously before paint)  │
   │    • Runs `useEffect` (asynchronously after paint)        │
   └───────────────────────────────────────────────────────────┘

```

---

## 1. The Render Phase

During the **Render Phase**, React determines **what changes need to be made to the screen**.

* **What Happens:**
* React executes your component function (and any child components recursively) to build a new **Virtual DOM tree**.
* React runs `useMemo` calculations and creates function references.
* React compares (diffs) the new Virtual DOM tree with the old Virtual DOM tree to calculate the minimal list of required DOM mutations.

* **Key Characteristics:**
* **No DOM Manipulation:** Nothing is drawn on screen yet.
* **Must Be Pure:** Component functions must have no side effects (no API fetches, no direct DOM mutations).
* **Interruptible:** In React 18+ Concurrent Mode, React can pause, resume, or abort the Render Phase if a higher-priority task (like typing in an input) comes in.

---

## 2. The Commit Phase

During the **Commit Phase**, React applies those calculated changes to the **actual browser DOM**.

* **What Happens:**

1. React mutates the real DOM (inserts, updates, or deletes nodes).
2. `useLayoutEffect` executes synchronously *before* the browser paints.
3. The browser paints the screen (**Browser Paint**), making the new UI visible to the user.
4. `useEffect` executes asynchronously *after* the browser paint.

* **Key Characteristics:**
* **Side Effects Occur Here:** Network requests, DOM measurements, and state subscriptions belong here.
* **Uninterruptible:** Once the Commit Phase begins, React completes it in one synchronous pass so the UI remains consistent.

---

## Quick Comparison Matrix

| Feature                   | Render Phase                                     | Commit Phase                                            |
| ------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| **Primary Goal**          | Figure out *what* changed (Virtual DOM Diffing). | Apply changes to the *actual* browser DOM.              |
| **DOM Access**            | ❌ No direct DOM access available.                | ✅ Real DOM is updated and accessible.                   |
| **Can it be paused?**     | ✅ Yes (Concurrent Rendering in React 18+).       | ❌ No (Must finish synchronously).                       |
| **Hooks Running Here**    | `useMemo`, `useCallback`                         | `useLayoutEffect` (Pre-paint), `useEffect` (Post-paint) |
| **Side Effects Allowed?** | ❌ **No!** Must remain pure functions.            | ✅ **Yes!** (Fetching, subscriptions, DOM mutation).     |
