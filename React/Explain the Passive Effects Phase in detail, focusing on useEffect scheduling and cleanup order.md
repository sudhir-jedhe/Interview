The **Passive Effects Phase** is the fourth and final sub-phase of React's **Commit Phase**.

While the preceding phases (Before Mutation, Mutation, and Layout) execute **synchronously on the main thread** to ensure live DOM consistency before the screen updates, the Passive Effects Phase is explicitly designed to be **asynchronous and non-blocking**.

It handles `useEffect` callbacks and cleanups *after* the browser has rendered the updated pixels to the screen, ensuring that side effects do not block user interactions or delay visual frame delivery.

---

## 1. Execution Pipeline & Browser Paint Intermission

To understand Passive Effects, it is crucial to see where the **Browser Paint** happens relative to React’s internal execution:

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. MUTATION PHASE (Sync)                                               │
 │ • React mutates live DOM nodes (Deletions ──► Placements ──► Updates)  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. LAYOUT PHASE (Sync)                                                 │
 │ • Binds ref.current pointers & executes useLayoutEffect synchronously  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
               ════════════════════════════════════════════
               BROWSER PAINTS SCREEN (Pixels become visible)
               ════════════════════════════════════════════
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. PASSIVE EFFECTS PHASE (Async / Scheduled)                           │
 │ • Executes useEffect cleanups from previous render                     │
 │ • Executes new useEffect setup callbacks                               │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 2. How `useEffect` is Scheduled via the Scheduler

React does not run `useEffect` callbacks immediately after DOM mutation. Instead, during the Layout Phase, React collects all Fibers with the **`Passive`** effect flag (`fiber.flags & Passive !== NoFlags`) and schedules a low-priority task using the **`scheduler` package**.

1. **Scheduling Task:** React enqueues `flushPassiveEffects` with the Scheduler at **`NormalPriority`**.
2. **Yielding to Host:** Control is returned to the browser event loop so it can run style recalculations, layout passes, and paint pixels to the display.
3. **Macro-task Execution:** Right after the paint completes, Scheduler executes the queued `flushPassiveEffects` task via a `MessageChannel` macro-task tick.

---

## 3. Strict Execution & Cleanup Order

When `flushPassiveEffects` executes, React walks the passive effect queue in two distinct sequential passes across the affected Fiber nodes:

### Step 1: All Unmount & Update Cleanups Run First

React executes **all cleanup functions** from the *previous* render pass across the entire tree before firing any new effect setups.

* **For Unmounting Components:** Fires the cleanup function returned by `useEffect` during the last render.
* **For Updating Components:** If dependencies in `useEffect(fn, deps)` changed, React runs the old cleanup function first to tear down stale subscriptions, listeners, or timers.

### Step 2: All New Setup Callbacks Run Second

Once *all* cleanups across the component tree have completed, React loops back through the tree and executes all new `useEffect` setup callbacks.

```text
  Render N-1 Effect Setup (Active)
               │
               ▼  [State/Props Update Triggered]
  Render N Mutation & Paint Complete
               │
               ▼
 ┌───────────────────────────────────────────────────────────────────┐
 │ PASSIVE EFFECTS PHASE (Render N)                                  │
 │                                                                   │
 │ 1. Run ALL Cleanups from Render N-1                              │
 │    └── cleanupFn_Render_N-1()                                    │
 │                                                                   │
 │ 2. Run ALL Setups for Render N                                    │
 │    └── setupFn_Render_N()                                         │
 └───────────────────────────────────────────────────────────────────┘

```

> **Why Cleanups Run Before Any New Setups:** Separating cleanups from setups ensures that old event listeners, WebSocket channels, or timers are completely torn down before new ones are instantiated, preventing race conditions or duplicate listeners.

---

## 4. Traversal Order: Depth-First Post-Order

During the Passive Effects Phase, React traverses the Fiber tree using **depth-first post-order traversal** (children before parents):

1. **Child Component Cleanups** run before **Parent Component Cleanups**.
2. **Child Component Setups** run before **Parent Component Setups**.

### Code Example: Order Verification

```jsx
import React, { useEffect } from 'react';

function Child() {
  useEffect(() => {
    console.log('1. Child Effect Setup');
    return () => console.log('A. Child Effect Cleanup');
  }, []);

  return <div>Child</div>;
}

function Parent() {
  useEffect(() => {
    console.log('2. Parent Effect Setup');
    return () => console.log('B. Parent Effect Cleanup');
  }, []);

  return <Child />;
}

```

#### Console Output Sequence

* **Initial Mount:**

1. `1. Child Effect Setup`
2. `2. Parent Effect Setup`

* **Unmount / Prop Update (Re-render):**

1. `A. Child Effect Cleanup`
2. `B. Parent Effect Cleanup`
3. `1. Child Effect Setup` (if re-rendering)
4. `2. Parent Effect Setup` (if re-rendering)

---

## 5. Primary Use Cases for Passive Effects

Because `useEffect` runs asynchronously after paint, it is optimized for tasks that **do not require synchronous DOM layout adjustments**:

* **Data Fetching:** Initiating HTTP/GraphQL network requests (`fetch`, `axios`).
* **External Subscriptions:** Binding to RxJS observables, WebSockets, or global window event listeners.
* **Analytics Logging:** Dispatching page-view or click event tracking payloads.
* **State Synchronization:** Updating local storage, persistent caches, or non-React state stores.

---

## Summary Matrix: `useLayoutEffect` vs. `useEffect`

| Characteristic           | `useLayoutEffect` (Layout Phase)            | `useEffect` (Passive Phase)                 |
| ------------------------ | ------------------------------------------- | ------------------------------------------- |
| **Commit Sub-Phase**     | 3rd Sub-Phase (Layout)                      | 4th Sub-Phase (Passive)                     |
| **Execution Timing**     | Post-DOM Mutation, **Before Paint**         | Post-DOM Mutation, **After Paint**          |
| **Thread Blocking**      | **Synchronous / Main Thread Blocking**      | **Asynchronous / Non-Blocking**             |
| **Scheduling Mechanism** | Immediate call stack execution              | Enqueued via `Scheduler` (`MessageChannel`) |
| **Tree Traversal**       | Children $\rightarrow$ Parents (Post-Order) | Children $\rightarrow$ Parents (Post-Order) |
| **Primary Goal**         | Prevent visual UI flickering                | Background side-effects & subscriptions     |
