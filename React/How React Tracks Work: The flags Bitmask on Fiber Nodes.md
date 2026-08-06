Here is a clean, well-structured reference guide explaining how React uses bitwise `flags` on Fiber nodes to coordinate commit-phase side effects efficiently.

---

# How React Tracks Work: The `flags` Bitmask on Fiber Nodes

When React updates a component, it needs a fast, memory-efficient way to remember what work must be performed during the **Commit Phase**.

Instead of allocating status objects or running expensive property checks, React uses a single integer property on every Fiber node: **`fiber.flags`** (formerly known as `effectTag`).

---

## 1. Why Bitwise Flags? (The Design Strategy)

A single Fiber node often needs to perform multiple operations at commit time:

* Insert a DOM node into the document.
* Detach an old `ref` and attach a new one.
* Execute `useEffect` or `useLayoutEffect` callbacks.

Using standard arrays or JavaScript objects to list pending jobs for every Fiber node would add massive garbage collection overhead. **Bitwise flags solve this cleanly:**

* **Zero Allocations:** Multiple pending jobs are packed into a single 32-bit integer.
* **$O(1)$ Bitwise Operations:** Setting, checking, and clearing pending work requires simple CPU bitwise operations (`|`, `&`, `~`).

---

## 2. Core Flag Constants in React Source Code

React assigns a single unique bit position (power of 2 in binary) to each type of work.

```javascript
// Excerpt from React source code (ReactFiberFlags.js)
export const NoFlags         = 0b0000000000000000000000000000000; // 0
export const PerformedWork   = 0b0000000000000000000000000000001; // 1
export const Placement       = 0b0000000000000000000000000000010; // 2
export const Update          = 0b0000000000000000000000000000100; // 4
export const ChildDeletion   = 0b0000000000000000000000000010000; // 16
export const Ref             = 0b0000000000000000000010000000000; // 1024
export const Passive         = 0b0000000000000000010000000000000; // 8192

```

### Primary Flags Explained

| Flag Constant       | Binary Bit Position    | Meaning / Trigger                                                                |
| ------------------- | ---------------------- | -------------------------------------------------------------------------------- |
| **`Placement`**     | `0b0...0010`           | Fiber is new or moved; needs DOM insertion (`appendChild` / `insertBefore`).     |
| **`Update`**        | `0b0...0100`           | Fiber exists; props or state changed, needs DOM attribute/text patching.         |
| **`ChildDeletion`** | `0b0...10000`          | One or more children were removed during reconciliation; requires unmounting.    |
| **`Ref`**           | `0b0...10000000000`    | A `ref` needs to be detached from the old DOM node and attached to the new node. |
| **`Passive`**       | `0b0...10000000000000` | Fiber has a `useEffect` callback that must be queued for post-paint execution.   |

---

## 3. How React Uses Flags: Render Phase vs. Commit Phase

```text
       RENDER PHASE (Reconciliation)             COMMIT PHASE (DOM Execution)
  ┌─────────────────────────────────────┐   ┌───────────────────────────────────┐
  │ React compares Old vs New Fiber.    │   │ React checks fiber.flags:         │
  │                                     │   │                                   │
  │ • New node?                         │   │ • flags === 0                     │
  │   flags |= Placement                │   │   ─► Skip node entirely!          │
  │                                     │   │                                   │
  │ • Props changed?                    │   │ • (flags & Placement) !== 0       │
  │   flags |= Update                   │   │   ─► Insert into live DOM         │
  │                                     │   │                                   │
  │ • Has useEffect?                    │   │ • (flags & Passive) !== 0         │
  │   flags |= Passive                  │   │   ─► Schedule post-paint effect   │
  └─────────────────────────────────────┘   └───────────────────────────────────┘

```

### Combining Flags During Render Phase

During reconciliation, React sets bits on `fiber.flags` using the bitwise OR operator (`|`):

```javascript
// Example: A new Fiber node that also has a ref and a useEffect
fiber.flags |= Placement; // Sets bit 2
fiber.flags |= Ref;       // Sets bit 11
fiber.flags |= Passive;   // Sets bit 14

```

### Checking Flags During Commit Sub-Phases

During the Commit Phase, React inspects `fiber.flags` using the bitwise AND operator (`&`):

```javascript
// 1. Fast Bailout Check
if (fiber.flags === NoFlags) {
  // Zero work to do on this Fiber! Skip to next node.
  return;
}

// 2. Sub-phase Execution Checks
if ((fiber.flags & Placement) !== NoFlags) {
  commitPlacement(fiber); // Append DOM node
}

if ((fiber.flags & Ref) !== NoFlags) {
  commitAttachRef(fiber); // Bind ref instance
}

if ((fiber.flags & Passive) !== NoFlags) {
  enqueuePassiveEffect(fiber); // Schedule useEffect
}

```

---

## 4. Why This Architecture Matters

* **Without Flags:** At commit time, React would have to perform expensive property inspections on every single Fiber node across the application tree—checking old props vs. new props, evaluating ref references, and inspecting effect arrays regardless of whether anything changed.
* **With Flags:** React checks **one integer**. If `flags === 0`, React skips the Fiber entirely. If `flags !== 0`, the bitwise mask dictates exact sub-phase execution with zero wasted checks.
