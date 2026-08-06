Here is a clean, structured technical reference guide explaining React Fiber’s **Depth-First Traversal**, reconciliation rules, and the mechanics of interruptible traversal.

---

# React Fiber Traversal: Depth-First Search & Reconciliation Rules

When React reconciles an application state change, it walks the Fiber tree using a **Depth-First Search (DFS)** algorithm. Understanding the exact path React takes—and the rules governing it—explains how updates flow through component trees and why specific UI structures impact performance.

---

## 1. Depth-First Traversal Mechanics

React walks the Fiber tree using a triply linked list structure (`child`, `sibling`, `return`). Every node is visited in a predictable $O(n)$ pattern:

```text
                     [ 1. Root ]
                     /         \
                    /           \
             [ 2. Parent ]    [ 6. Sibling ]
              /        \
             /          \
      [ 3. Child A ] ──► [ 5. Child B ]
          │
          ▼
      [ 4. Leaf ]

```

### The Traversal Order

1. **Go Deep First:** Move down through the **`child`** pointer as far as possible until reaching a leaf node (`Child A` $\rightarrow$ `Leaf`).
2. **Step Sideways:** When a leaf node finishes, move to its adjacent **`sibling`** (`Child B`).
3. **Return Upward:** When a branch has no further children or siblings, follow the **`return`** pointer back to the parent to complete it and move to the parent's sibling (`Sibling`).

---

## 2. Core Reconciliation Rules

During depth-first traversal, React evaluates two critical rules to decide whether to reuse or destroy a subtree:

### Rule 1: Structural Invalidation (Node Type Check)

If an element's type changes at the same tree position (e.g., replacing `<div>` with `<span>` or `<Header>` with `<Nav>`), React **discards the entire old subtree immediately**.

* It unmounts the old components, destroys their local state, detaches DOM nodes, and builds the new subtree from scratch.
* React **never attempts to diff children** across two different element types.

```jsx
// ❌ Replaces whole DOM & resets child state on every toggle!
{isError ? (
  <div>
    <FormInput />
  </div>
) : (
  <section>
    <FormInput />
  </section>
)}

```

### Rule 2: List Identification (`keys`)

When rendering arrays of elements, React relies on `key` props to match previous Fibers with new React elements.

* **With Unique Keys:** React reorders, moves, or updates existing Fiber nodes without unmounting/recreating DOM elements.
* **Without Keys (or Index as Keys):** React falls back to positional matching. Inserting an item at index `0` forces React to mutate every single existing item in the list rather than prepending a single node.

---

## 3. What Fiber Changed: Synchronous vs. Interruptible Traversal

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ STACK RECONCILER (Pre-React 16)                                        │
 │ • Recursively called render() on JavaScript Call Stack.                │
 │ • Synchronous and All-or-Nothing. Cannot pause mid-tree.               │
 └────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ FIBER ENGINE (React 16+)                                               │
 │ • Iterative workLoop processing one Fiber node at a time.              │
 │ • Interruptible: Pauses if frame budget (~5ms) expires.                │
 │ • Incremental: Resumes from workInProgress Fiber pointer in heap.      │
 └────────────────────────────────────────────────────────────────────────┘

```

Because Fiber nodes are plain JavaScript objects in heap memory (acting as virtual stack frames), React can pause execution mid-traversal, handle high-priority browser events (like a keypress or click), and resume work at the exact same Fiber node on the next frame without restarting from the root.

---

## 4. Key Takeaways & Performance Implications

| Concept                  | Architectural Impact                                        | Developer Takeaway                                                        |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Component Placement**  | Moving state/components higher forces deeper DFS walks.     | Keep state localized as close to the leaf components as possible.         |
| **Stable Node Types**    | Changing wrapper tags destroys component instances & state. | Keep DOM structure types consistent across dynamic renders.               |
| **List Keys**            | Keys allow Fiber node reuse during array reconciliation.    | Use persistent, unique IDs as keys—never array indices for dynamic lists. |
| **Incremental Yielding** | Fiber preserves traversal state in `workInProgress`.        | Long render passes yield to the main thread without freezing the UI.      |
