# Scenario Questions: Lists, Keys & Conditional Rendering

### Scenario 1: Drag-to-reorder task board loses per-card edit state

You're building a Kanban board where users can drag cards to reorder them within a column. QA reports: "If I open a card for inline editing, then drag a different card above it, the edit box appears to jump to the wrong card."

**Approach:** This is the classic index-as-key bug. The card list is almost certainly keyed by array index:

```jsx
// Buggy
{column.cards.map((card, index) => (
  <Card key={index} card={card} />
))}
```

When a card is dragged to a new position, the array order changes but the component at each index keeps its local `editing` state — so the state stays with the position, not the card. Fix by keying with the card's own stable id:

```jsx
{column.cards.map((card) => (
  <Card key={card.id} card={card} />
))}
```

Also verify the drag-reorder logic itself mutates a new array (`[...cards]` + splice, not in-place mutation) so React actually detects the array change and reconciles properly.

---

### Scenario 2: Product list badge shows "0" for out-of-stock items

You're building a product grid where each card shows a "X in cart" badge only if the user has added at least one unit. Support tickets say some products show a badge reading literally "0" even for items never added to the cart.

**Approach:** Find the render logic — it's almost certainly:

```jsx
{cartQuantity && <span className="badge">{cartQuantity} in cart</span>}
```

`cartQuantity` defaults to `0` for un-added items, and `0 && <span>` evaluates to `0`, which React renders as text. Fix by making the condition explicitly boolean:

```jsx
{cartQuantity > 0 && (
  <span className="badge">{cartQuantity} in cart</span>
)}
```

Add a quick regression test asserting the badge is absent (not present with text "0") when `cartQuantity` is `0`, since this bug is easy to reintroduce.

---

### Scenario 3: Search-filtered list causes checkboxes to "stick" to the wrong row

You're building a multi-select table with a search box that filters visible rows. Users report that after typing a search term, checking a box, then clearing the search, a *different* row than the one they checked appears checked.

**Approach:** The filtered rows are being rendered with index-based keys, so filtering (which changes which items occupy which index) reassigns each row's component instance — and its local checkbox state — to whatever item now lands at that index:

```jsx
// Buggy: filtering changes indices, state sticks to position
{filteredRows.map((row, i) => (
  <Row key={i} row={row} />
))}
```

The fix, as usual, is a stable key from the data, and — more importantly for this case — lifting "checked" state out of the row component entirely into a parent-level `Set` of selected IDs, so the checked state is tied to the row's identity rather than to any component instance:

```jsx
function Table({ rows }) {
  const [selected, setSelected] = useState(new Set());
  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              <input
                type="checkbox"
                checked={selected.has(row.id)}
                onChange={() => toggle(row.id)}
              />
            </td>
            <td>{row.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

This removes the class of bug entirely — selection state now lives in a data structure keyed by id, not in ephemeral per-instance component state.

---

### Scenario 4: Conditional rendering causes an expensive form to reset unexpectedly

You built a settings page where an "Advanced options" section toggles visibility with `{showAdvanced && <AdvancedForm />}`. Users complain that if they fill in advanced fields, collapse the section, then reopen it, all their input is lost.

**Approach:** Confirm the mental model with the team: `&&`/ternary conditional rendering unmounts the component, discarding all of its internal state. Two valid fixes depending on desired UX:

1. If the fields should reset each time (common for "advanced" sections that are rarely reopened), this is expected behavior — document it.
2. If input should persist, either lift the form state up to the parent (controlled inputs backed by parent state that survives the toggle) or keep the section mounted and hide it visually:

```jsx
<div style={{ display: showAdvanced ? 'block' : 'none' }}>
  <AdvancedForm />
</div>
```

Lifting state up is usually preferable to `display: none` because it keeps the DOM lean and makes the "source of truth" explicit, but `display: none` is faster to ship when the form is complex and you don't want to refactor its internal state management.
