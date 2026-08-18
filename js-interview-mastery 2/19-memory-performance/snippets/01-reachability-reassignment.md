# Snippet: Reachability — reassigning removes the last reference, making an object collectible

```js
let user = { name: "Ana" };
let alias = user; // second reference to the same object
user = null;
console.log(alias.name); // "Ana" -- still reachable via `alias`
alias = null; // NOW nothing references the object; it becomes eligible for GC
```
