Here is a clean, structured technical reference guide detailing the **Commit Phase**, its fundamental architectural guarantees, and its 4 sequential sub-phases.

---

# React's Commit Phase: From WorkInProgress to Real DOM

While the **Render Phase** calculates changes offscreen in memory (pure, asynchronous, interruptible), the **Commit Phase** actually applies those changes to the live browser environment.

---

## 1. Core Principles of the Commit Phase

* **Synchronous & Non-Interruptible:** Once the Commit Phase begins, it **cannot be paused, yielded, or cancelled**. It must complete in a single execution frame before handing control back to the browser.
* **Atomic UI Updates:** React commits all DOM changes simultaneously. Updating the DOM partially or in slices would cause visual tearing, layout glitches, and broken user interface states.
* **Direct DOM Access:** Live DOM nodes (`HTMLDivElement`, `HTMLInputElement`) are created, updated, or removed here, and `ref.current` pointers are populated.

---

## 2. Render Phase vs. Commit Phase

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ RENDER PHASE (Reconciliation)                                          │
 │ • Computes state/props diffs and builds WorkInProgress tree            │
 │ • Pure & side-effect free                                             │
 │ • Interruptible / Time-Sliced (~5ms frames)                            │
 │ • Touches ZERO live DOM nodes                                          │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ COMMIT PHASE (Execution)                                              │
 │ • Applies mutations to live HTML DOM & executes lifecycle side-effects  │
 │ • Synchronous & Non-Interruptible (Blocking)                           │
 │ • Touches LIVE DOM nodes                                              │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 3. The 4 Sub-Phases of the Commit Phase

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. BEFORE MUTATION PHASE (Pre-DOM Update Read)                         │
 │ • Reads current live DOM metrics (getSnapshotBeforeUpdate)             │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. MUTATION PHASE (DOM Write)                                          │
 │ • Mutates live DOM in strict order: Deletions ──► Placements ──► Updates│
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. LAYOUT PHASE (Post-DOM Update, Pre-Paint)                           │
 │ • Binds ref.current pointers                                          │
 │ • Fires useLayoutEffect synchronously                                  │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
                       BROWSER PAINTS SCREEN (Pixels Visible)
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 4. PASSIVE EFFECTS PHASE (Post-Paint Read/Write)                       │
 │ • Executes useEffect cleanups and callbacks asynchronously            │
 └────────────────────────────────────────────────────────────────────────┘

```

### Sub-Phase 1: Before Mutation (Pre-DOM Read)

Before altering any DOM nodes, React reads existing DOM attributes that would otherwise be destroyed or lost during structural mutation.

* **Executed API:** `getSnapshotBeforeUpdate(prevProps, prevState)` on Class Components.
* **Typical Use Case:** Capturing container scroll offsets or text selection coordinates before prepending items to a chat feed.

### Sub-Phase 2: Mutation Phase (DOM Writes)

React applies calculated structural and attribute changes to the live DOM tree based on bitfields assigned to `fiber.flags`. Mutations execute in a **strict 3-step order**:

1. **Deletions First (`ChildDeletion`):** Detaches unmounted DOM nodes, clears key/ID collisions, and unbinds refs (`ref.current = null`).
2. **Placements Next (`Placement`):** Inserts newly created DOM nodes into container structures.
3. **Updates Last (`Update`):** Modifies text nodes, styles, attributes, and attaches event listeners.

### Sub-Phase 3: Layout Phase (Synchronous & Pre-Paint)

Runs immediately after DOM mutations have finished, but **before the browser paints pixels to the screen**.

* **Ref Binding:** Live DOM node instances are bound to `ref.current`.
* **Executed APIs:** `componentDidMount`, `componentDidUpdate`, and **`useLayoutEffect`**.
* **Why Synchronous:** Allows developers to measure DOM layout dimensions (`getBoundingClientRect()`) and perform secondary imperative DOM adjustments instantly before the user sees the frame, **preventing visual layout flickering**.

### Sub-Phase 4: Passive Effects Phase (`useEffect` — Post-Paint)

After the Layout Phase completes, React yields back to the browser engine so it can calculate styles, execute layout passes, and **paint pixels to the screen**. Once painted:

* **Executed APIs:** `useEffect` cleanups from the previous render, followed by new `useEffect` setup callbacks.
* **Asynchronous Execution:** React uses its internal `Scheduler` package to queue `useEffect` callbacks as low-priority tasks, ensuring data fetching, subscriptions, and analytics logging do not delay frame delivery or block user interaction.

---

## Summary Comparison Table

| Sub-Phase           | Primary Purpose                             | Timing relative to Paint | Blocking / Async                |
| ------------------- | ------------------------------------------- | ------------------------ | ------------------------------- |
| **Before Mutation** | Capture pre-update DOM state                | Before Paint             | Synchronous / Blocking          |
| **Mutation**        | Apply DOM deletions, insertions, updates    | Before Paint             | Synchronous / Blocking          |
| **Layout**          | Attach `ref.current`, run `useLayoutEffect` | Before Paint             | Synchronous / Blocking          |
| **Passive Effects** | Run `useEffect` callbacks & cleanups        | **After Paint**          | **Asynchronous / Non-blocking** |
