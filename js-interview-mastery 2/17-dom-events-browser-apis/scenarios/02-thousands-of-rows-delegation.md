# Scenario: A table with thousands of rows, each with a "delete" button

**Attaching a click listener to every button causes noticeable memory/perf overhead and slow initial render. How do you fix this?**

**Approach:**
Use event delegation: attach a single click listener to the table (or `<tbody>`) and use `event.target.closest()` to identify whether a delete button was clicked and which row it belongs to. This also means new rows added dynamically (e.g., after pagination or an insert) work automatically without wiring up new listeners.

```js
const tbody = document.querySelector("tbody");

tbody.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest("button.delete");
  if (!deleteBtn) return;
  const row = deleteBtn.closest("tr");
  const id = row.dataset.id;
  deleteRow(id); // e.g., calls an API then removes the row from the DOM
  row.remove();
});
```

See `../problems/01-event-delegation-dynamic-list.md` for a fuller, self-contained implementation of this pattern.
