In React's Render Phase, React traverses the Fiber tree using a **Depth-First Search (DFS)** algorithm.

Unlike standard recursive DFS algorithms that run on the native JavaScript call stack (which cannot be paused), React implements this traversal iteratively using a `while` loop known as the **`workLoop`**.

This process is driven by two primary internal functions: **`beginWork`** (as React moves down the tree) and **`completeWork`** (as React moves back up).

---

## 1. The Core Traversal Rule (Child $\rightarrow$ Sibling $\rightarrow$ Parent)

React walks the Fiber tree using three triply-linked pointers (`child`, `sibling`, `return`):

1. **Go Deep First:** Move down to the **`child`** node as far as possible.
2. **Move Sideways:** If a node has no `child`, move to its adjacent **`sibling`**.
3. **Return Upward:** If a node has no `child` and no `sibling`, walk back up to its **`return`** (parent) pointer, check for a parent sibling, or complete the parent.

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

### Traversal Order Path

$$\text{Root (beginWork)} \rightarrow \text{Parent (beginWork)} \rightarrow \text{Child A (beginWork)} \rightarrow \text{Leaf (beginWork \& completeWork)}$$

$$\rightarrow \text{Child A (completeWork)} \rightarrow \text{Child B (beginWork \& completeWork)} \rightarrow \text{Parent (completeWork)} \dots$$

---

## 2. Downward Phase: `beginWork`

`beginWork(current, workInProgress, renderLanes)` is called when React enters a Fiber node for the first time while stepping down the tree.

### Core Responsibilities of `beginWork`

1. **Prop & State Diffing:** Compares incoming `pendingProps` against previous `memoizedProps` and checks for pending state/context updates.
2. **Subtree Bailout Optimization:**

* If props/state haven't changed and no pending `lanes` exist on the node, React **bails out** (skips rendering) and reuses the existing subtree without executing component code.

1. **Executing Component Logic:**

* For **Function Components**: Calls the function (e.g., `MyComponent(props)`), executing hooks (`useState`, `useContext`).
* For **Class Components**: Instantiates or calls `render()`.

1. **Reconciling Children:** Generates or updates the child Fiber nodes and returns a pointer to the **first child Fiber**.

> **Key Rule:** If `beginWork` returns a `child` Fiber, the `workLoop` immediately sets `workInProgress = child` and repeats `beginWork` on that new child.

---

## 3. Upward Phase: `completeWork`

`completeWork(current, workInProgress, renderLanes)` is called when React reaches a leaf node (a Fiber with no children) or when all children of a node have finished processing.

### Core Responsibilities of `completeWork`

1. **DOM Node Creation (`HostComponent`):**

* For native HTML elements (e.g., `<div>`, `<button>`), React creates the actual offscreen HTML DOM instance using `document.createElement()` and attaches it to `fiber.stateNode`.

1. **DOM Tree Assembly:** Appends child DOM nodes to parent DOM nodes **in memory** (offscreen) before any DOM mutation occurs on the real screen.
2. **Flag & Effect Attachment:** Sets bitfield flags (`fiber.flags`) on the node (e.g., `Placement`, `Update`, `ChildDeletion`, `Passive`).
3. **Bubbling Properties (`bubbleProperties`):**

* Merges child `flags` and `subtreeFlags` upward into parent `subtreeFlags`. This allows React to know during the Commit Phase whether any child in a subtree has pending DOM operations in $O(1)$ time.

---

## 4. The `workLoop` Implementation

Below is a simplified JavaScript representation of how React’s `workLoop` executes depth-first traversal using `beginWork` and `completeWork`:

```javascript
// The WorkLoop driving Depth-First Traversal
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  
  // 1. DOWNWARD PASS: Process current node
  let next = beginWork(current, unitOfWork, renderLanes);
  
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next !== null) {
    // If beginWork returned a child, set it as next unit of work
    workInProgress = next;
  } else {
    // 2. UPWARD PASS: Reached leaf node, complete work and move to sibling/parent
    completeUnitOfWork(unitOfWork);
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;

  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;

    // Complete the current fiber node
    completeWork(current, completedWork, renderLanes);

    // Check if there is an adjacent sibling
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // Step sideways to sibling
      workInProgress = siblingFiber;
      return;
    }

    // No sibling? Move back up to parent fiber
    completedWork = returnFiber;
    workInProgress = completedWork;

  } while (completedWork !== null);
}

```

---

## 5. Summary Matrix: `beginWork` vs. `completeWork`

| Aspect                 | `beginWork`                                                            | `completeWork`                                                            |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Direction**          | Downward (Root $\rightarrow$ Leaf)                                     | Upward (Leaf $\rightarrow$ Root)                                          |
| **Trigger**            | Entering a Fiber node for the first time                               | After all child Fibers have completed                                     |
| **Primary Job**        | Diffing props/state, running component functions, child reconciliation | Creating offscreen DOM nodes, setting `flags`, aggregating `subtreeFlags` |
| **Bailout Capability** | Can skip entire subtrees if props/state are unchanged                  | N/A (Only runs on nodes whose children completed)                         |
| **Next Step**          | Moves to `fiber.child`                                                 | Moves to `fiber.sibling` or returns to `fiber.return`                     |
