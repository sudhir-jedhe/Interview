# Output: capture then target then bubble

```js
const parent = document.createElement("div");
const child = document.createElement("button");
parent.append(child);
document.body.append(parent);

parent.addEventListener("click", () => console.log("parent bubble"));
parent.addEventListener("click", () => console.log("parent capture"), true);
child.addEventListener("click", () => console.log("child"));

child.click();
```

**Answer:**
```
parent capture
child
parent bubble
```

**Why:** The event travels capturing phase first (window → ... → parent, since `capture: true` listeners fire on the way down), then hits the target (`child`), then bubbles back up, firing `parent`'s bubble-phase listener last.
