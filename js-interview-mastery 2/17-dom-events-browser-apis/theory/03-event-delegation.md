# Event Delegation

Because events bubble, you can attach **one** listener to a common ancestor instead of one listener per child, and inspect `event.target` to figure out which child was actually interacted with. This is more memory-efficient and automatically works for children added later.

```js
// Instead of adding a click listener to every <li>...
document.querySelector("ul#todo-list").addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (!item) return; // click didn't land on/inside an <li>
  console.log("clicked:", item.textContent);
});
```

`closest()` walks up from `target` to find the nearest matching ancestor, which is what makes delegation robust to nested markup — e.g., clicking on a `<span>` or `<b>` inside the `<li>` still resolves to the `<li>` correctly.

Why this matters in practice: for a table or list with thousands of rows, attaching an individual listener to every row's button is a real memory and setup-time cost, and every dynamically-added row needs its own new listener wired up. A single delegated listener on the parent avoids both problems entirely — see `../problems/01-event-delegation-dynamic-list.md` for a full worked implementation.
