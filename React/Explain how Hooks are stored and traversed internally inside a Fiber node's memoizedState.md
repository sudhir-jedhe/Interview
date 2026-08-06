In React, function components do not have class instances (`this`) to store instance properties across re-renders. Instead, React attaches all hook state directly to the component's **Fiber node**.

Internally, React manages hooks using a **singly-linked list** attached to the `memoizedState` property of the Fiber node.

---

## 1. The Internal Hook Object Structure

When you call any Hook (`useState`, `useEffect`, `useRef`, `useCallback`, etc.) inside a function component, React instantiates or retrieves a plain JavaScript **`Hook` object**.

```typescript
// Simplified representation of React's internal Hook object
type Hook = {
  memoizedState: any,       // The actual state/value stored by this hook
  baseState: any,          // The base state used for batching updates
  baseQueue: Update | null,// Pending updates prioritized from prior renders
  queue: UpdateQueue | null,// Queue of pending state updates (dispatch actions)
  next: Hook | null,       // Pointer to the NEXT hook in the linked list
};

```

Notice the **`next`** pointer: this is what forms the linked list of hooks for a single component.

---

## 2. Linked List Architecture on a Fiber Node

Every Fiber node representing a function component maintains a pointer named **`memoizedState`**.

Unlike a Class Component Fiber where `memoizedState` holds a single plain state object (e.g., `{ count: 0 }`), for a Function Component Fiber, `memoizedState` points directly to the **first `Hook` object in the linked list**.

### Conceptual Memory Map

Consider this component:

```jsx
function UserProfile() {
  const [name, setName] = useState("Alice");    // Hook 1 (useState)
  const [count, setCount] = useState(0);        // Hook 2 (useState)
  useEffect(() => { /* ... */ }, []);           // Hook 3 (useEffect)
  const inputRef = useRef(null);               // Hook 4 (useRef)

  return <div>{name}</div>;
}

```

In memory, React attaches the hooks to the `UserProfile` Fiber node like this:

```text
UserProfile Fiber Node
┌─────────────────────────────────────────┐
│ type: UserProfile                       │
│ stateNode: null                         │
│ memoizedState ────────────────────────┐ │
└───────────────────────────────────────┼─┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ Hook 1 (useState)     │
                            │ ───────────────────── │
                            │ memoizedState: "Alice"│
                            │ next ─────────────────┼──┐
                            └───────────────────────┘  │
                                                       │
                                ┌──────────────────────┘
                                ▼
                            ┌───────────────────────┐
                            │ Hook 2 (useState)     │
                            │ ───────────────────── │
                            │ memoizedState: 0      │
                            │ next ─────────────────┼──┐
                            └───────────────────────┘  │
                                                       │
                                ┌──────────────────────┘
                                ▼
                            ┌───────────────────────┐
                            │ Hook 3 (useEffect)    │
                            │ ───────────────────── │
                            │ memoizedState: Effect │
                            │ next ─────────────────┼──┐
                            └───────────────────────┘  │
                                                       │
                                ┌──────────────────────┘
                                ▼
                            ┌───────────────────────┐
                            │ Hook 4 (useRef)       │
                            │ ───────────────────── │
                            │ memoizedState: {cur..}│
                            │ next: null            │
                            └───────────────────────┘

```

---

## 3. How Different Hooks Use `memoizedState`

While every hook uses the exact same `Hook` object structure, what they store inside `hook.memoizedState` varies by hook type:

| Hook Type                     | What is stored in `hook.memoizedState`?                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| **`useState(initial)`**       | The calculated state value (e.g., `"Alice"` or `0`).                                    |
| **`useReducer(reducer)`**     | The calculated state value resulting from dispatched actions.                           |
| **`useRef(initial)`**         | The ref object: `{ current: initialValue }`.                                            |
| **`useMemo(fn, deps)`**       | A tuple containing the cached value and dependencies: `[value, deps]`.                  |
| **`useCallback(fn, deps)`**   | A tuple containing the cached function and dependencies: `[fn, deps]`.                  |
| **`useEffect(create, deps)`** | An `Effect` circular linked list node containing `create`, `destroy`, `deps`, and tags. |

---

## 4. Traversing the Hooks List: Mount vs. Update Phase

React maintains two internal pointers during rendering to manage traversal:

1. **`workInProgressHook`:** Points to the hook currently being processed in the active render.
2. **`currentHook`:** Points to the corresponding hook in the `current` (screen) Fiber node.

React uses two different dispatcher object implementations depending on whether the component is mounting or updating: **`HooksDispatcherOnMount`** vs. **`HooksDispatcherOnUpdate`**.

### Phase A: Mounting Phase (`HooksDispatcherOnMount`)

During the initial render, hooks do not exist yet. React creates them sequentially as it encounters each hook call:

```javascript
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // This is the FIRST hook call in the component
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the existing linked list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

```

### Phase B: Updating Phase (`HooksDispatcherOnUpdate`)

During a re-render, React **does not create new hook objects**. Instead, it traverses the existing linked list created during mount:

```javascript
function updateWorkInProgressHook() {
  let nextCurrentHook;
  
  if (currentHook === null) {
    // First hook call during update: start at Fiber.memoizedState
    const current = currentlyRenderingFiber.alternate;
    nextCurrentHook = current.memoizedState;
  } else {
    // Move to the NEXT node in the existing linked list
    nextCurrentHook = currentHook.next;
  }

  currentHook = nextCurrentHook;

  // Clone the current hook into a new work-in-progress hook
  const newHook = {
    memoizedState: currentHook.memoizedState,
    baseState: currentHook.baseState,
    baseQueue: currentHook.baseQueue,
    queue: currentHook.queue,
    next: null,
  };

  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
  } else {
    workInProgressHook = workInProgressHook.next = newHook;
  }

  return workInProgressHook;
}

```

---

## 5. Why "Rules of Hooks" Exist (The "Order Matters" Rule)

Understanding this linked list structure explains the core Rule of Hooks:

> **"Do not call Hooks inside loops, conditions, or nested functions."**

Because hooks are stored in a **singly-linked list without keys**, React identifies which hook state belongs to which call strictly by **traversal order**.

### What happens if you call a Hook inside a conditional?

```jsx
function BadComponent({ isEditing }) {
  // Mount Order:
  // Hook 1: useState("Alice")
  // Hook 2: (If true) useState(0)
  // Hook 3: useEffect()

  const [name, setName] = useState("Alice"); // Hook 1

  if (isEditing) {
    const [age, setAge] = useState(0);       // Hook 2 (CONDITIONAL!)
  }

  useEffect(() => {}, []);                  // Hook 3
}

```

1. **Mount Render (`isEditing = true`):**

* Link 1 $\rightarrow$ `name` (`"Alice"`)
* Link 2 $\rightarrow$ `age` (`0`)
* Link 3 $\rightarrow$ `useEffect`

1. **Re-render (`isEditing = false`):**

* Call 1: `useState("Alice")` $\rightarrow$ React reads Link 1 (`"Alice"`). Correct!
* Call 2: `useEffect()` $\rightarrow$ React advances `currentHook.next` to **Link 2** (which was `age = 0`!).
* **Result:** React tries to process an Effect hook payload using a State hook object. The order is misaligned, causing state corruption, type errors, or crashes (`"Rendered fewer hooks than expected"`).

---

## Summary

* A Fiber node's **`memoizedState`** points to the head of a **singly-linked list of `Hook` objects**.
* Each `Hook` object contains its own value/state, queue of updates, and a **`next`** pointer to the subsequent hook.
* React traverses this list sequentially using **`currentHook = currentHook.next`** on every re-render.
* The absence of keys in this linked list is why **call order must remain 100% identical across every render**.
