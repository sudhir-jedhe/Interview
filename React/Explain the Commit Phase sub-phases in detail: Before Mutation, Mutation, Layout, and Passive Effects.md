Once the **Render Phase** finishes calculating changes and building the `WorkInProgress` Fiber tree, React enters the **Commit Phase**.

Unlike the Render Phase, the Commit Phase actually touches the real DOM and executes side effects. Its core distinguishing characteristic is that it is **synchronous and non-interruptible** (with the exception of Passive Effects, which are deferred). Once the Commit Phase starts, it must run to completion before yielding back to the browser.

The Commit Phase is split into **4 distinct sub-phases**, executed in a strict chronological order:

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. BEFORE MUTATION PHASE (Sync, Pre-DOM Update)                        │
 │ • Reads live DOM state before changes occur (getSnapshotBeforeUpdate)   │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. MUTATION PHASE (Sync, DOM Write)                                    │
 │ • Mutates live DOM: Deletions ──► Placements ──► Updates              │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. LAYOUT PHASE (Sync, Post-DOM Update, Pre-Paint)                    │
 │ • Attaches refs and executes useLayoutEffect synchronously            │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
                       BROWSER PAINTS SCREEN (Pixels Visible)
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 4. PASSIVE EFFECTS PHASE (Async, Post-Paint)                           │
 │ • Executes useEffect cleanups, then useEffect callbacks in background  │
 └────────────────────────────────────────────────────────────────────────┘

```

---

### Phase 1: Before Mutation Phase (Pre-DOM Read)

The Before Mutation phase is React’s **last chance to read the current state of the live DOM** before any modifications are applied. Certain DOM metrics (like scroll position or focus state) are permanently lost once structural mutations occur.

* **Primary Mechanism:** Runs the `getSnapshotBeforeUpdate(prevProps, prevState)` lifecycle method on Class Components.
* **Traversal Direction:** React walks the Fiber tree in **depth-first post-order** (children before parents).
* **Common Use Case:** Capturing scroll positions in chat feeds or list containers before prepending new DOM elements, so the scroll offset can be adjusted in `componentDidUpdate`.

---

### Phase 2: Mutation Phase (Live DOM Operations)

The Mutation Phase is where React **applies all structural and property changes to the live HTML DOM**.

React walks the Fiber tree and inspects `fiber.flags` (bitmasks like `Placement`, `Update`, `Deletion`). To prevent layout glitches or broken parent-child dependencies, React executes DOM mutations in a **strict 3-step order**:

1. **Deletions First (`ChildDeletion`):**

* Old or unmounted DOM nodes are detached from the DOM tree first.
* Clears key/ID conflicts, unbinds refs (`ref.current = null`), and invokes unmount cleanups.

1. **Placements Next (`Placement`):**

* Newly mounted DOM elements are inserted or moved into their correct DOM positions.
* Because deletions ran first, parent container nodes and sibling anchors are stable and guaranteed to exist.

1. **Updates Last (`Update`):**

* Modifies properties, styles, attributes, text content, and event listeners on existing host DOM nodes.

> **Traversal Rule:** During Mutation, React traverses in **depth-first post-order** (children are mutated before their parents) to ensure DOM consistency.

---

### Phase 3: Layout Phase (Synchronous & Pre-Paint)

The Layout Phase runs immediately after DOM mutations have been applied, but **before the browser paints pixels to the screen**. The live DOM is fully updated in memory, but visually invisible to the user.

* **1. Ref Attachment:** React assigns live DOM element instances to `ref.current` pointers (`ref.current = domNode`).
* **2. Class Component Lifecycles:** Executes `componentDidMount` and `componentDidUpdate`.
* **3. `useLayoutEffect` Callbacks:**
* Cleanups from the previous render run first, followed by the new `useLayoutEffect` setup callbacks.
* Executed **synchronously** on the main thread.

* **Primary Use Case:** Measuring element sizes (`getBoundingClientRect()`), calculating dynamic tooltips, or adjusting scroll positions. Because it runs before paint, any secondary DOM mutations performed inside `useLayoutEffect` are batched into the same browser paint frame, **preventing visual UI flickering**.

---

### Phase 4: Browser Paint Intermission

Between the Layout Phase and Passive Effects, React yields execution back to the browser engine. The browser performs **Layout, Composite, and Paint**, making the updated UI visually visible to the end user.

---

### Phase 5: Passive Effects Phase (`useEffect` — Post-Paint)

Unlike the previous three synchronous sub-phases, the Passive Effects Phase is **asynchronous and non-blocking**. React uses its internal `Scheduler` to schedule `useEffect` execution as a low-priority task right after the paint completes.

* **Execution Order:**

1. **Cleanups First:** Runs cleanup functions from the *previous* render pass for all Fiber nodes where dependencies changed.
2. **New Callbacks Next:** Fires the new `useEffect` setup callbacks.

* **Why Deferred by Design:** Deferring `useEffect` ensures that heavy background tasks (data fetching, analytics logging, event listener bindings) never delay frame delivery or block user input responsiveness.

---

### Summary Checklist: Layout Phase vs. Passive Effects

| Metric                | Layout Phase (`useLayoutEffect`)                     | Passive Effects Phase (`useEffect`)                      |
| --------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| **Execution Timing**  | Post-DOM Mutation, **Before Paint**                  | Post-DOM Mutation, **After Paint**                       |
| **Execution Mode**    | **Synchronous / Blocking**                           | **Asynchronous / Non-blocking**                          |
| **Ref Reliability**   | `ref.current` is fully attached & ready              | `ref.current` is fully attached & ready                  |
| **UI Impact**         | Prevents visual flickering on layout reads           | Optimized for performance; does not delay visual updates |
| **Primary Use Cases** | DOM measurement, tooltip positioning, scroll restore | API calls, subscriptions, analytics, localStorage sync   |
