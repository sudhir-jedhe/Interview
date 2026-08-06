A **Fiber node** is a plain JavaScript object that represents a unit of work within React’s reconciliation engine.

While the virtual DOM element describes *what* the UI should look like, a Fiber node holds the underlying runtime state, component instances, pending updates, and structural relationships necessary to execute work incrementally.

Here is a breakdown of the internal structure and key properties of a Fiber node (defined in React source as `FiberNode`).

---

### 1. Identity & Type Identification

These properties define what kind of component or DOM element the Fiber node represents.

* **`tag` (WorkTag):** An integer (0–25) that identifies the type of Fiber node. React uses this for fast `switch` statements during `beginWork` and `completeWork`.
* `0`: `FunctionComponent`
* `1`: `ClassComponent`
* `3`: `HostRoot` (The root node of a React app tree)
* `5`: `HostComponent` (A native DOM element like `<div>`, `<span>`)
* `6`: `HostText` (A raw text node)
* `11`: `ForwardRef`
* `13`: `SuspenseComponent`

* **`type`:** The actual JavaScript function, class, or HTML tag string.
* For `<button>`, `type` is `'button'`.
* For `<UserProfile/>`, `type` is the function `UserProfile`.

* **`elementType`:** Usually identical to `type`, but differs in cases like `React.lazy` components or `React.memo` wrappers to preserve the underlying wrapped component identity.
* **`key`:** The unique string or number provided in lists (`key="item-1"`), used during reconciliation to match and reorder nodes rather than destroying and recreating them.

---

### 2. Fiber Tree Structural Pointers (The Triply Linked List)

Rather than storing children in a standard JavaScript array, React Fiber uses a **singly linked list structure** to enable $O(1)$ interruptible depth-first traversal without relying on the native call stack.

```text
               Parent Fiber (return)
                     ▲
                     │
               [child pointer]
                     │
                     ▼
  First Child Fiber ───[sibling pointer]───► Second Child Fiber

```

* **`child`:** A pointer pointing strictly to the **first immediate child** Fiber node.
* **`sibling`:** A pointer pointing to the **next adjacent sibling** Fiber node at the same hierarchical level.
* **`return`:** A pointer pointing to the **parent** Fiber node. This represents the node to which this Fiber returns after completing its work (acting as the virtual stack frame return address).

---

### 3. State and Props Management

These properties track input data, previous outputs, and Hook state across re-renders.

* **`pendingProps`:** The incoming props passed to the component for the current, active render pass.
* **`memoizedProps`:** The props used to render the component during the **last successfully committed render pass**.
* *How diffing works:* During `beginWork`, React compares `pendingProps === memoizedProps` (or uses `React.memo`). If equal and no state/context changed, React skips rendering the node.

* **`memoizedState`:** Holds the internal component state:
* For **Class Components**: Stores the plain state object (`this.state`).
* For **Function Components**: Stores a **singly linked list of Hook objects** (`useState`, `useReducer`, `useRef`, `useEffect`).
* For **Host Components (`<div>`)**: Stores internal DOM state or children instances.

* **`updateQueue`:** A queue holding pending state updates, effect lists, or callbacks waiting to be processed during the Render Phase.

---

### 4. DOM & Instance Binding

* **`stateNode`:** A reference to the local instance associated with this Fiber:
* For `HostComponent` (`<div>`): Points to the **real HTML DOM element** instance (`HTMLDivElement`).
* For `ClassComponent`: Points to the class component instance (`this`).
* For `FunctionComponent`: Always `null` (since functional components have no persistent instances).

---

### 5. Priority Scheduling & Subtree Tracking (`Lanes`)

React uses 32-bit bitmasks to manage priority lanes and skip clean subtrees.

* **`lanes` (Bitmask):** Represents the priority of pending work scheduled on **this specific Fiber node**.
* **`childLanes` (Bitmask):** Represents the aggregate of all pending lanes across **all descendant Fibers** in this component's subtree.
* *Optimization:* If `childLanes === 0`, React skips traversing into the children during reconciliation in $O(1)$ time.

---

### 6. Side-Effect Flags & Double Buffering

* **`flags` (formerly `effectTag`):** A bitmask indicating what mutation work needs to be performed on the live DOM at commit time (`Placement`, `Update`, `ChildDeletion`, `Ref`, `Passive`).
* **`subtreeFlags`:** Aggregates all descendant `flags` in the subtree, allowing React to skip entire un-mutated subtrees during the Commit Phase walk.
* **`alternate`:** The core pointer enabling **Double Buffering**:
* Every Fiber node can have up to two versions: the **`current`** Fiber (currently visible on screen) and the **`workInProgress`** Fiber (being constructed in memory).
* `current.alternate` points to `workInProgress`, and `workInProgress.alternate` points to `current`.

---

### Summary Property Table

| Property        | Data Type | Purpose                                                                |
| --------------- | --------- | ---------------------------------------------------------------------- |
| `tag`           | `number`  | Identifies node category (`FunctionComponent`, `HostComponent`, etc.). |
| `type`          | `any`     | Function, class, or DOM tag name (`'div'`).                            |
| `return`        | `Fiber    | null`                                                                  | Pointer to parent Fiber node (virtual stack frame).  |
| `child`         | `Fiber    | null`                                                                  | Pointer to first child Fiber node.                   |
| `sibling`       | `Fiber    | null`                                                                  | Pointer to next sibling Fiber node.                  |
| `pendingProps`  | `object`  | Props being applied in the current render.                             |
| `memoizedProps` | `object`  | Props committed in the previous render.                                |
| `memoizedState` | `any`     | Linked list of Hooks (Functions) or state object (Classes).            |
| `stateNode`     | `any`     | Live DOM element or Class instance.                                    |
| `alternate`     | `Fiber    | null`                                                                  | Mirror Fiber node used for double-buffering updates. |
