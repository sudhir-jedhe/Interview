# Output: Independent IIFE closures

```js
const Counter = (function () {
  let count = 0;
  return {
    inc: () => ++count,
  };
})();

const Counter2 = (function () {
  let count = 0;
  return {
    inc: () => ++count,
  };
})();

console.log(Counter.inc());
console.log(Counter.inc());
console.log(Counter2.inc());
```

**Answer:**
```
1
2
1
```

**Why:** Each IIFE invocation creates its own independent closure over its own `count` variable. `Counter` and `Counter2` are separate module instances with separate private state, so calling `inc` on one has no effect on the other's counter.
