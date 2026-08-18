# `var` in a Loop: All Returned Closures Share One Binding

```js
function createFunctions() {
  const fns = [];
  for (var i = 0; i < 3; i++) {
    fns.push(function() { return i; });
  }
  return fns;
}
const [f1, f2, f3] = createFunctions();
console.log(f1(), f2(), f3());
```

**Answer:** `3 3 3`

**Why:** All three functions close over the same `var i`, since `var` doesn't create a new binding per loop iteration — there's only one `i` in `createFunctions`'s scope. By the time any of the returned functions is called, the loop has already finished and `i` holds its final value, `3`.
