# finally always runs, even after a return in try

```js
function f() {
  try {
    return "try";
  } finally {
    console.log("cleanup");
  }
}
f();
// logs: "cleanup"
// returns: "try"
```

`finally` runs after `try`'s return value is computed but before the function actually hands control back to the caller.
