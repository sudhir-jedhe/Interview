Here is a clean, well-formatted reference guide based on your notes explaining how React's fiber architecture constructs and commits DOM nodes under the hood.

---

# How React Builds and Commits the DOM: `beginWork` vs. `completeWork`

React creates real in-memory DOM nodes during the **Render Phase**, but you will never see them on screen until the **Commit Phase** acts on them.

Understanding the distinction between these two steps changes how you mental-model React's rendering engine entirely.

---

## The 3-Step Lifecycle of a React Render

```text
               RENDER PHASE (Interruptible)
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │   1. beginWork() ─────────────► Top-Down          │
  │      (Fiber Tree Construction)   (Root to Leaf)  │
  │                                                  │
  │   2. completeWork() ──────────► Bottom-Up        │
  │      (In-Memory DOM Creation)    (Leaf to Root)  │
  │                                                  │
  └────────────────────────┬─────────────────────────┘
                           │
                           ▼
               COMMIT PHASE (Uninterruptible)
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │   3. Mutation Phase ──────────► Single-Shot      │
  │      (Appends to Live DOM)       (Screen Update) │
  │                                                  │
  └──────────────────────────────────────────────────┘

```

---

## Step 1: `beginWork` Goes Down the Tree (Top-Down)

During `beginWork`, React processes each Fiber node from top to bottom (Root $\rightarrow$ Leaf).

* **Goal:** Reconcile state/props and figure out what changed.
* **Process:** Calls component functions, evaluates hooks, computes new props, and creates child Fibers.
* **DOM Status:** **No DOM nodes are created here.** This step is purely constructing the Fiber tree in memory.

---

## Step 2: `completeWork` Goes Up the Tree (Bottom-Up)

Once React reaches a leaf Fiber with no more children to process, `completeWork` executes on that Fiber and bubbles back up toward the root.

* **Goal:** Instantiate and assemble the in-memory DOM nodes.
* **Process:**

1. `document.createElement()` is called for host components (`div`, `span`, `button`).
2. Sets initial DOM attributes (`className`, `style`, event listeners).
3. Appends child DOM nodes to parent DOM nodes, building the subtree **bottom-up**.

* **DOM Status:** By the time `completeWork` finishes on the Root Fiber, React holds a **fully built, detached DOM subtree sitting in memory**, completely untouched by the live document.

---

## Step 3: Mutation Phase Commits It to the Screen (Single-Shot)

The Commit Phase takes over once the Render Phase finishes building the in-memory DOM tree.

* **Goal:** Flush changes to the live browser viewport.
* **Process:** React takes the pre-built in-memory DOM structure and attaches/mutates it in the live `document` in one synchronous operation.
* **DOM Status:** Live on screen. Because this happens in a single browser paint frame, there are no partial renders, no visual flickering, and no half-built UIs.

---

## Summary Mental Model & Key Takeaways

$$\text{Render Phase (In-Memory)} \longrightarrow \text{Commit Phase (Screen Update)}$$

* **Render Phase Builds | Commit Phase Ships:** The user only ever sees the finished result.
* **Why Render Phase is Interruptible:** Because `completeWork` operates strictly on detached in-memory DOM nodes without touching the live document, React Concurrent Mode can **pause, yield, prioritize, or discard** work at any time without leaving artifact pixels on screen.
* **No Turning Back in Commit:** Once the Mutation Phase begins, it cannot be interrupted. React commits everything synchronously to preserve UI consistency.
