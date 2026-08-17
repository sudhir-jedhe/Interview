# Output-Based Questions: Design Patterns & Anti-Patterns

### 1. Does the list re-render with the new item?
```jsx
function List() {
  const [items, setItems] = useState(["a", "b"]);

  function addItem() {
    items.push("c");
    setItems(items);
  }

  return (
    <div>
      <button onClick={addItem}>add</button>
      <ul>{items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
    </div>
  );
}
```
**Answer:** No visible re-render — the DOM does not show "c" after clicking, even though `items` has actually been mutated to `["a", "b", "c"]` internally.

**Why:** `setItems(items)` passes the exact same array reference back to React. React's `useState` setter bails out of re-rendering when the new value is reference-equal (`Object.is`) to the current state for primitives, and while objects/arrays don't get deep-compared, React's scheduling here still may not trigger a re-render reliably since nothing signals a change — in practice this is undefined/fragile behavior that depends on React internals, which is exactly why mutating state directly is an anti-pattern: correctness shouldn't hinge on implementation details.

---

### 2. After deleting the first item, what does each remaining input show?
```jsx
function EditableList() {
  const [items, setItems] = useState(["Alice", "Bob", "Carol"]);

  function remove(indexToRemove) {
    setItems(items.filter((_, i) => i !== indexToRemove));
  }

  return items.map((name, i) => (
    <div key={i}>
      <input defaultValue={name} />
      <button onClick={() => remove(i)}>remove</button>
    </div>
  ));
}
// User types "ALICE!" into the first input, then clicks "remove" on the first row.
```
**Answer:** After removing the first row, the remaining visible input (originally showing "Bob") displays "ALICE!" instead of "Bob".

**Why:** With `key={i}` (index), when "Alice"'s row is removed, React reuses the DOM node that used to be `key={0}` for what is now Bob's row at index 0 — but `defaultValue` only sets the initial value on mount, and since React thinks it's the same component instance (same key), it doesn't remount the `<input>`, so the stale typed text "ALICE!" stays attached to the reused DOM node. This is the canonical index-key bug with uncontrolled inputs in a list.

---

### 3. Does this cause an infinite render loop?
```jsx
function Profile({ firstName, lastName }) {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  });

  return <p>{fullName}</p>;
}
```
**Answer:** No infinite loop, but it does two renders where one would do: mount renders with `fullName = ""`, the effect then sets it to `"firstName lastName"` causing a second render; on that second render the effect fires again (no dependency array means it runs after every render) but computes the same string, and since `Object.is` sees no change, React bails out and no third render happens.

**Why:** It "works" but wastes a render and briefly displays an empty/wrong `fullName` on first paint — a real UX bug (visible flash) even though it's not an infinite loop. Computing `fullName` directly during render (`const fullName = \`${firstName} ${lastName}\`;`) avoids the effect, the extra render, and the flash entirely — this is the textbook case for deriving during render instead of syncing state via an effect.

---

### 4. What does the "container" component actually control here, and is it necessary?
```jsx
function UserListContainer() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  return <UserListView users={users} />;
}

function UserListView({ users }) {
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```
**Answer:** It renders the same UI as if the fetching logic were just inlined into a single component using a custom hook — nothing about this specific split changes behavior or output.

**Why:** This is a valid container/presentational split, but with hooks available, the same separation of concerns is usually achieved with `const users = useUsers()` inside one component, without a forced two-component hierarchy. It's not wrong, just no longer the default idiom — worth recognizing as "correct but dated" rather than broken.

---

### 5. What renders when `status` is an unexpected value like `"unknown"`?
```jsx
function StatusBadge({ status }) {
  return status === "active" ? (
    <span className="green">Active</span>
  ) : status === "pending" ? (
    <span className="yellow">Pending</span>
  ) : (
    <span className="red">Inactive</span>
  );
}
```
**Answer:** It renders `<span className="red">Inactive</span>` for `status="unknown"`.

**Why:** The nested ternary's final `else` branch is a catch-all for anything that isn't `"active"` or `"pending"`, silently mislabeling an unrecognized status as "Inactive" rather than surfacing that it's an unexpected value — a symptom of nested ternaries hiding logic gaps that an explicit `switch` or lookup table with a clear default would make more visible.

---

### 6. Does clicking "Add" cause the sibling `Timer` to reset?
```jsx
function App() {
  const [items, setItems] = useState([]);
  return (
    <div>
      <Timer />
      <button onClick={() => setItems([...items, "x"])}>Add</button>
      <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{seconds}</p>;
}
```
**Answer:** No, `Timer` does not reset — it keeps counting across `Add` clicks.

**Why:** `Timer`'s position in the tree and its type stay the same across re-renders of `App`, so React preserves its component instance and state; the `items` list re-rendering (even with fragile index keys) doesn't remount unrelated siblings. This question is a contrast case: index keys are a real problem specifically for *reordering/removing items within* a keyed list, not for arbitrary state elsewhere in the tree.
