React knows what changes in your application through a process called **Reconciliation**, which relies on a mechanism called the **Virtual DOM (VDOM)** and a heuristic algorithm called the **Diffing Algorithm**.

Here is the step-by-step breakdown of how React detects changes and updates the screen efficiently.

---

## 1. Triggering a Change: State & Props

React only looks for changes when a **state update** or **prop change** occurs.

When you call a state setter function (like `setCount(newCount)` or `useActionState`), React flags that specific component and its children as "dirty," queuing them for a re-render pass.

---

## 2. Generating the Virtual DOM Trees

During the re-render pass, React executes your component functions to produce a **new Virtual DOM tree** (a lightweight tree of plain JavaScript objects describing what the UI should look like).

React now has two trees in memory:

1. **The Old Virtual DOM Tree:** Representing the UI currently drawn on screen.
2. **The New Virtual DOM Tree:** Computed during the latest state change.

```
       [ Old Virtual DOM Tree ]             [ New Virtual DOM Tree ]
                 │                                    │
                 └──────────────────┬─────────────────┘
                                    │
                                    ▼
                         [ Reconciliation / Diff ]
                                    │
                                    ▼
                       [ Minimal Real DOM Updates ]

```

---

## 3. The Diffing Algorithm ($O(n)$ Heuristics)

Comparing two general tree structures has an algorithm complexity of $O(n^3)$ (where $n$ is the number of elements). For a page with 1,000 elements, that would require 1 billion operations—far too slow for 60fps UIs.

React turns this into a fast $O(n)$ process using two fundamental assumptions:

### Rule A: Different Component Types Yield Different Trees

If two elements at the same position in the tree have **different types** (e.g., changing from `<div>` to `<section>`, or `<Header>` to `<Sidebar>`), React assumes the entire sub-tree is different.

* It does **not** bother comparing children.
* It completely unmounts (destroys) the old component and DOM nodes, then builds and mounts the new ones from scratch.

```tsx
// Old Tree
<div><Counter /></div>

// New Tree
<section><Counter /></section>

// ➡️ React destroys <div> AND <Counter/>, then mounts <section> and a fresh <Counter/>.

```

If the element types are the **same**, React keeps the existing DOM node and updates only the changed attributes or props:

```tsx
// Old Tree
<div className="card red" id="card-1" />

// New Tree
<div className="card blue" id="card-1" />

// ➡️ React keeps the <div> DOM node and ONLY changes the class name from "red" to "blue".

```

---

### Rule B: Keys Identify Items Across List Renders

When comparing dynamic lists of child elements, React matches list items across renders using the **`key` prop**.

Without keys, React compares list elements by array index. If you insert an item at the beginning of an array, React assumes every single item position changed and mutates every DOM node in the list.

With unique, stable keys (`key="user-123"`), React matches old and new list items across renders:

```tsx
// Old List
<ul>
  <li key="a">Item A</li>
  <li key="b">Item B</li>
</ul>

// New List (Inserted "C" at the top)
<ul>
  <li key="c">Item C</li>
  <li key="a">Item A</li>
  <li key="b">Item B</li>
</ul>

```

* React sees `key="a"` and `key="b"` still exist, so it **reuses their DOM nodes and internal state**.
* It creates only a single new DOM node for `key="c"` and inserts it at the top.

---

## 4. Applying Changes to the Real DOM (The Commit Phase)

Once the Diffing algorithm identifies the exact delta between the old and new Virtual DOMs, React enters the **Commit Phase**.

React batches all identified DOM mutations together and applies them to the real browser DOM in a single pass. This batching avoids intermediate layout recalculations (reflows) and prevents screen flickering.

---

## Summary Checklist

| Stage          | What React Does                                                                    |
| -------------- | ---------------------------------------------------------------------------------- |
| **1. Trigger** | State or Prop changes; component function re-runs.                                 |
| **2. Render**  | Generates a new Virtual DOM JavaScript tree.                                       |
| **3. Diff**    | Compares Old VDOM vs New VDOM using $O(n)$ heuristic rules (Type Matching & Keys). |
| **4. Commit**  | Batches and applies only the exact minimal mutations to the real browser DOM.      |
