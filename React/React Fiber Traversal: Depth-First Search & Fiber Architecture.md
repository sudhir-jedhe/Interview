Here is a clean, technical breakdown of **React Fiber’s Depth-First Traversal**, comparing how reconciliation was executed in the legacy Stack Reconciler versus how Fiber transformed it into an iterative, interruptible system.

---

# React Fiber Traversal: Depth-First Search & Fiber Architecture

React Fiber relies on a **Depth-First Search (DFS)** algorithm to reconcile the Virtual DOM tree with the Fiber tree. While depth-first traversal has always been React’s core reconciliation pattern, Fiber fundamentally changed **how** this traversal is executed on the JavaScript engine.

---

## 1. The Triply Linked List Data Structure

Unlike a traditional DOM or JSON tree where parent nodes contain an array of children (`children: []`), Fiber converts the component tree into a **singly/triply linked list** using three specific pointers on every Fiber node:

* **`child`**: Points directly to the **first immediate child**.
* **`sibling`**: Points to the **next adjacent sibling**.
* **`return`**: Points back to the **parent Fiber node** (acting as the virtual return stack frame).

```text
                     [ Root ]
                        │
                      child
                        ▼
                   [ Parent ] ──sibling──► [ Sibling Parent ]
                        │                       ▲
                      child                     │
                        ▼                     return
                   [ Child A ] ──sibling──► [ Child B ]
                        │
                      child
                        ▼
                    [ Leaf ]

```

### The Traversal Algorithm Flow

1. **Downwards Pass:** Follow `child` pointers until reaching the deepest leaf node.
2. **Horizontal Pass:** Move to the adjacent `sibling` pointer if one exists, and repeat the downward pass.
3. **Upwards Pass:** Follow `return` pointers back to the parent until a sibling is found or the root is reached.

This triply-linked structure gives the traversal an $O(n)$ time complexity, visiting every Fiber node exactly twice (once on `beginWork` going down, and once on `completeWork` going up).

---

## 2. Stack Reconciler vs. Fiber Reconciler

| Aspect                  | Legacy Stack Reconciler (Pre-React 16)                       | Fiber Engine (React 16+)                                               |
| ----------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Execution Mechanics** | Recursive function calls on the native JS call stack         | Iterative `while` loop on heap-allocated objects (`workLoop`)          |
| **Call Stack Control**  | Controlled by the V8 JavaScript engine stack                 | Controlled by React’s `workInProgress` pointer in memory               |
| **Interruptibility**    | **Non-interruptible:** Must run to completion once triggered | **Interruptible:** Can pause at any Fiber boundary via `shouldYield()` |
| **Memory Allocation**   | Native call stack frames (destroyed on return)               | Heap objects that persist across frames and re-renders                 |
| **UI Responsiveness**   | Long trees block the main thread, causing frame drops        | Long trees yield control every ~5ms, keeping the UI at 60/120fps       |

---

## 3. Reconciliation Rules During Traversal

During the depth-first walk, React applies two foundational diffing rules to determine whether to reuse, mutate, or destroy Fiber subtrees:

### 1. Same-Position Type Check

If a node's type changes at the exact same location in the tree (e.g., `<div />` replaced by `<section />` or `<Header/>` replaced by `<Nav/>`):

* React **immediately discards the entire subtree**.
* It unmounts all descendants, destroys local component state, detaches DOM nodes, and builds the new subtree from scratch.
* React never attempts to diff children across different wrapper types.

### 2. List Matching via `key` Identifiers

For array children, React uses the `key` prop during traversal to match previous Fibers with new React elements:

* **Stable Keys:** React reorders, moves, or updates existing Fiber nodes without unmounting or recreating DOM elements.
* **Missing/Index Keys:** React falls back to positional index matching. Inserting an element at the beginning of an array forces React to mutate every subsequent item in the list rather than prepending a single node.

---

## 4. Why Fiber Made Traversal Interruptible & Incremental

Because the legacy reconciler used recursive function calls, pausing mid-way meant losing the native call stack location.

Fiber solves this by representing virtual stack frames as heap-allocated Fiber objects. React tracks execution progress using a global pointer called **`workInProgress`**.

```javascript
// Iterative, non-blocking Depth-First Traversal loop
function workLoopConcurrent() {
  // Process one Fiber node at a time until work completes OR frame budget (~5ms) expires
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

```

1. **Interruptible:** When `shouldYield()` returns `true`, React pauses the loop and returns main-thread control to the browser so it can process user clicks, typing, or CSS animations.
2. **Incremental:** Because `workInProgress` holds the exact Fiber node where execution paused, React resumes traversal on the next frame **from that exact node**, without restarting from the root.
