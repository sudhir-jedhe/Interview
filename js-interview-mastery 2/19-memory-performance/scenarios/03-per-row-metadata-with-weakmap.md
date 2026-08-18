# Scenario: Attaching per-element custom data without leaking on removal

**You're building a UI library that lets consumers attach arbitrary custom data to DOM elements it renders (e.g., a "state" object per row in a virtualized list). You don't want the library to leak memory if the consumer removes rows from the DOM without explicitly telling your library to clean up.**

**Approach:**
Use a `WeakMap` keyed by the DOM node instead of a regular `Map` or an expando property (`node.__myLibData = ...`, which is also leak-prone and pollutes the DOM API). Because `WeakMap` holds only a weak reference to the key, once the consumer removes the node and drops all other references to it, both the node and its associated metadata become eligible for garbage collection automatically — no manual cleanup API required.

```js
const rowState = new WeakMap();

function renderRow(item) {
  const el = document.createElement("div");
  rowState.set(el, { expanded: false, item });
  return el;
}

function toggleRow(el) {
  const state = rowState.get(el);
  state.expanded = !state.expanded;
  render(el, state);
}
// When a row's <div> is removed from the DOM and no other code holds a reference
// to it, it's collected along with its WeakMap entry automatically.
```

See `../problems/03-weakmap-metadata-cache.md` for a fuller implementation plus a side-by-side explanation of exactly why the equivalent `Map`-based version would leak.
