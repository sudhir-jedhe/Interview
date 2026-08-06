In graphics programming, **double-buffering** is a classic technique used to prevent screen tearing and flickering: drawing operations are performed off-screen on a "back buffer," and once the frame is fully prepared, it is swapped instantaneously to the "front buffer" displayed on screen.

React Fiber adapts this exact concept to the DOM. Instead of mutating the live DOM or updating component trees directly on screen, React maintains **two parallel Fiber trees in memory** at all times: the **`current`** tree and the **`workInProgress`** tree.

---

# Architecture of Fiber Double-Buffering

```text
               FLIP / SWAP
            (On Commit Phase)
                   │
                   ▼
  ┌─────────────────────────────────┐           ┌─────────────────────────────────┐
  │          CURRENT TREE           │           │      WORK-IN-PROGRESS TREE      │
  │     (Reflects live screen UI)   │           │   (Off-screen computation)      │
  │                                 │           │                                 │
  │     FiberRoot.current ──────────┼──────────►│  workInProgress.alternate ─────┼───┐
  │             │                   │           │             │                   │   │
  │             ▼                   │           │             ▼                   │   │
  │      ┌─────────────┐            │           │      ┌─────────────┐            │   │
  │      │ RootFiber A │◄───────────┼───────────┼─────►│ RootFiber B │            │   │
  │      └──────┬──────┘            │           │      └──────┬──────┘            │   │
  │             │                   │           │             │                   │   │
  │             ▼                   │           │             ▼                   │   │
  │      ┌─────────────┐            │  alternate│      ┌─────────────┐            │   │
  │      │   Child A   │◄───────────┼───────────┼─────►│   Child B   │            │   │
  │      └─────────────┘            │           │      └─────────────┘            │   │
  └─────────────────────────────────┘           └─────────────────────────────────┘   │
                 ▲                                                                    │
                 └────────────────────────────────────────────────────────────────────┘
                                        alternate pointers link
                                        matching nodes bidirectionally

```

---

## 1. The Two Trees: Roles and Responsibilities

### A. The `current` Tree

* **Role:** Represents the UI that is **currently rendered on screen**.
* **Immutability:** React treats the `current` tree as read-only while reconciliation is in progress. The live DOM directly mirrors the nodes in this tree.

### B. The `workInProgress` (WIP) Tree

* **Role:** Represents the **future state of the UI** being constructed asynchronously off-screen.
* **Mutability:** React computes state updates, runs Hook logic, calculates prop diffs, and attaches side-effect flags directly onto nodes in this tree.
* **Preemptable:** Because the WIP tree is completely detached from the live DOM, React can **pause, yield, throw away, or restart** building this tree at any time (e.g., if a high-priority user input comes in) without causing partial or glitchy DOM updates.

---

## 2. The `alternate` Pointer and Reuse Mechanics

Memory allocation during rapid rendering passes can cause garbage collection (GC) bottlenecks. To solve this, React Fiber does not destroy and recreate objects on every render.

Instead, every Fiber node in the `current` tree maintains a direct reference to its counterpart in the `workInProgress` tree through an **`alternate`** pointer:

$$\text{current.alternate} \equiv \text{workInProgress}$$

$$\text{workInProgress.alternate} \equiv \text{current}$$

When an update triggers:

1. React checks if `current.alternate` already exists.
2. If it exists, React **reuses the existing Fiber object**, copying over new props and state while resetting its effect flags.
3. If it does not exist (e.g., initial mount or newly mounted component), React creates a new Fiber node and links them bidirectionally via `.alternate`.

This bidirectional pooling mechanism keeps Fiber node allocation at $O(1)$ amortized cost during ongoing application updates.

---

## 3. The Lifecycle of an Update: Step-by-Step

Double-buffering splits React's execution into two distinct phases to achieve zero-flicker rendering:

### Step 1: Render / Reconciliation Phase (Off-Screen & Asynchronous)

* React receives a state update (`setState`).
* It begins building or updating the `workInProgress` tree starting from the `HostRoot` or affected subtree.
* As it traverses nodes, it compares incoming props/state against the `current` tree to compute diffs.
* Nodes needing DOM modifications are tagged with **Flags** (formerly `EffectTag`), such as `Placement`, `Update`, or `Deletion`.
* **Zero Flicker Guarantee:** If this phase takes 100ms or is interrupted by high-priority user input, **nothing on screen changes** because the browser DOM is still bound exclusively to the `current` tree.

### Step 2: The Commit Phase (On-Screen & Synchronous)

* Once the `workInProgress` tree is fully constructed and all side-effect flags are collected into a mutation list, React enters the Commit Phase.
* React performs all actual DOM mutations (`appendChild`, `removeChild`, attribute updates) synchronously in a single batch.

### Step 3: The Swap (Atomic Pointer Pointer Flip)

* After DOM mutations are applied, React executes the pointer swap in a single line of code:

```javascript
// Swapping the front and back buffers atomically
fiberRoot.current = workInProgress;

```

* The `workInProgress` tree instantaneously becomes the new `current` tree on screen. The old `current` tree is now demoted to the back buffer, ready to be reused as the next `workInProgress` tree when future updates occur.

---

## 4. Why Double-Buffering Prevents UI Flickering

| Problem in Single-Tree Architectures                                                                                           | How Fiber Double-Buffering Solves It                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Partial DOM Updates:** Mutating DOM nodes one-by-one causes layout thrashing and visible UI tearing if rendering slows down. | DOM mutations occur in a **single synchronous batch** only after the entire off-screen `workInProgress` tree is ready.                   |
| **Interrupted Renders:** Pausing a render halfway leaves half-updated UI elements on screen.                                   | Abandoning an interrupted render simply discards or pauses the `workInProgress` tree; the user continues seeing the stable `current` UI. |
| **Suspense / Async Data Loading:** Showing empty containers while waiting for promises leaves layout holes.                    | React keeps displaying the complete `current` UI off-screen until data resolves and the new `workInProgress` tree is ready to swap.      |

---

## Technical Summary

React Fiber's double-buffering model provides **atomic, zero-flicker UI updates** by strict separation of concerns:

1. **Reconciliation (Render Phase):** Happens off-screen on the mutable `workInProgress` tree. Interruptible, non-blocking, and invisible to the user.
2. **Mutation & Pointer Swap (Commit Phase):** Happens on-screen atomically. Synchronous, fast, and guarantees that the user only sees completely rendered frame states.
