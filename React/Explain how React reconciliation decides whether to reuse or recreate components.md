React’s **reconciliation** algorithm (often called the "Diffing" algorithm) determines how React updates the real DOM when state or props change.

To keep performance fast, React relies on a $O(n)$ heuristic algorithm based on two fundamental assumptions to decide whether to **reuse** an existing component instance or **destroy and recreate** it from scratch.

---

## The Two Core Rules of Reconciliation

### Rule 1: Component Type Matching

If two elements at the same position in the tree have **different component types**, React completely unmounts and recreates the entire sub-tree.

* **Different Types (Recreate):** When changing from `<a>` to `<div>`, or from `<Header>` to `<Sidebar>`, React tears down the old tree and builds the new one from scratch.
* **Same Type (Reuse):** When two elements at the same tree location have the **same component type**, React keeps the underlying component instance and DOM node, and only updates the changed props/attributes.

```tsx
// Scenario A: Changing types (RECREATES)
// Old:
<div className="card"><UserCard /></div>
// New:
<section className="card"><UserCard /></section> 
// ➡️ The <div> is destroyed and <section> is created. 
// <UserCard> and ALL its internal state are completely unmounted and reset!

// Scenario B: Same type (REUSES)
// Old:
<div className="card red" />
// New:
<div className="card blue" />
// ➡️ The <div> DOM node is preserved! React only updates the class attribute.

```

---

## Rule 2: Keys Drive List Identity

When rendering dynamic lists of components, React relies on the **`key` prop** to track identity across renders.

Without keys, React falls back to mutating list items sequentially based on their array index. With unique keys, React can match elements before and after a render pass, allowing it to **reorder, insert, or remove** elements efficiently.

### Example: Inserting an item at the beginning of a list

```tsx
// ❌ WITHOUT KEYS (Index-based implicit matching):
// Old List: [ <Item text="A" />, <Item text="B" /> ]
// New List: [ <Item text="NEW" />, <Item text="A" />, <Item text="B" /> ]

```

1. React compares Position 0: `Item A` vs `Item NEW` → Type matches, so React **mutates** `Item A` to become `Item NEW`.
2. React compares Position 1: `Item B` vs `Item A` → React **mutates** `Item B` to become `Item A`.
3. Position 2: React creates a new `Item B`.

* **Result:** Every component in the list is mutated and forced to re-render!

```tsx
// ✅ WITH KEYS:
// Old List: [ <Item key="a" />, <Item key="b" /> ]
// New List: [ <Item key="new" />, <Item key="a" />, <Item key="b" /> ]

```

1. React matches `key="new"` → Creates the new component.
2. React matches `key="a"` and `key="b"` → **Reuses** existing instances without re-mounting them.

---

## The Hidden Trap: Declaring Components Inside Components

One of the most common reconciliation bugs occurs when developers declare a component function *inside* another component function:

```tsx
// ❌ DANGEROUS ANTI-PATTERN:
function Parent() {
  const [count, setCount] = useState(0);

  // Nested definition!
  function ChildInput() {
    return <input type="text" />;
  }

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildInput />
    </div>
  );
}

```

### Why this breaks reconciliation

Every time `Parent` re-renders, JavaScript creates a **new function reference** for `ChildInput`.

During reconciliation, React compares the old component type (`ChildInput_v1`) to the new type (`ChildInput_v2`). Because their function references do not match in memory, React treats them as **different types** (Rule 1).

* **The Consequences:** `ChildInput` is completely unmounted and recreated on **every single parent state change**. The user loses text focus, input values reset, and performance degrades.

### The Fix

Always declare components at the top-level module scope so their function reference remains stable across renders:

```tsx
// ✅ GOOD: Stable function reference at top-level
function ChildInput() {
  return <input type="text" />;
}

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildInput />
    </div>
  );
}

```

---

## Resetting State Intentionally Using Keys

You can use React's reconciliation rules to your advantage. If you want to force a component to reset its internal state completely, change its `key` prop:

```tsx
function UserEditor({ userId }: { userId: string }) {
  // Changing `key={userId}` forces React to tear down the old editor instance 
  // and instantiate a fresh one, resetting all internal form state automatically!
  return <ProfileForm key={userId} userId={userId} />;
}

```

---

## Summary Decision Matrix

| Trigger                          | Component Type                        | `key` Prop            | React's Action                                           |
| -------------------------------- | ------------------------------------- | --------------------- | -------------------------------------------------------- |
| Props / State change             | **Same**                              | Unchanged             | **REUSE** instance & DOM node; update props.             |
| Tag / Component changes          | **Different** (`<div>` ➔ `<section>`) | N/A                   | **RECREATE** (Unmount old tree, mount new tree).         |
| List reordered                   | Same                                  | **Same unique keys**  | **REUSE** instances; move DOM nodes to match.            |
| Key changes                      | Same                                  | **Key value changes** | **RECREATE** (Destroy old instance, mount new instance). |
| Component declared inside render | **New Function Ref**                  | N/A                   | **RECREATE** on every single render.                     |
