# Output: `event.target` vs `event.currentTarget` in a delegated handler

```js
const list = document.createElement("ul");
list.innerHTML = "<li id='a'>A</li>";
document.body.append(list);

list.addEventListener("click", (e) => {
  console.log("target:", e.target.tagName, "currentTarget:", e.currentTarget.tagName);
});

list.querySelector("li").click();
```

**Answer:**
```
target: LI currentTarget: UL
```

**Why:** `e.target` is always the element the event actually originated on — the `<li>` that was clicked. `e.currentTarget` is the element the listener is attached to — the `<ul>` — and only has that value while the handler is actively running (accessing it later, e.g. in a saved reference, would be `null`).
