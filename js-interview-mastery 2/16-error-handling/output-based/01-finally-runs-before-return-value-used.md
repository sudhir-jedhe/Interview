```js
function a() {
  try {
    return 1;
  } finally {
    console.log("finally a");
  }
}
console.log(a());
```
**Answer:**
```
finally a
1
```
**Why:** `try` computes the return value `1` first, but before the function actually returns, `finally` runs to completion. Since `finally` has no `return` of its own, the original value (`1`) is used. The `console.log(a())` only logs after `a()` fully returns, so "finally a" logs first.
