# Output: Closures retain only the variables actually referenced

```js
function makeLogger(hugeArray) {
  const summary = hugeArray.length;
  return function () {
    console.log("total items processed:", summary);
  };
}

const logFn = makeLogger(new Array(1_000_000).fill(0));
logFn();
```

**Answer:**
```
total items processed: 1000000
```

**Why:** The returned function only references `summary` (a plain number), not `hugeArray` itself. In modern V8, closures are optimized to retain only the variables actually referenced by the inner function, so `hugeArray` itself becomes eligible for garbage collection once `makeLogger` returns — even though both were declared in the same enclosing scope. This is an important nuance: closures don't necessarily retain *everything* in scope, only what's actually used.
