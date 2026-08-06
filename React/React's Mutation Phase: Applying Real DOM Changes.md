Here is a clean, structured reference guide detailing the **Mutation Phase**, its strict execution order, and its traversal algorithm.

---

# React's Mutation Phase: Applying Real DOM Changes

The **Mutation Phase** is the second sub-phase of React's **Commit Phase**. This is the exact moment where React leaves the in-memory world of Fiber nodes and applies actual mutations to the browser's live HTML DOM.

Because the live DOM is visible and stateful, React executes these mutations in a **strict, non-arbitrary order** using a **depth-first post-order traversal** to guarantee DOM consistency and avoid visual glitches.

---

## 1. The Strict 3-Step Execution Order

React processes DOM mutations in three distinct passes across the Fiber tree. It never applies deletions, insertions, and updates simultaneously or out of order.

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. DELETIONS FIRST (ChildDeletion)                                     │
 │ • Removes unmounted DOM nodes from the tree                            │
 │ • Clears refs (ref.current = null) and detaches event listeners        │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. PLACEMENTS NEXT (Placement / PlacementAndUpdate)                    │
 │ • Inserts newly created DOM nodes into container elements              │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. UPDATES LAST (Update)                                               │
 │ • Modifies properties, text content, inline styles, & event handlers  │
 └────────────────────────────────────────────────────────────────────────┘

```

### Why the Sequence Order Matters

1. **Deletions First (`ChildDeletion`):**

* **Prevents Key/ID Collisions:** If an element with key `"item-1"` is replaced by a new element with the same key, the old DOM node must be removed first so the new node doesn't conflict with existing IDs or DOM positions.
* **Cleans Up Memory:** Unbinds event listeners, detaches refs (`ref.current = null`), and runs component unmount lifecycles before new elements take up memory.

1. **Placements Next (`Placement`):**

* **Guarantees Target Containers Exist:** Because deletions ran first, parent DOM containers and sibling anchor nodes are already cleared and stable in memory. Newly created elements can be inserted (`appendChild` / `insertBefore`) into exact positions without interference.

1. **Updates Last (`Update`):**

* **Operates on a Stable DOM Structure:** Modifying text content, CSS styles, or element attributes occurs after all structural additions and removals have settled. This ensures updates operate against a complete, finalized DOM structure.

---

## 2. Traversal Order: Depth-First Post-Order

During the Mutation Phase, React walks the Fiber tree in **depth-first post-order**—meaning **children are always mutated before their parents**.

```text
                         [ 3. Parent ]
                        /             \
                       /               \
            [ 1. Child A ] ──► [ 2. Child B ]

```

### Why Children Before Parents?

* **Bottom-Up Assembly:** When mounting a list or nested structure, child DOM elements are appended to their immediate parent before that parent is inserted into the document body.
* **Ref & Effect Readiness:** Ensures descendant nodes have their host DOM instances fully configured before parent containers calculate layout offsets or bind parent-level refs.

---

## 3. Summary Checklist

| Step              | Action                             | Bitmask Flag    | Key Reason                                                 |
| ----------------- | ---------------------------------- | --------------- | ---------------------------------------------------------- |
| **1. Deletions**  | Remove unmounted HTML elements     | `ChildDeletion` | Prevents key/ID conflicts & clears memory.                 |
| **2. Placements** | Insert newly mounted HTML elements | `Placement`     | Inserts nodes into stable, existing parent DOM structures. |
| **3. Updates**    | Modify styles, attributes, text    | `Update`        | Applies changes to settled, fully-formed DOM elements.     |
