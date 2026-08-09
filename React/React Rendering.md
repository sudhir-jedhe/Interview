When state or props change in a React application, React undergoes a structured lifecycle to figure out what changed and safely update the screen. This entire process is divided into three main stages: **Trigger Phase**, **Render Phase**, and **Commit Phase**.

---

### 1. Trigger Phase (State Update)

Every update starts with a trigger that signals to React that the UI needs to change.

* **Cause:** A state update occurs via `useState` setter functions (e.g., `setCount`), `useReducer`, or receiving new props from a parent component.
* **Action:** React flags the component and schedules it for a re-render.

---

### 2. Render Phase (Computation & Virtual DOM)

The Render Phase is a **pure JavaScript calculation process**. No changes are made to the actual browser (Real) DOM during this phase.

1. **Component Execution:** React calls your functional component.
2. **Virtual DOM (VDOM) Creation:** Executing the component returns JSX, which React turns into a lightweight JavaScript representation of the UI called the **Virtual DOM Tree**.
3. **Diffing Algorithm:** React compares the newly generated Virtual DOM tree with the previous Virtual DOM tree (from before the state update).
4. **Reconciliation:** The process of comparing these two trees and identifying the exact nodes that changed, added, or removed is called **Reconciliation**.
5. **Output:** React generates a minimal list of required updates (mutations) to be applied to the real DOM.

> **Note:** Performance optimizations like `React.memo`, `useMemo`, and `useCallback` work during this phase by skipping component execution if props or dependencies haven't changed.

---

### 3. Commit Phase (Real DOM Update)

Once React calculates what needs to change, it enters the Commit Phase to apply those changes.

1. **Real DOM Mutation:** React updates only the specific nodes in the Real DOM that were flagged during the Render Phase. If 1 item in a list of 1,000 changed, React mutates only that single DOM node.
2. **Browser Painting:** Once the Real DOM is updated, the browser re-calculates styles, performs layout shifts, and **repaints** the pixels on the screen for the user to see.

---

### 4. Cleanup & Post-Commit Phase (Effects)

After the UI is painted on the screen:

* **`useLayoutEffect`:** Runs synchronously *after* DOM mutations, but *before* the browser repaints the screen.
* **`useEffect`:** Runs asynchronously *after* the browser has finished painting the UI to avoid blocking rendering.

---

### Process Summary Flowchart

```text
[State / Props Update]
          │
          ▼
┌──────────────────────────┐
│   1. Trigger Phase       │ ──> Schedules re-render for the component
└──────────────────────────┘
          │
          ▼
┌──────────────────────────┐
│   2. Render Phase        │ ──> Calls Component Function
│                          │ ──> Generates new Virtual DOM
│                          │ ──> Runs Diffing Algorithm (New vs Old VDOM)
│                          │ ──> Reconciliation (Identifies changes)
└──────────────────────────┘
          │
          ▼
┌──────────────────────────┐
│   3. Commit Phase        │ ──> Mutates Real DOM (Only changed elements)
└──────────────────────────┘
          │
          ▼
┌──────────────────────────┐
│   4. Browser Paint       │ ──> Screen updates for the user
└──────────────────────────┘
          │
          ▼
┌──────────────────────────┐
│   5. Effects Execution   │ ──> useEffect hooks run asynchronously
└──────────────────────────┘

```
