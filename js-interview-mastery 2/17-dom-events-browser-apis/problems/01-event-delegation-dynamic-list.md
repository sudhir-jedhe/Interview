# Problem: Event delegation for a dynamic list

**Task:** Build a `<ul>`-based list where items can be added and removed at runtime, using exactly **one** click listener on the parent `<ul>` to handle clicks on any item (add-button, delete-button, or the item text itself) — including items added after the listener was attached.

## Requirements

- One listener, attached once, on the parent container.
- Clicking a "Delete" button inside an item removes that item.
- Clicking "Add item" appends a new item that is immediately clickable/deletable, with no new listener wiring.
- Use `event.target.closest()` to resolve which actual control was clicked, not just which element.

## Full solution

```html
<ul id="todo-list"></ul>
<button id="add-btn">Add item</button>
```

```js
const list = document.getElementById("todo-list");
const addBtn = document.getElementById("add-btn");
let nextId = 1;

function createItem(text) {
  const li = document.createElement("li");
  li.dataset.id = nextId++;

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";

  li.append(span, deleteBtn);
  return li;
}

// ONE listener on the parent handles clicks for every item, present or future.
list.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (!deleteBtn) return; // click landed somewhere else in the <li>, ignore

  const li = deleteBtn.closest("li");
  li.remove();
  console.log("removed item:", li.dataset.id);
});

addBtn.addEventListener("click", () => {
  const item = createItem(`Item ${nextId}`);
  list.append(item); // works immediately with the delegated listener above
});

// Seed a few items:
list.append(createItem("First item"), createItem("Second item"));
```

## Why this works

Because clicks bubble from the `<button>`/`<span>` up through the `<li>` to the `<ul>`, a single listener on `<ul>` sees every click that happens anywhere inside it. `event.target` tells us the actual element clicked; `.closest(".delete-btn")` walks up from there to find the nearest matching ancestor (or the button itself), returning `null` if the click didn't involve a delete button at all — e.g., clicking the item's text does nothing, but clicking Delete removes it.

No listener is ever attached to an individual `<li>` or `<button>`, so adding a thousand items still costs one listener, and removing items never leaks a per-item listener reference either.
