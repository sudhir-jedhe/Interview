# Output: `innerHTML +=` reparses the whole subtree

```js
const div = document.createElement("div");
div.textContent = "before";
div.innerHTML += "<span>x</span>";
console.log(div.childNodes.length);
```

**Answer:**
```
2
```

**Why:** `div.innerHTML += "..."` reads the current `innerHTML` (`"before"`), concatenates the new markup, and reassigns it — which reparses the whole thing as HTML. The result is a text node `"before"` plus a `<span>` element node: two child nodes. (Note: this pattern also destroys any existing event listeners/state on prior children since they're all recreated from the markup string.)
