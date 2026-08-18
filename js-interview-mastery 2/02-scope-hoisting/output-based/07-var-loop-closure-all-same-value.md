# `var` Loop: All Closures Capture the Same Final Value

```js
const arr = [];
for (var i = 0; i < 3; i++) {
  arr.push(function() { return i; });
}
console.log(arr.map(fn => fn()));
```

**Answer:** `[3, 3, 3]`

**Why:** All three functions close over the same function-scoped `i` (because `var` doesn't create a new binding per iteration). By the time any of them is called, the loop has finished and `i` is `3`.
