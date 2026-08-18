# Output: `stopImmediatePropagation` blocks remaining same-element listeners

```js
const btn = document.createElement("button");
document.body.append(btn);
btn.addEventListener("click", () => console.log("first"));
btn.addEventListener("click", () => console.log("second"));
btn.addEventListener("click", function (e) {
  console.log("third");
  e.stopImmediatePropagation();
});
btn.addEventListener("click", () => console.log("fourth"));
btn.click();
```

**Answer:**
```
first
second
third
```

**Why:** Listeners on the same element/phase run in registration order. `stopImmediatePropagation()` called inside the third listener prevents any *remaining* listeners on that same element — including "fourth", registered after it — from running, in addition to stopping propagation to ancestors.
