# Event Bubbling vs. Capturing

DOM events travel in three phases: **capturing** (from `window` down to the target), **target** (the element itself), then **bubbling** (back up from target to `window`). By default, `addEventListener(type, handler)` listens during the bubbling phase. Passing `{ capture: true }` (or `true` as the third argument) listens during the capturing phase instead.

```js
document.body.addEventListener("click", () => console.log("body (capture)"), { capture: true });
document.body.addEventListener("click", () => console.log("body (bubble)"));
// clicking a child inside body logs "body (capture)" before the child's own bubble handler,
// and "body (bubble)" after it
```

Most events bubble (`click`, `input`, `keydown`), but a few don't (`focus`, `blur`, `mouseenter`, `mouseleave` — though `focusin`/`focusout`/`mouseover`/`mouseout` are their bubbling equivalents).

## `event.target` vs `event.currentTarget`

`event.target` is the actual element that triggered the event (e.g., a `<span>` inside a `<li>`); `event.currentTarget` is the element the listener is attached to. This distinction is what makes event delegation possible (see `03-event-delegation.md`).

| Aspect | `event.target` | `event.currentTarget` |
|---|---|---|
| What it refers to | The element that originated the event | The element the listener is attached to |
| Changes during bubbling? | No — fixed at dispatch | No — fixed per listener invocation, but differs per listener |
| Use case | Event delegation (identify which child was interacted with) | Rarely needed directly; `this` inside a non-arrow handler equals it |

The common confusion is expecting `target` to change as an event bubbles — it doesn't; it's always the original element the event started on. `currentTarget` is what changes, because it reflects whichever element's listener is currently executing (and is only valid for the duration of that listener call — a saved reference to `event.currentTarget` used later, e.g. inside a `setTimeout`, will be `null`).
