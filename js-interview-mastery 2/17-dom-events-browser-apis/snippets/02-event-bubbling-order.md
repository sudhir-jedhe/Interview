# Snippet: Event bubbling order

*(Browser-only — run in a browser console on a real page.)*

Target's own listeners fire first, then ancestors, in bubble order:

```js
const outer = document.createElement("div");
const inner = document.createElement("span");
outer.append(inner);
document.body.append(outer);

outer.addEventListener("click", () => console.log("outer"));
inner.addEventListener("click", () => console.log("inner"));

inner.click(); // simulate a click on the inner span
// logs: "inner"
// logs: "outer"
```
