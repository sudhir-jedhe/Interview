Here is a comprehensive reference architecture document synthesizing the entire end-to-end React Fiber rendering engine, mapping its complete lifecycle from initial state trigger down to post-paint passive execution.

---

# React Fiber Core Architecture: End-to-End Reference Manual

React Fiber transforms rendering from an uninterruptible, stack-based recursion into a **cooperative, heap-allocated virtual stack machine**. Every React Element is backed by a persistent **Fiber node** that acts as an isolated unit of work, complete with priority metadata, state references, and structural pointers (`child`, `sibling`, `return`).

---

## 1. End-to-End Render Pipeline Lifecycle

```text
  [ STATE / INPUT EVENT ]
             │
             ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. RENDER PHASE (Reconciliation) — Async / Interruptible / Pure        │
 │ • Driven by workLoop Concurrent                                        │
 │ • Downward Pass (beginWork): Prop/state diffing, React.memo bailout    │
 │ • Upward Pass (completeWork): Offscreen DOM creation, flag assembly    │
 │ • Budgeting: Time Slicing + shouldYield() via Scheduler                │
 │ • Priority Routing: Bitmask Lanes & ChildLanes aggregation             │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. COMMIT PHASE (Execution) — Sync / Non-Interruptible / Side Effects  │
 │                                                                        │
 │   a. Before Mutation Phase (Pre-DOM Read)                              │
 │      └── Captures scroll/layout snapshots (getSnapshotBeforeUpdate)    │
 │                                                                        │
 │   b. Mutation Phase (DOM Write)                                        │
 │      └── Applies live DOM changes: Deletions ──► Placements ──► Updates│
 │                                                                        │
 │   c. Layout Phase (Post-DOM Update, Pre-Paint)                         │
 │      └── Attaches ref.current, executes useLayoutEffect synchronously  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
                   BROWSER PAINTS SCREEN (Pixels visible)
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. PASSIVE EFFECTS PHASE — Async / Post-Paint / Non-blocking           │
 │ • Scheduled via Scheduler (MessageChannel macro-task)                  │
 │ • Runs previous render cleanups first, then new useEffect setups       │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Phase-by-Phase Technical Specification

### A. The Render Phase: Iterative Depth-First Traversal

Unlike native call stacks that run to completion, the `workLoop` executes an iterative Depth-First Search (DFS) over Fiber nodes in heap memory:

* **`beginWork(current, workInProgress, renderLanes)`:**
* Runs on the downward pass (Root $\rightarrow$ Leaf).
* Evaluates props/state diffs, executes component functions, and runs hooks.
* **Bailout Optimization:** If props match (`React.memo` or React 19 Compiler cache slots) and `lanes` match, `beginWork` skips rendering that node and reuses the existing child Fiber subtree.

* **`completeWork(current, workInProgress, renderLanes)`:**
* Runs on the upward pass (Leaf $\rightarrow$ Root).
* For `HostComponent` tags (`<div>`), creates unattached DOM instances in `fiber.stateNode` and appends child DOM nodes in memory.
* Bubbles side-effect flags (`fiber.flags`) and subtree flags (`subtreeFlags`) upward so the Commit Phase knows where mutations lie in $O(1)$ time.

---

### B. Time Slicing & Priority Scheduling

* **Time Slicing (`shouldYield()`):** After processing each Fiber unit of work, React inspects its time budget (~5ms frame interval). If `shouldYield()` returns `true`, React saves its `workInProgress` pointer and yields execution back to the browser event loop using a `MessageChannel` macro-task.
* **Lanes & Bitmasks:** Priorities are represented as 32-bit integers (`SyncLane`, `InputContinuousLane`, `DefaultLane`, `TransitionLane`, `IdleLane`).
* **`childLanes` Aggregation:** `childLanes` represents the bitwise `OR` combination of all pending work in a node's subtree. This allows React to skip clean branches during DFS while safely diving into subtrees where context or local state updates pending deep below.

---

### C. The Commit Phase: Synchronous DOM Mutation & Effects

Once reconciliation completes, React enters the **Commit Phase**. It runs synchronously to prevent visual tearing or partial UI states:

1. **Before Mutation Phase:** Reads current DOM properties (e.g., `getSnapshotBeforeUpdate` scroll offsets) before structural alterations destroy them.
2. **Mutation Phase:** Applies real DOM mutations in strict sequence:

* **Deletions (`ChildDeletion`)** $\rightarrow$ **Placements (`Placement`)** $\rightarrow$ **Updates (`Update`)**.
* Traverses in **depth-first post-order** (children mutated before parents).

1. **Layout Phase:** Fires post-mutation, **pre-paint**.

* Attaches live DOM elements to `ref.current`.
* Executes `useLayoutEffect` setups and cleanups synchronously. State updates inside `useLayoutEffect` trigger an immediate synchronous re-render in memory, avoiding screen flickering.

---

### D. Passive Effects Phase: Post-Paint Async Execution

After the Layout Phase, React yields to the browser engine to perform layout calculations, style updates, and pixel painting.

* **Asynchronous Scheduling:** React queues `useEffect` execution via the `scheduler` package as a low-priority task post-paint.
* **Cleanup First, Setup Second:** React executes **all cleanups from the previous render pass** across the tree before running any new `useEffect` setup callbacks. This prevents overlapping effect instances and race conditions.

---

## 3. Comprehensive Engine Comparison Matrix

| Pipeline Stage       | Timing                 | Thread Mode                 | Primary Operations                                                           | Key APIs / Primitive Functions                                  |
| -------------------- | ---------------------- | --------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Render Phase**     | Offscreen (Pre-DOM)    | Interruptible / Async       | Prop/state diffing, subtree bailout, offscreen DOM creation                  | `workLoopConcurrent`, `beginWork`, `completeWork`, `React.memo` |
| **Scheduler Engine** | Per Fiber Node         | Cooperative                 | Budget enforcement, priority classification, yielding                        | `shouldYield()`, `MessageChannel`, `Lanes`, `childLanes`        |
| **Before Mutation**  | Commit (Pre-DOM Write) | Synchronous / Blocking      | Reading live DOM layout metrics before structural change                     | `getSnapshotBeforeUpdate`                                       |
| **Mutation Phase**   | Commit (DOM Write)     | Synchronous / Blocking      | Real DOM mutations: Deletions $\rightarrow$ Placements $\rightarrow$ Updates | `appendChild`, `insertBefore`, `removeChild`                    |
| **Layout Phase**     | Commit (Pre-Paint)     | Synchronous / Blocking      | Binding refs, pre-paint layout adjustments, flicker prevention               | `ref.current`, `useLayoutEffect`, `componentDidMount`           |
| **Passive Phase**    | Post-Paint             | Asynchronous / Non-blocking | Data fetching, event subscriptions, state sync, analytics                    | `useEffect`, `flushPassiveEffects`, `Scheduler`                 |
