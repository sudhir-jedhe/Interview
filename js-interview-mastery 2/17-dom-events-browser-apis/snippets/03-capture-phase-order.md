# Snippet: `capture: true` reverses the order relative to a bubble listener on an ancestor

*(Browser-only — run in a browser console on a real page.)*

```js
const outer = document.createElement("div");
const inner = document.createElement("span");
outer.append(inner);
document.body.append(outer);

outer.addEventListener("click", () => console.log("outer capture"), { capture: true });
inner.addEventListener("click", () => console.log("inner"));
inner.click();
// logs: "outer capture"  (capturing phase: outer -> inner, runs first)
// logs: "inner"          (target phase)
```
