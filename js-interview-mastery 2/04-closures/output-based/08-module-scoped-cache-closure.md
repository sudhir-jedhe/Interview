# A Function Closing Over a Module-Scoped (Not Local) Variable

```js
let cache;
function getData() {
  if (cache) return cache;
  cache = { value: Math.random() };
  return cache;
}
console.log(getData() === getData());
```

**Answer:** `true`

**Why:** This isn't a closure over a local variable — `cache` is declared outside `getData` in the enclosing (module/global) scope, so `getData` closes over that shared `cache`. The first call computes and stores an object in `cache`; every subsequent call returns that exact same cached object reference, so the two calls in the comparison return the identical object, making `===` true.
