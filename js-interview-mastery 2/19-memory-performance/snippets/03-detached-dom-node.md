# Snippet: Detached DOM node still referenced from JS — classic leak

*(Browser-only.)*

```js
let node = document.createElement("div");
document.body.append(node);
document.body.removeChild(node); // removed from the visible page
console.log(document.body.contains(node)); // false
console.log(node.textContent);              // still works -- node is fully alive in memory
node = null; // only now is it eligible for garbage collection
```
