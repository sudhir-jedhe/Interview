Before React 16, React used the **Stack Reconciler**. It processed updates recursively down the component tree. Once started, a stack reconciliation could not be paused, interrupted, or split across frames. If a tree was deep or complex, rendering could block the browser's main thread for over 16ms, causing dropped frames, choppy animations, and delayed user input responses.

**React Fiber** was a complete rewrite of React’s core reconciliation algorithm designed to enable **incremental rendering**—the ability to split rendering work into chunks, spread it across multiple frames, pause/resume work, and prioritize higher-priority updates (like typing or user clicks) over lower-priority ones (like data fetching or background list filtering).

---

## 1. What is a Fiber Node? (Structure)

At its core, a **Fiber** is a plain JavaScript object that represents a unit of work. It acts as a virtual stack frame, mapping 1-to-1 with a React element or DOM node, but persisting across renders in a doubly-linked list tree structure.

Unlike a standard DOM or Virtual DOM tree that relies on standard parent-child arrays, Fiber nodes maintain pointer relationships using three properties: `child`, `sibling`, and `return`.

```text
               ┌────────────────┐
               │   Parent (A)   │
               └───────┬────────┘
                       │ child
                       ▼
               ┌────────────────┐  sibling   ┌────────────────┐
               │    Child (B)   ├───────────►│   Sibling (C)  │
               └───────┬────────┘            └───────┬────────┘
                       │ return                      │ return
                       └──────────────┬──────────────┘
                                      ▼
                               ┌──────────────┐
                               │  Parent (A)  │
                               └──────────────┘

```

### Core Fiber Node Properties

```typescript
type Fiber = {
  // --- 1. Entity Identification ---
  type: any,          // FunctionComponent, ClassComponent, 'div', etc.
  key: null | string, // Unique identifier for list reconciliation
  stateNode: any,     // Reference to real DOM node or class instance

  // --- 2. Tree Navigation (Linked List) ---
  child: Fiber | null,   // Pointer to FIRST child
  sibling: Fiber | null, // Pointer to NEXT sibling
  return: Fiber | null,  // Pointer to PARENT (return address)

  // --- 3. Work & State Buffers ---
  memoizedProps: any, // Props used during the LAST render (current UI)
  pendingProps: any,  // New incoming props for THIS render
  memoizedState: any, // Linked list of Hooks (useState, useEffect, etc.)
  updateQueue: any,   // Pending state changes or callbacks queued on this Fiber

  // --- 4. Double Buffering & Flags ---
  alternate: Fiber | null, // Pointer to counterpart in current/workInProgress tree
  flags: Flags,            // Bitwise flags (Placement, Update, Deletion, Passive)
  lanes: Lanes,            // Bitmask representing priority level of pending work
};

```

---

## 2. Double Buffering Architecture (`current` vs. `workInProgress`)

React avoids rendering half-finished or partially calculated state to the screen by maintaining **two Fiber trees simultaneously in memory**:

1. **`current` Tree:** Represents the UI currently rendered on the screen.
2. **`workInProgress` (WIP) Tree:** The draft tree constructed during the **Render Phase**.

```text
   [ HostRoot ] ──────────────────────┐ (current)
        │                             │
        ▼                             ▼
  Current Tree               WorkInProgress Tree
  (Screen UI)                (In-Memory Draft)
  ┌──────────┐   alternate   ┌──────────┐
  │ Fiber A  │◄────────────►│ Fiber A' │
  └────┬─────┘               └────┬─────┘
       │                          │
       ▼                          ▼
  ┌──────────┐   alternate   ┌──────────┐
  │ Fiber B  │◄────────────►│ Fiber B' │
  └──────────┘               └──────────┘

```

### How Double Buffering Works

* When an update triggers, React clones or reuses nodes from the `current` tree to construct the `workInProgress` tree via the `.alternate` pointer.
* All processing (`beginWork`, `completeWork`) occurs on the `workInProgress` tree.
* Once the `workInProgress` tree finishes building and is committed to the live DOM, React flips a single top-level pointer:

$$\text{HostRoot.current} = \text{workInProgressTree}$$

The old `workInProgress` tree instantaneously becomes the new `current` tree on screen.

---

## 3. The WorkLoop Engine

The **WorkLoop** is the central driver loop in React that traverses the Fiber tree and processes units of work.

Because Fibers form a singly linked list (via `child`, `sibling`, and `return`), React does not use recursion. Instead, it processes the tree using a simple **`while` loop** that can be paused at any iteration.

### The Basic WorkLoop Implementation

```javascript
function workLoopConcurrent() {
  // Keep performing work until there are no work units left,
  // or until the frame time limit is reached (yielding to browser)
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  
  // 1. Step Down: Process current node and return next child
  let next = beginWork(current, unitOfWork, renderLanes);

  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // 2. Step Up: Reached a leaf node, complete this node and look for siblings
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

```

---

## 4. Tree Traversal Flow: `beginWork` and `completeWork`

The Fiber tree traversal executes in a **Depth-First Search (DFS)** pattern:

```text
                  Root (1)
                 /    \
        `beginWork`    `completeWork`
               /        \
          Child (2) ───► Sibling (3)

```

1. **`beginWork` (Top-Down):**

* Descends down the tree starting at `HostRoot`.
* Evaluates component functions, runs reconciliation, checks for prop/state changes.
* Creates or reuses child Fiber nodes.
* Returns a reference to the **first child**. If a child exists, the WorkLoop repeats `beginWork` on that child.

1. **`completeWork` (Bottom-Up):**

* Executes when `beginWork` returns `null` (leaf node reached).
* Instantiates real DOM instances (`document.createElement`), sets props (`className`, `onClick`), and appends child DOM nodes to parent DOM nodes **in memory**.
* Checks for a `sibling`:
* If a **sibling exists**, sets `workInProgress = sibling` and goes back to `beginWork` on that sibling.
* If **no sibling exists**, bubbles up to the **`return` parent** and runs `completeWork` on the parent.

---

## 5. Summary: Fiber Lifecycle vs. Legacy Stack

| Feature            | Legacy Stack Reconciler                    | React Fiber Reconciler                                             |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------ |
| **Data Structure** | JS Call Stack (Recursive)                  | Linked List of Fiber Nodes                                         |
| **Execution**      | Synchronous, Blocking, Atomic              | Asynchronous, Interruptible, Incremental                           |
| **Pause/Resume**   | ❌ Impossible once started                  | ✅ Pauses via `shouldYield()` when frame budget expires             |
| **Prioritization** | ❌ All updates processed FIFO               | ✅ High priority (input/typing) interrupts low priority (filtering) |
| **DOM Commit**     | Mutates DOM incrementally during traversal | Builds in-memory tree first, commits in single-shot mutation phase |
