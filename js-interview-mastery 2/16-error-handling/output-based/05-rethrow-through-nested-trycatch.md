```js
function outer() {
  try {
    inner();
  } catch (e) {
    console.log("outer caught:", e.message);
  }
}
function inner() {
  try {
    throw new Error("deep");
  } catch (e) {
    console.log("inner caught, rethrowing");
    throw e;
  }
}
outer();
```
**Answer:**
```
inner caught, rethrowing
outer caught: deep
```
**Why:** `inner`'s `catch` runs and logs, then rethrows the same error object. Because the throw happens synchronously and `inner()` is called from within `outer`'s `try`, the rethrown error propagates up the still-active call stack and is caught by `outer`'s `catch`.
