In React 19, **Async Transitions** (`useTransition`, `startTransition`, and `useActionState`) fundamentally alter how React handles asynchronous work relative to the DOM commit phase.

Unlike traditional asynchronous JavaScript—where `await` boundaries split code execution across microtask queues and trigger intermediate, fragmented renders—React 19 introduces a **unified multi-phase transaction model**. This model guarantees that asynchronous data updates, optimistic UI states, and pending indicators are coordinated into atomic, consistent DOM commits.

---

## 1. The Async Transition Lifecycle

When an async transition function is executed, React divides its lifecycle into three distinct phases:

```
[ Async Action Initiated ]
       │
       ├── PHASE 1: Sync Setup Phase (Immediate DOM Commit)
       │     ├── Set pending flags (`isPending = true`)
       │     ├── Dispatch optimistic updates (`useOptimistic`)
       │     └── ⚡ Immediate DOM Commit #1 (Renders loading UI / preview)
       │
       ├── PHASE 2: Asynchronous Execution Phase
       │     ├── Executes `await` calls (Network, Server Actions, Promises)
       │     └── React pauses rendering for this transition (UI remains interactive)
       │
       └── PHASE 3: Completion Phase (Final Atomic DOM Commit)
             ├── Server data returns or Promises resolve
             ├── Sync real state (`setState`) and clear pending flags
             └── ⚡ Immediate DOM Commit #2 (Renders final confirmed UI)

```

---

## 2. Synchronization Rules with the DOM Commit Phase

### A. The "Sync Setup" Flush (Commit #1)

Before any `await` boundary is crossed in an async transition, React synchronously executes all state updates declared up to that point.

* **Immediate Synchronous Schedule:** Calls to `setOptimistic` or state changes inside the initial body of `startTransition` are processed immediately within a high-priority, non-blocking render pass.
* **DOM Commit #1:** React flushes these setup changes to the real DOM in a single commit. This ensures that optimistic updates and pending indicators (`isPending: true`) appear on the screen **before** the network request or async Promise begins waiting.

```tsx
const [isPending, startTransition] = useTransition();

const handleSubmit = () => {
  startTransition(async () => {
    // 1. Synchronous phase: Flushed to DOM immediately in Commit #1
    setOptimisticUI(true); 

    // 2. Microtask boundary: Execution yields to browser
    await apiCall(); 

    // 3. Deferred phase: Processed after Promise resolves, committed in Commit #2
    setRealData(data); 
  });
};

```

### B. Suspense Boundary Synchronization & DOM Holding

During Phase 2, if an async transition triggers a Suspense boundary (e.g., reading a Promise via `use(promise)` or fetching a React Server Component subtree), React **holds back the DOM commit phase** for the transition's target UI.

* **No Intermediate Empty States:** Instead of clearing the screen or swapping out the existing UI for fallback spinners, React keeps the **current, fully rendered DOM tree mounted and responsive** on screen.
* **Forked Tree Rendering:** React builds the next UI tree offscreen in memory. Only when all suspended Promises inside the async transition resolve does React commit the complete new virtual DOM tree to the real DOM in one atomic operation.

### C. Batching Across Async Boundaries (Commit #2)

In React 18 and earlier, state updates fired after an `await` were processed across multiple microtasks. In React 19, **all state updates occurring after an `await` inside a transition are automatically batched into a single final commit**.

When `await apiCall()` completes:

1. The server response data is applied to state.
2. The `isPending` status is toggled from `true` to `false`.
3. The temporary `useOptimistic` override is cleared (or reconciled with the server state).
4. **DOM Commit #2:** React performs a single, atomic DOM mutation containing all three updates simultaneously. This prevents UI flickering or intermediate renders where data is updated but loading states remain active.

---

## 3. Handling Concurrent Transitions & Interruptibility

Because transitions run at a **lower priority** than urgent user inputs (such as typing in a text field or moving the mouse), the DOM commit phase respects the following synchronization guards:

1. **Urgent Interruption:** If a user types into an input field while an async transition is awaiting data, React pauses rendering the offscreen transition tree, immediately processes and commits the typing input to the DOM, and then resumes rendering the transition tree in memory.
2. **Rollback Synchronization:** If the async transition throws an uncaught error or rejects during Phase 2, React skips Phase 3's DOM commit entirely. On the next render pass, React discards the offscreen tree and automatically reverts the DOM by dropping the optimistic updates applied in Commit #1.

---

## Summary Matrix

| Transition Stage              | Execution Context                   | DOM Commit Behavior                                                                           |
| ----------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| **Sync Setup** (Pre-`await`)  | Synchronous JS execution            | **Committed immediately** (Renders `isPending: true` and optimistic updates).                 |
| **Pending Async** (`await`)   | Event loop microtask / network wait | **No DOM mutations.** Current UI remains interactive; next UI builds offscreen.               |
| **Suspense Triggered**        | Async Promise pending               | **DOM commit blocked.** Fallbacks are bypassed; current UI is held until resolved.            |
| **Completion** (Post-`await`) | Batched microtask resolution        | **Single Atomic Commit** (Flushes final state, clears `isPending`, reconciles optimistic UI). |
