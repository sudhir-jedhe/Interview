While both **`useEffect`** and **`useLayoutEffect`** register side effects during the Render Phase, their execution timing, queue structures, and flush mechanics inside the Fiber architecture are completely different.

Here is a deep dive into how Fiber manages and dispatches both hooks under the hood.

---

### 1. The Internal Fiber Queue Structures

Inside a Fiber node's `memoizedState` linked list, both hooks create an `Effect` object. However, Fiber categorizes and handles them through different flags and queues.

```typescript
type Effect = {
  tag: HookFlags,       // HasPassive (useEffect) vs HasLayout (useLayoutEffect)
  create: () => any,    // The effect callback function
  destroy: () => any,   // Cleanup function returned by create()
  deps: Array<any>|null,// Dependencies array
  next: Effect,         // Pointer to NEXT effect in a circular linked list
};

```

#### How Effects are Queued on the Fiber

* **Passive Effects (`useEffect`):** Marked with the `Passive` tag (`HookPassive = 0b1000`). Stored in a global passive effect queue managed by the Fiber scheduler.
* **Layout Effects (`useLayoutEffect`):** Marked with the `Layout` tag (`HookLayout = 0b0100`). Stored on `fiber.updateQueue` and processed synchronously during the Commit Phase.

---

### 2. Fiber Execution Pipeline & Timing

The Commit Phase is divided into three distinct sub-phases: **Before Mutation**, **Mutation**, and **Layout**.

```text
                     COMMIT PHASE (Synchronous & Uninterruptible)
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 1. Before Mutation Phase                                                    │
  │    - Flushes any remaining previous passive effects                        │
  │                                                                             │
  │ 2. Mutation Phase                                                           │
  │    - React updates actual DOM nodes (createElement, appendChild)            │
  │    - Runs useLayoutEffect CLEANUP functions (destroy)                       │
  │                                                                             │
  │ 3. Layout Phase                                                             │
  │    - DOM nodes are attached and settled in memory                           │
  │    - Runs useLayoutEffect CREATE functions (create)                         │
  │    - Schedules useEffect for the next frame                                 │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
                                  BROWSER PAINT
                             (User sees pixels update)
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 4. Post-Paint Phase (Asynchronous Macro-Task)                               │
  │    - Scheduler flushes Passive Effects queue                                │
  │    - Runs useEffect CLEANUP followed by useEffect CREATE                    │
  └─────────────────────────────────────────────────────────────────────────────┘

```

---

### 3. Deep Dive: `useLayoutEffect` Dispatch Mechanics

Because `useLayoutEffect` runs synchronously before browser paint, its execution blocks the main thread.

1. **Mutation Phase (Cleanups):**
React traverses the Fiber tree. If a component is updating or unmounting, React calls `commitHookEffectListUnmount(HookLayout)`. This fires all `useLayoutEffect` cleanup (`destroy`) functions **after** DOM mutations are made, but **before** layout effects create.
2. **Layout Phase (Executions):**
Immediately after DOM mutations finish, React traverses the tree again and calls `commitHookEffectListMount(HookLayout)`.

* The `create()` callback executes synchronously.
* If `useLayoutEffect` triggers a state update (`setState`), React cancels the current paint, invalidates the work, and restarts the render pipeline **immediately** before the browser can draw pixels to the screen. This guarantees zero visual flickering.

---

### 4. Deep Dive: `useEffect` Dispatch Mechanics

To keep user interactions fast and prevent input lag, `useEffect` is designed to be **non-blocking** and asynchronous.

1. **Scheduling during Layout Phase:**
When React processes `useEffect` in the Layout Phase, it doesn't run the callback. Instead, it registers the effect on a global queue (`root.pendingPassiveEffects`) and schedules a task with the **Scheduler** at `NormalPriority`.
2. **Asynchronous Flushing (Post-Paint):**
The Scheduler uses `MessageChannel` (or `postMessage`) to yield control back to the browser so it can perform the paint.

* Once the paint completes and the browser event loop picks up the queued macro-task, `flushPassiveEffects()` is executed.
* **Order of Execution inside `flushPassiveEffects()`:**

1. Runs **ALL** cleanup functions (`destroy`) for all pending passive effects in the component tree.
2. Runs **ALL** setup functions (`create`) for all pending passive effects in the component tree.

---

### 5. Architectural Comparison Matrix

| Aspect                    | `useLayoutEffect`                                                  | `useEffect`                                            |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| **Internal Tag**          | `HookLayout` (`0b0100`)                                            | `HookPassive` (`0b1000`)                               |
| **Execution Queue**       | `fiber.updateQueue`                                                | Global `pendingPassiveEffects` queue                   |
| **Commit Phase Step**     | Synchronous during **Mutation** (cleanup) & **Layout** (mount)     | Asynchronous post-paint macro-task                     |
| **Blocks Browser Paint?** | **Yes** (Runs synchronously before paint)                          | **No** (Yields to browser paint first)                 |
| **Re-render Behavior**    | State updates inside run synchronously before paint (Zero Flicker) | State updates inside schedule a new async render cycle |
| **SSR Behavior**          | Produces warning on server (Does not run on server)                | Silently ignored on server                             |
