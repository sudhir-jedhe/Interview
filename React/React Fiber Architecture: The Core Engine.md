Here is a clean, structured reference guide breaking down **React Fiber**, its core responsibilities as a scheduler, and the key properties that make incremental rendering possible.

---

# React Fiber Architecture: The Core Engine

React Fiber is a complete rewrite of React’s reconciliation engine introduced in React 16. At its core, Fiber is a **virtual stack frame implementation and work scheduler** that converts rendering from an all-or-nothing synchronous recursion into discrete, interruptible units of work.

---

## 1. What Fiber Unlocked

By breaking the component tree into individual Fiber nodes, React shifted from a **greedy, blocking renderer** to a **cooperative, asynchronous scheduler**:

* **Incremental Rendering:** Splitting heavy render tasks into multiple frames so the main thread never freezes.
* **Pause and Resume:** Saving the current state of reconciliation in heap memory, yielding control to the browser, and picking up at the exact same node on the next frame.
* **Priority Scheduling:** High-priority user input (e.g., typing, clicks) can interrupt low-priority background updates (e.g., filtering large data lists).
* **Concurrent Primitives:** Serves as the architectural foundation for `Suspense`, `startTransition`, `useDeferredValue`, and Server Components.

---

## 2. Fiber Node Anatomy (Internal Fields)

Every React element, DOM node, and fragment corresponds to a persistent **Fiber node** object in memory.

```text
                     Parent Fiber (return)
                               ▲
                               │
                         [child pointer]
                               │
                               ▼
  First Child Fiber ─────[sibling pointer]─────► Second Child Fiber

```

### Key Field Categories

#### A. Identification & Type

* **`tag` (WorkTag):** Integer enum identifying the category of work (e.g., `0 = FunctionComponent`, `1 = ClassComponent`, `5 = HostComponent` like `<div>`).
* **`type`:** The underlying component function, class, or HTML tag string (`'div'`, `'button'`).
* **`key`:** Preserves element identity across list reorders to reuse nodes instead of recreating DOM.

#### B. The Triply Linked List Structure

* **`child`:** Points to the **first immediate child** Fiber node.
* **`sibling`:** Points to the **next adjacent sibling** Fiber node.
* **`return`:** Points to the **parent** Fiber node (acting as the virtual stack frame return address).

#### C. Props, State & Instances

* **`pendingProps`:** Props passed during the current, active render pass.
* **`memoizedProps`:** Props used during the **last committed render pass** (used for diffing).
* **`memoizedState`:** Holds internal state (linked list of Hooks for function components, or state object for classes).
* **`stateNode`:** Reference to the real DOM element (`HTMLDivElement`), class instance, or `null`.

#### D. Priority & Double Buffering

* **`lanes`:** 32-bit bitmask indicating priority of pending work on this specific node.
* **`childLanes`:** Bitmask aggregating pending work across the node's entire subtree (enables $O(1)$ subtree bailout).
* **`alternate`:** Pointer to the mirror Fiber node used for **Double Buffering** (`current` $\leftrightarrow$ `workInProgress`).

---

## 3. How Fiber Re-renders Work (Mental Model)

When a state update occurs:

1. **Tagging:** React assigns a priority `Lane` to the updated Fiber and bubbles the bitmask up through parent `childLanes`.
2. **WorkLoop:** React traverses the Fiber tree using depth-first traversal, calling `beginWork` on each node.
3. **Time Check:** After processing a Fiber, React checks `shouldYield()`. If the frame budget (~5ms) is exhausted, it yields to the browser event loop.
4. **Commit:** Once all Fiber nodes finish reconciliation in memory (`WorkInProgress`), React synchronously commits the mutations to the DOM in a single pass.
