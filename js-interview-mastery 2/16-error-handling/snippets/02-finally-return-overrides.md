# finally with its own return silently overrides try/catch's return

```js
function g() {
  try {
    throw new Error("fail");
  } catch (e) {
    return "caught";
  } finally {
    return "overridden";
  }
}
console.log(g());
// "overridden" -- the error and the "caught" return are both discarded
```

A `return` inside `finally` takes precedence over any pending return value (or even a pending thrown error) from `try`/`catch` — this is almost always an unintentional bug.
