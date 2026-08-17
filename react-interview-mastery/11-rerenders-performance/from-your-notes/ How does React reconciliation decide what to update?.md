React reconciliation uses a heuristic diffing algorithm to compare the newly returned Virtual DOM tree with the previous Virtual DOM tree. Rather than using an $O(n^3)$ tree comparison algorithm, React optimizes this to an $O(n)$ process based on two primary assumptions:

---

### 1. Element Type Comparison

React compares the root elements of the old and new Virtual DOM trees:

* **Different Element Types:** If two elements have different types (e.g., changing from `<div>` to `<section>`, or from `<Header>` to `<Navbar>`), React treats the entire subtree as changed. It unmounts the old tree, completely destroys its DOM nodes and state, and mounts the newly built tree from scratch.
* **Same Element Type:** If two elements have the same type (e.g., `<div className="old">` vs `<div className="new">`), React keeps the existing DOM node, compares the attributes/props, and updates **only the modified properties** (such as `className` or `style`).

---

### 2. Recursing on Children & The `key` Prop

When comparing children of DOM nodes, React iterates over both lists of children simultaneously:

* **Without Keys:** If you insert an item at the beginning of a list, React compares the 1st old child with the 1st new child, sees a difference, and updates it. It then compares the 2nd old child with the 2nd new child, sees a difference, and updates it. This leads to inefficient, full-list DOM mutations.
* **With Stable Keys:** By providing a unique, stable `key` prop (e.g., `<li key={user.id}>`), React matches children across renders. Even if list items are reordered, inserted, or removed, React moves or updates only the specific DOM nodes whose keys or props actually changed.

---

### 3. Component Re-rendering Triggers

At the component level, React marks a component branch for reconciliation when:

1. **State Changes:** `useState` or `useReducer` updates trigger a re-render of that component and its children.
2. **Context Changes:** A subscribed `useContext` value changes.
3. **Parent Re-renders:** By default, when a parent component re-renders, **all of its children re-render recursively**, regardless of whether their props changed—unless wrapped in performance optimizations like `React.memo` or using `PureComponent`.

---

### The Fiber Architecture (Render vs. Commit Phase)

React splits the reconciliation process into two distinct phases:

```text
 ┌────────────────────────────────────────────────────────┐
 │ 1. RENDER PHASE (Asynchronous / Interruptible)         │
 │ • Traverses Fiber tree                                 │
 │ • Computes differences (diffing)                       │
 │ • Flags DOM changes (Insertion, Update, Deletion)     │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │ 2. COMMIT PHASE (Synchronous / Uninterruptible)       │
 │ • Applies flagged mutations directly to the DOM        │
 │ • Runs lifecycle hooks (useLayoutEffect ➔ useEffect)   │
 └────────────────────────────────────────────────────────┘

```

1. **Render Phase:** React builds a work-in-progress **Fiber Tree** in memory to calculate the minimal set of changes. In React 18+ (Concurrent Mode), this phase can be paused, resumed, or discarded to keep high-priority browser events (like typing or clicks) responsive.
2. **Commit Phase:** React applies the calculated diffs (mutations) to the actual DOM in a single, synchronous pass to ensure visual consistency.
