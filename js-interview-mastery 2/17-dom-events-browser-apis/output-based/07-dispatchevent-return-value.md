# Output: `dispatchEvent` return value reflects whether `preventDefault` was called

```js
const form = document.createElement("form");
document.body.append(form);
let clicked = false;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clicked = true;
});
const evt = new Event("submit", { cancelable: true });
const wasNotCancelled = form.dispatchEvent(evt);
console.log(clicked, wasNotCancelled);
```

**Answer:**
```
true false
```

**Why:** `dispatchEvent` returns `false` if any listener called `preventDefault()` on a cancelable event (and the event was created with `cancelable: true`), and `true` otherwise. `clicked` is `true` because the listener ran and set it; the return value reflects that the default action was prevented, which is the opposite of what "was not cancelled" might intuitively suggest.
