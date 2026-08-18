# preventDefault vs stopPropagation vs stopImmediatePropagation

These solve three different problems and are frequently confused:

- `preventDefault()` stops the browser's **default action** for the event (following a link, submitting a form, checking a checkbox) — it does *not* stop propagation.
- `stopPropagation()` stops the event from continuing to **bubble/capture** to other elements — it does *not* prevent the default action.
- `stopImmediatePropagation()` does what `stopPropagation` does, *and* also prevents any other listeners registered on the **same element** for the same event from running.

```js
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading
  // form still bubbles up to any ancestor's submit listener unless stopPropagation is also called
});
```

## Comparison

| Aspect | `preventDefault()` | `stopPropagation()` | `stopImmediatePropagation()` |
|---|---|---|---|
| Stops default browser action | Yes | No | No (unless also called) |
| Stops event from reaching other elements | No | Yes | Yes |
| Stops other listeners on the *same* element | No | No | Yes |
| Typical use | Block form submit / link navigation | Prevent a parent's delegated handler from firing | Cancel a plugin/library's remaining handlers |

These are independent controls, not a spectrum — you often need both `preventDefault()` and `stopPropagation()` together (e.g., a custom dropdown item that shouldn't navigate *and* shouldn't trigger a parent "close on click" handler). The common mistake is calling only one and being confused why the "other" behavior still happens.

Note also that `dispatchEvent()` returns `false` if any listener called `preventDefault()` on a cancelable event, and `true` otherwise — useful for checking whether a programmatically-dispatched event was "cancelled" by a handler.
