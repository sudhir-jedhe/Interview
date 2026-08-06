In React 18 and beyond, the Fiber reconciler manages update priorities using a bitmask-based architecture called the **Lane Model**.

Before the Lane Model, React used an exponential expiration time model (`expirationTime`). While expiration times worked for sequential rendering, they struggled with **concurrent rendering**—specifically when React needed to decouple, slice, combine, or pause multiple overlapping updates simultaneously.

The Lane Model solves this by representing different types of user and network updates as 32-bit bitmasks, enabling $O(1)$ priority evaluation, update grouping, and preemption.

---

# Architecture of the React Lane Model

React represents priority lanes as 32-bit integer bitmasks, where each bit corresponds to a specific category of work. **Lower bit positions represent higher priority.**

```text
 32-Bit Priority Lane Bitmask (Simplified Conceptual Mapping)
 ┌───┬───┬───┬───┬───┬───────────────────────────┬───┬───┐
 │31 │30 │...│ 6 │ 5 │ 4                         │ 1 │ 0 │  <-- Bit Position
 └───┴───┴───┴───┴───┴───────────────────────────┴───┴───┘
   │   │       │   │   │                           │   │
   │   │       │   │   │                           │   └── SyncLane (Discrete User Input: Click, Keypress)
   │   │       │   │   │                           └────── InputContinuousLane (Continuous Input: Mousemove, Scroll)
   │   │       │   │   └────────────────────────────────── DefaultLane (Data Fetching, State Updates)
   │   │       │   └────────────────────────────────────── TransitionLane (useTransition / startTransition)
   │   │       └────────────────────────────────────────── IdleLane (Offscreen / Suspense Pre-rendering)
   │   └────────────────────────────────────────────────── OffscreenLane
   └────────────────────────────────────────────────────── NoLanes (0x00000000)

```

---

## 1. How User Input Out-Prioritizes Data Fetching

When an event fires or an asynchronous operation finishes, React assigns a specific **Lane** to the resulting state update based on where and how the update was triggered.

### Step 1: Priority Assignment at Event Boundaries

* **Discrete User Input (`SyncLane` = `0b0000000000000000000000000000001`):**
When a user performs a discrete action (clicks a button, types in an `<input>`, or presses a key), React captures the event inside a high-priority event listener. Any `setState` triggered inside this handler is tagged with `SyncLane`.
* **Continuous User Input (`InputContinuousLane`):**
Actions like dragging, scrolling, or hovering produce high-frequency events. Updates inside these handlers receive `InputContinuousLane`, keeping them smooth without blocking discrete sync events.
* **Data Fetching / Normal Updates (`DefaultLane`):**
When a network `fetch()` promise resolves or a standard `useEffect` triggers a state change, React assigns `DefaultLane` to the update.
* **Non-Urgent Transitions (`TransitionLane`):**
When an update is wrapped in `startTransition(() => { ... })` or `useTransition()`, React tags it with a `TransitionLane`.

---

### Step 2: Concurrent Work Loop Preemption

React processes work inside a continuous loop (`workLoopConcurrent`). Before working on a Fiber node, React checks whether a higher-priority update has entered the queue:

```text
  Rendering Transition / Data Fetch (DefaultLane: Bit 4)
  ──────────────────────► [ Fiber A ] ──► [ Fiber B ] 
                                                │
  ⚡ User Types in Input (SyncLane: Bit 0 Arrives!)
                                                │
  INTERRUPT! ───────────────────────────────────┘
  1. React pauses DefaultLane work.
  2. Yields main thread to browser to draw input character.
  3. Executes SyncLane update immediately.
  4. Resumes or restarts DefaultLane rendering in background.

```

If React is halfway through re-rendering a large list fetched from an API (`DefaultLane`), and the user types a character into a text field (`SyncLane`), React **immediately pauses (yields) the `DefaultLane` render**. It yields control back to the browser to render the typed character instantaneously, keeping the UI responsive at 60+ FPS.

---

## 2. Why Bitmasks Make the Lane Model Fast

React uses Bitwise Operations ($O(1)$ CPU operations) to query, group, and manipulate lanes across the Fiber tree.

### A. Checking for Highest Priority

To find the highest priority work across the entire application, React performs a bitwise operation to isolate the **Least Significant Bit (LSB)**:

```javascript
// Finds the highest priority lane from a set of pending lanes
function getHighestPriorityLane(lanes) {
  return lanes & -lanes; // Returns the lowest set bit in O(1) time
}

```

### B. Grouping Multiple Lanes

If multiple updates occur at similar times, React can combine them into a single bitmask using the bitwise OR (`|`) operator:

```javascript
// Merging pending updates into the root work mask
root.pendingLanes |= updateLane;

```

### C. Checking for Overlapping Work

To check if a Fiber node has work matching the currently rendering lanes, React uses the bitwise AND (`&`) operator:

```javascript
// Check if this fiber has updates relevant to the current render pass
if ((fiber.lanes & renderLanes) !== NoLanes) {
  // Execute work for this fiber
} else {
  // Bypasses (baILS OUT) rendering this fiber tree!
}

```

---

## 3. Preventing Starvation: Expiration Times in the Lane Model

A critical problem with priority-based scheduling is **Starvation**: if a user continuously types or scrolls, lower-priority background tasks (like rendering fetched data) might never finish.

To solve this, React attaches an **Expiration Time** to every lane:

1. When a `DefaultLane` or `TransitionLane` update is queued, React records an expiration deadline (e.g., current time + 5000ms).
2. If the user keeps typing and `SyncLane` continually preempts `DefaultLane`, the expiration deadline eventually passes.
3. Once a lane expires, React **forces it to upgrade to `SyncLane` status**, making it un-preemptable until it completes.

---

## Technical Summary Matrix

| Lane Category             | Trigger Source                             | Priority Level | Can Be Preempted By               |
| ------------------------- | ------------------------------------------ | -------------- | --------------------------------- |
| **`SyncLane`**            | Click, Keypress, Input change              | **Highest**    | Nothing (Runs synchronously)      |
| **`InputContinuousLane`** | Mousemove, Scroll, Drag                    | High           | `SyncLane`                        |
| **`DefaultLane`**         | Data fetching responses, `useEffect` state | Medium         | `SyncLane`, `InputContinuousLane` |
| **`TransitionLane`**      | `useTransition()`, `startTransition()`     | Low            | All higher lanes                  |
| **`IdleLane`**            | Offscreen components, Suspense fallbacks   | **Lowest**     | All higher lanes                  |
