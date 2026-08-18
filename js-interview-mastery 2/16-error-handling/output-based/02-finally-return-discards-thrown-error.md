```js
function b() {
  try {
    throw new Error("x");
  } finally {
    return "rescued";
  }
}
console.log(b());
```
**Answer:**
```
rescued
```
**Why:** A `return` inside `finally` overrides everything — including a pending thrown error. The exception from `try` is discarded entirely; it never propagates because `finally`'s control-flow statement (`return`) takes precedence.
