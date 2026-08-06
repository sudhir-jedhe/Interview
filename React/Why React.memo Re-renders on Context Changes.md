Here is a clean, structured technical breakdown explaining why `React.memo` does not prevent re-renders when consumed Context changes, and how `lanes` and `childLanes` propagate this work through the Fiber tree.

---

# Why `React.memo` Re-renders on Context Changes: `lanes` vs. `childLanes`

`React.memo` performs a shallow comparison of a component's **props**. If the props haven't changed, `React.memo` attempts to bail out of rendering.

However, **`React.memo` does not protect against React Context updates or local state changes.** When `useContext(ThemeContext)` receives a new value, React bypasses prop memoization entirely.

---

## 1. The Fiber Reconciliation Breakdown

When the user clicks the "Toggle Theme" button in the image:

```text
 1. App State Update (setTheme)
    └─► App Fiber marked with render Lane
             │
             ▼
 2. Context Provider Value Shift
    └─► ThemeContext.Provider detects value change ('light' -> 'dark')
    └─► React scans downstream fibers for context consumers
    └─► Marks Child Fiber.lanes |= RenderLane
    └─► Bubbles priority UPWARD: Parent Fiber.childLanes |= RenderLane
             │
             ▼
 3. BeginWork Render Pass
    ├─► App: Re-renders (state changed)
    ├─► Parent: BAILS OUT (props unchanged, lanes === 0)
    │     └─► BUT checks childLanes !== 0 ──► Must traverse down to child!
    └─► Child: React.memo shallow check runs
          └─► Sees Child.lanes !== 0 (Context Update Pending!)
          └─► BAILOUT DENIED ──► Child Re-renders!

```

---

## 2. How `lanes` and `childLanes` Propagate Upward

React uses bitfield bitmasks on Fiber nodes to track scheduled updates:

* **`fiber.lanes`**: Stores pending work scheduled on **this specific Fiber node**.
* **`fiber.childLanes`**: Stores pending work scheduled on **any descendant Fiber node** beneath this node.

### The Upward Propagation Step

When `setTheme` updates the context value, React scans the fiber tree starting from the `<ThemeContext.Provider>`:

1. It finds `<Child/>`, which relies on `ThemeContext` via `useContext`.
2. It sets the active update lane on `<Child/>`:

$$\text{Child.lanes} \mid= \text{UpdateLane}$$

1. It bubbles that bitmask upward through all parent nodes so the scheduler knows a child needs attention:

$$\text{Parent.childLanes} \mid= \text{UpdateLane}$$

$$\text{App.childLanes} \mid= \text{UpdateLane}$$

---

## 3. Why `Parent` Bails Out But `Child` Still Renders

During the top-down `beginWork` render pass:

1. **`Parent` Component Evaluation:**

* `Parent.lanes` is `0` (it has no state updates or context subscriptions).
* React checks if `Parent`'s props changed (they didn't).
* **Bailout Decision:** React skips rendering `<Parent/>`'s logic.
* **Subtree Check:** React checks `Parent.childLanes`. Because `Parent.childLanes !== 0`, React knows a child needs rendering, so it proceeds down to inspect `<Child/>`.

1. **`Child` Component Evaluation (`React.memo`):**

* React checks `Child.lanes`. Because `Child.lanes !== 0` (due to the Context change), **React invalidates the memoization bailout**.
* React executes `Child()`, calling `useContext(ThemeContext)` to read `'dark'`, and logs `'Child rendered'`.

---

## 4. Key Takeaways & Architecture Strategies

| Optimization API              | What It Protects Against                        | What It Ignores (Forces Re-render)                               |
| ----------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| **`React.memo`**              | Parent re-renders & prop changes                | Internal `useState`, `useReducer`, and **`useContext` updates**  |
| **`useMemo` / `useCallback**` | Expensive inline calculations / identity shifts | Does not stop rendering if the component containing them updates |

### How to prevent context-driven re-renders

1. **Split Contexts:** Separate frequently changing context values (e.g., theme, active cursor) from static context values.
2. **Context Selectors:** Use state management libraries that support fine-grained selectors (e.g., `Zustand`, `Jotai`, or `use-context-selector`) so components subscribe only to specific slices of state rather than the whole context object.
3. **Component Structure:** Move context consumers down to the leaf nodes of the component tree so re-renders are localized.
