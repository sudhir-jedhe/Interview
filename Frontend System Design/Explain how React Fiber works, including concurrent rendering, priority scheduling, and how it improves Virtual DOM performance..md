Before **React 16**, React’s reconciliation engine (often referred to as the **Stack Reconciler**) processed component updates recursively.

When a state change occurred, React traversed the entire Virtual DOM tree synchronously. Once started, this process **could not be interrupted, paused, or prioritized**. For large component trees, a heavy update phase could easily exceed the 16ms frame budget (for 60fps displays), blocking the main browser thread and causing input lag, dropped animation frames, and UI freezing.

**React Fiber** was a complete rewrite of React's core reconciliation algorithm designed to solve this main-thread starvation problem.

---

## 1. The Core Architecture: Stack vs. Fiber

```
STACK RECONCILER (Pre-React 16)
[ Main Thread ] ---> [ Synchronous Recursive Tree Traversal (Blocking) ] ---> [ Real DOM Update ]
                     (Cannot be interrupted — blocks user input & animations)


FIBER RECONCILER (React 16+)
[ Main Thread ] ---> [ Chunk 1 (Work) ] ---> [ Yield to Browser (Input/Frame) ] ---> [ Chunk 2 (Work) ] ---> [ Commit ]
                     (Interruptible work split into discrete, prioritized units)

```

### The Fiber Data Structure

Instead of relying on the JavaScript engine’s native call stack (which is synchronous and uninterruptible), React created a **custom virtual stack frame** called a **Fiber Node**.

Every React element has a corresponding Fiber node. Together, they form a **singly linked list tree** consisting of three primary pointers:

1. **`child`:** Points to the first immediate child.
2. **`sibling`:** Points to the next immediate sibling.
3. **`return`:** Points back to the parent Fiber node (representing the stack frame to return to upon completion).

```
                   [ App (Fiber) ]
                          │
                        child
                          ▼
                  [ Header (Fiber) ] ──sibling──► [ Content (Fiber) ]
                          │                              │
                        return                         return
                          └───────────────┬──────────────┘
                                          ▼
                                   [ App (Parent) ]

```

Because traversal is driven by a linked list rather than recursive function calls, React can stop processing work at any point, save the current Fiber node reference, yield control back to the browser to paint or handle events, and resume work where it left off.

---

## 2. The Two-Phase Rendering Model

To make work interruptible without leaving the user interface in a partially updated, broken state, Fiber splits work into two distinct phases:

```
+-----------------------------------------------------------------------+
| PHASE 1: RENDER / RECONCILIATION PHASE (Async & Interruptible)        |
|                                                                       |
|  * Traverses Fiber tree and calculates diffs.                         |
|  * Flags nodes with side-effects (Insertion, Update, Deletion).       |
|  * Can be paused, discarded, or restarted by the scheduler.           |
+-----------------------------------------------------------------------+
                                   |
                                   v  (Work finished)
+-----------------------------------------------------------------------+
| PHASE 2: COMMIT PHASE (Sync & Uninterruptible)                        |
|                                                                       |
|  * Writes DOM mutations (`appendChild`, `removeChild`, attributes).   |
|  * Executes lifecycle hooks (`useLayoutEffect`, `useEffect`).         |
|  * MUST execute synchronously to keep the UI consistent.             |
+-----------------------------------------------------------------------+

```

### Double Buffering Strategy

React maintains two Fiber trees in memory simultaneously:

* **`current` Tree:** Represents the Fiber nodes currently rendered on the screen.
* **`workInProgress` Tree:** Built asynchronously in the background during the Render Phase.

When the background `workInProgress` tree finishes rendering and passes to the Commit phase, React simply swaps a single pointer (`root.current = workInProgress`). This **Double Buffering** technique prevents incomplete rendering artifacts from flashing on screen.

---

## 3. Priority Scheduling & Concurrent Rendering

With Fiber, not all updates are treated equally. React assigns priorities to updates based on their origin (e.g., user input vs. data fetching).

### Lanes Priority Model

React uses a bitmask system called **Lanes** to represent different priority levels:

1. **Discrete / Immediate Lanes (Highest Priority):** User interactions like clicks, keypresses, and input typing where delay causes perceptible lag.
2. **Continuous / Transition Lanes:** User interactions like mouse moves, drag-and-drop, or scrolling.
3. **Default / Normal Lanes:** Data fetching responses, network updates, and standard state mutations (`setState`).
4. **Idle / Offscreen Lanes (Lowest Priority):** Off-screen content pre-rendering or low-priority background work.

### Time Slicing

React integrates with browser scheduling utilities (like `MessageChannel` and `requestIdleCallback`) to divide work into **Time Slices** (~5ms chunks):

```javascript
// Conceptual inner loop of the Fiber Scheduler
function workLoopConcurrent() {
  // Perform work on individual Fiber nodes while time remains in the current slice
  while (workInProgress !== null && !shouldYieldToHost()) {
    performUnitOfWork(workInProgress);
  }

  // If time run out but work is incomplete, yield thread back to browser
  if (workInProgress !== null) {
    requestHostCallback(workLoopConcurrent); 
  } else {
    // Work finished -> Proceed to synchronous Commit Phase
    commitRoot(root);
  }
}

```

If a high-priority user event (e.g., user typing in a search box) occurs while React is processing a low-priority render (e.g., filtering a list of 10,000 items), React **suspends the low-priority work**, processes the user input update immediately, and then resumes or restarts the background list rendering.

---

## 4. Concurrent Features Enabled by Fiber

Fiber serves as the foundation for modern React concurrent features:

* **`useTransition`:** Marks a state update as non-urgent, allowing React to keep the current UI responsive while preparing the new UI in the background.
* **`useDeferredValue`:** Defer updating a non-critical part of the UI (e.g., dynamic search results) while preserving immediate response on user inputs.
* **Suspense & Streaming SSR:** Suspense allows React to pause rendering a subtree while waiting for asynchronous assets or data, stream HTML chunks from the server, and hydrate components selectively based on user interactions.

---

## 5. Summary: How Fiber Improves Virtual DOM Performance

| Problem in Legacy Engine                                                                 | Fiber Solution                                                                                   |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Blocking Main Thread:** Large updates locked the browser thread until complete.        | **Time Slicing:** Work is split into ~5ms chunks, yielding to keep frames smooth (60fps/120fps). |
| **All Updates Equal:** Low-priority data fetches blocked immediate input responsiveness. | **Priority Scheduling (Lanes):** User inputs preempt background rendering tasks.                 |
| **All-or-Nothing Render:** Work couldn't be saved mid-way.                               | **Interruptible Linked List Tree:** React can pause, resume, or discard work-in-progress trees.  |
| **UI Flashes During Async Load:** Partial renders showed broken state.                   | **Double Buffering:** Mutations are pre-computed on a background tree before swapping pointers.  |
