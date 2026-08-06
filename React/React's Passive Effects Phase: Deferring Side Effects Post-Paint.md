Here is a clean, structured technical reference guide detailing the **Passive Effects Phase**, `useEffect` scheduling mechanics, and why React intentionally defers these side effects until after the browser paint.

---

# React's Passive Effects Phase: Deferring Side Effects Post-Paint

The **Passive Effects Phase** is the fourth and final sub-phase of React's **Commit Phase**. It is where `useEffect` callbacks and cleanups execute.

Unlike the preceding synchronous commit sub-phases (Before Mutation, Mutation, and Layout), the Passive Effects Phase is explicitly designed to be **asynchronous and non-blocking**.

---

## 1. Execution Timeline & Browser Paint Intermission

React separates UI updates from side-effect processing by yielding execution back to the browser engine before firing `useEffect`:

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. MUTATION PHASE (Sync)                                               │
 │ • Mutates live DOM nodes (Deletions ──► Placements ──► Updates)        │
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
 │ 3. PASSIVE EFFECTS PHASE (Async / Non-Blocking)                        │
 │ • Executes useEffect cleanups from previous render pass                │
 │ • Executes new useEffect setup callbacks via Scheduler                 │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Why Deferred Execution Matters

The browser's main thread handles layout calculations, style recalculations, pixel painting, user inputs, and JavaScript execution.

By deferring `useEffect` until after the browser paint:

* **Instant Visual Delivery:** The user sees the rendered screen without waiting for data-fetching requests, event listener bindings, or localStorage synchronization to complete.
* **Input Responsiveness:** High-priority user interactions (typing, clicking, tapping) are not delayed by heavy background effect callbacks.

---

## 3. Strict Execution & Cleanup Order

When the `scheduler` package executes queued passive effects (`flushPassiveEffects`), React processes them in two sequential passes across the affected Fiber nodes:

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

### Step 1: Previous Render Cleanups Run First

React executes **all cleanup functions** from the previous render pass before running any new effect setups.

* Detaches old event listeners, clears interval/timeout timers, and cancels WebSocket or network subscriptions.
* **Why First?** Prevents two instances of an effect running simultaneously, avoiding state contamination and race conditions.

### Step 2: New Render Setups Run Second

Once all cleanups across the affected component subtree are complete, React executes the new `useEffect` setup callbacks.

---

## 4. Development Double-Invocation (React 18 & 19 Strict Mode)

In development mode under `<React.StrictMode>`, React intentionally mounts, unmounts, and remounts components:

$$\text{Mount (Setup)} \longrightarrow \text{Unmount (Cleanup)} \longrightarrow \text{Remount (Setup)}$$

### Why Strict Mode Does This

1. **Surfaces Missing Cleanups:** If an effect attaches a global event listener or subscription without a cleanup function, the double invocation immediately reveals memory leaks or duplicate listeners in development.
2. **Prepares for Resilient UIs:** Verifies that components can safely handle being mounted and unmounted dynamically (e.g., Offscreen rendering, Fast Refresh, or server-driven navigation).

> **Note:** This double invocation occurs **only in development mode** and is completely stripped in production builds.

---

## Summary Checklist

| Metric              | `useLayoutEffect`                                 | `useEffect`                                       |
| ------------------- | ------------------------------------------------- | ------------------------------------------------- |
| **Phase Location**  | 3rd Sub-Phase (Layout)                            | 4th Sub-Phase (Passive Effects)                   |
| **Timing**          | Post-Mutation, **Before Paint**                   | Post-Mutation, **After Paint**                    |
| **Thread Blocking** | **Synchronous / Blocking**                        | **Asynchronous / Non-blocking**                   |
| **Primary Tasks**   | DOM measurements, positioning, scroll adjustments | API calls, subscriptions, analytics, localStorage |
| **Cleanup Timing**  | Runs synchronously before paint                   | Runs asynchronously after paint                   |
