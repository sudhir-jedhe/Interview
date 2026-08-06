Here is a clean, structured reference guide breaking down the **Render Phase**, its sub-routines (`beginWork` and `completeWork`), and how offscreen DOM creation works during reconciliation.

---

# The Anatomy of React's Render Phase

The **Render Phase** is the pure, calculation-heavy phase of React's reconciliation engine. During this phase, React walks the Fiber tree to compute necessary state/prop changes, diff element structures, and build an offscreen DOM tree—all **without touching the live on-screen DOM**.

Because no side effects or live DOM mutations occur here, the Render Phase is completely **pure, interruptible, and pauseable**.

---

## 1. The High-Level 3-Stage Pipeline

```text
 ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
 │      1. RENDER PHASE      │ ───► │      2. COMMIT PHASE      │ ───► │      3. BROWSER PAINT     │
 │ Calculates changes & diffs│      │ Applies mutations to live │      │ Renders pixels to screen  │
 │ (Interruptible / Pure)    │      │ DOM (Synchronous / Block) │      │ (Layout, Composite)       │
 └───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘

```

---

## 2. The Heart of Render Phase: `workLoop`

Instead of processing the entire application tree synchronously in a single giant function call, the `workLoop` processes **one Fiber node at a time**.

```text
                             ┌───────────────────────────┐
                             │       workLoop Core       │
                             └─────────────┬─────────────┘
                                           │
                                Is time left in budget?
                                       /       \
                                 (NO) /         \ (YES)
                                     /           \
                                    ▼             ▼
                            Yield to Browser    Process Next Fiber
                          (shouldYield() === true)      │
                                                        ▼
                                               beginWork(fiber)
                                                        │
                                                        ▼
                                              completeWork(fiber)

```

After completing each unit of work (one Fiber node), React calls `shouldYield()` from the `scheduler` package:

* **If `shouldYield()` is `false`:** Time remains in the frame budget (~5ms); continue to the next Fiber.
* **If `shouldYield()` is `true`:** Pause rendering, yield control back to the browser to process inputs/paints, and resume on the next frame.

---

## 3. Downward Traversal: `beginWork` (Deciding What Changes)

`beginWork` runs as React steps **down** the Fiber tree towards the leaves.

### Key Responsibilities

1. **Prop & State Diffing:** Compares incoming `pendingProps` against previous `memoizedProps`.
2. **Memoization & Bailout (`React.memo` / React 19 Compiler):**

* If props, state, and context haven't changed (or if `React.memo` evaluates to `true`), `beginWork` **bails out**.
* Bailing out means React reuses the existing child Fiber pointers without executing component code or traversing deeper into that branch.

1. **Child Reconciliation:** If changes occurred, React calls component render functions (`MyComponent()`) to generate new child Fibers.

---

## 4. Upward Traversal: `completeWork` (Finalizing & Queueing Effects)

`completeWork` runs as React finishes processing leaf nodes and steps **back up** the tree toward the root.

### Key Responsibilities

1. **Offscreen DOM Creation (`HostComponent`):** For native tags like `<div>` or `<button>`, React calls `document.createElement()` and stores the unattached DOM node in `fiber.stateNode`.
2. **Offscreen Tree Assembly:** Appends child DOM nodes to parent DOM nodes **in memory**. By the time `completeWork` reaches the root, a complete, unattached DOM tree exists in memory ready for injection.
3. **Side-Effect Flagging:** Attaches bitfield flags (`fiber.flags`) to mark nodes for `Placement` (insertion), `Update` (modification), `ChildDeletion` (removal), or `Passive` (`useEffect`).

---

## 5. Summary Checklist

| Concept         | Action in `beginWork`                         | Action in `completeWork`                    |
| --------------- | --------------------------------------------- | ------------------------------------------- |
| **Direction**   | Downward (Root $\rightarrow$ Leaf)            | Upward (Leaf $\rightarrow$ Root)            |
| **Primary Job** | Diffs props/state & runs component code       | Creates offscreen DOM & sets mutation flags |
| **Bailout**     | Skips subtree if `props` match (`React.memo`) | Aggregates child `subtreeFlags` upward      |
| **DOM Impact**  | No DOM creation                               | Creates unattached `stateNode` instances    |
