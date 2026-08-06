Here is a comprehensive breakdown of the complete React rendering architecture, reconstructed step-by-step from state trigger to pixel paint.

---

# The Complete React Rendering Pipeline

```text
 [1. TRIGGER] ──► [2. LANES & SCHEDULER] ──► [3. RENDER PHASE (WorkLoop)] ──► [4. COMMIT PHASE] ──► [5. PAINT & PASSIVE]
   setState()        Assign Priority            Interruptible / Async            Synchronous / Blocking     Browser Paints & useEffect

```

---

## Step 1: Trigger & Priority Scheduling (`Lanes`)

When you call `setState()` or `dispatch()`, React creates an **Update object** and assigns it a **Lane** based on the event context.

* **Bitmask Priorities:** Lanes are 32-bit integers (`SyncLane`, `InputContinuousLane`, `DefaultLane`, `TransitionLane`). The lower the binary bit value, the higher the priority.
* **Upward Propagation (`childLanes`):** The lane priority is merged upward into the `childLanes` field of every ancestor fiber up to the root. This allows React to know in $O(1)$ time whether a subtree contains pending work without traversing it.

---

## Step 2: The Render Phase (Interruptible Work)

The Render Phase calculates what changes need to be made. It touches **zero live DOM nodes** and can be paused, yielded, or restarted.

```text
                      ┌───────────────────────────┐
                      │      WORKLOOP CORE        │
                      └─────────────┬─────────────┘
                                    │
                         Is time left in frame?
                                  /   \
                            (NO) /     \ (YES)
                                /       \
                               ▼         ▼
                      Yield to Browser   Pick Next Fiber Node
                     (shouldYield: true)         │
                                                 ▼
                                        beginWork(fiber)
                                    (Diffing / React.memo)
                                                 │
                                                 ▼
                                        completeWork(fiber)
                                    (Build offscreen DOM & set flags)

```

1. **`workLoop` & Time Slicing:** React processes one Fiber at a time. After each unit of work, it checks `shouldYield()` from the Scheduler. If the frame budget (~5ms) is exhausted, React yields back to the main thread to keep input/animations smooth.
2. **`beginWork`:**

* Compares `pendingProps` against `memoizedProps`.
* If props, state, and context haven't changed (or if wrapped in `React.memo`), React skips (`bails out`) the component and reuses the subtree.

1. **`completeWork`:**

* Traverses back up in depth-first post-order.
* Creates offscreen HTML DOM instances in `fiber.stateNode`.
* Attaches bitwise side-effect tags to `fiber.flags` (`Placement`, `Update`, `ChildDeletion`, `Passive`).

---

## Step 3: The Commit Phase (Synchronous & Blocking)

Once reconciliation finishes, React enters the **Commit Phase**. Unlike the Render Phase, this phase is **synchronous and non-interruptible** to prevent partial or broken DOM state from being visible to the user.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3.1 BEFORE MUTATION PHASE                                             │
 │ • getSnapshotBeforeUpdate() captures current DOM metrics (scroll, size)│
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3.2 MUTATION PHASE (Live DOM Updates)                                 │
 │ • Executed in strict depth-first post-order (Children before Parents):│
 │   1. Deletions  ──► Remove unmounted nodes & run ref cleanups         │
 │   2. Placements ──► Insert newly mounted DOM elements                  │
 │   3. Updates    ──► Patch text, attributes, and event handlers         │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3.3 LAYOUT PHASE (Synchronous & Blocking)                             │
 │ • Ref Attachment: DOM nodes bound to ref.current                     │
 │ • useLayoutEffect: Setup callbacks execute synchronously             │
 │   (Earliest window for DOM measurements & flickering preventions)    │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## Step 4: Browser Paint

The Commit Phase pauses execution and hands control back to the browser engine. The browser recalculates layout, composite layers, and **paints pixels to the physical screen**.

---

## Step 5: Passive Effects Phase (`useEffect`)

After the browser paint finishes, React's Scheduler executes all queued **Passive Effects** (`useEffect`) asynchronously in the background.

```text
               BROWSER PAINT COMPLETED (Pixels on screen)
                                   │
                                   ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 5.1 PASSIVE CLEANUP (Previous Render)                                  │
 │ • Clears stale event listeners, timers, or subscriptions.             │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 5.2 PASSIVE CALLBACKS (New Render)                                    │
 │ • Data fetching, state updates, analytics logging, subscriptions.     │
 │ • Runs asynchronously without blocking frame delivery or user inputs.  │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## Practical Code Example Illustrating Execution Order

Below is a complete, runnable example demonstrating the exact lifecycle execution order across all phases:

```jsx
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

export function RenderingPipelineDemo() {
  const [count, setCount] = useState(0);
  const boxRef = useRef(null);

  // 1. RENDER BODY Execution
  console.log(`[1. RENDER PHASE] Rendering body. count: ${count}, ref.current:`, boxRef.current);

  // 2. LAYOUT EFFECT (Sync, Before Paint)
  useLayoutEffect(() => {
    console.log(`[3. LAYOUT PHASE] useLayoutEffect runs. ref.current:`, boxRef.current?.getBoundingClientRect());
    
    return () => {
      console.log(`[3. LAYOUT CLEANUP] Synchronous cleanup before paint`);
    };
  }, [count]);

  // 3. PASSIVE EFFECT (Async, Post-Paint)
  useEffect(() => {
    console.log(`[5. PASSIVE PHASE] useEffect runs asynchronously after paint.`);

    return () => {
      console.log(`[5. PASSIVE CLEANUP] Asynchronous cleanup of previous effect`);
    };
  }, [count]);

  return (
    <div style={{ padding: '20px' }}>
      <div ref={boxRef} id="box">
        Count: {count}
      </div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

```

### Console Output Timeline on Button Click

```text
[1. RENDER PHASE] Rendering body. count: 1, ref.current: <div id="box"> (Old DOM)
[3. LAYOUT CLEANUP] Synchronous cleanup before paint
[3. LAYOUT PHASE] useLayoutEffect runs. ref.current: DOMRect { width: 100, height: 20 }
─────────────── BROWSER PAINTS PIXELS TO SCREEN ───────────────
[5. PASSIVE CLEANUP] Asynchronous cleanup of previous effect
[5. PASSIVE PHASE] useEffect runs asynchronously after paint.

```

---

## Key Phase Comparison Matrix

| Phase / Feature    | Timing       | Execution Type              | Primary Purpose                                                        |
| ------------------ | ------------ | --------------------------- | ---------------------------------------------------------------------- |
| **Render Phase**   | Before DOM   | Interruptible / Time-sliced | Diffing tree, running `beginWork`/`completeWork`, calculating changes. |
| **Mutation Phase** | Live DOM     | Synchronous / Blocking      | Applying DOM Deletions $\rightarrow$ Placements $\rightarrow$ Updates. |
| **Layout Phase**   | Before Paint | Synchronous / Blocking      | Binding `ref.current`, measuring layout, firing `useLayoutEffect`.     |
| **Passive Phase**  | After Paint  | Asynchronous / Non-blocking | Data fetching, event subscriptions, running `useEffect`.               |
