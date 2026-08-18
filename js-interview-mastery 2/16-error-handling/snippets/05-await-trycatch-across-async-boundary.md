# await lets try/catch work across an async boundary

```js
async function risky() {
  throw new Error("thrown inside async fn");
}

async function main() {
  try {
    await risky();
  } catch (e) {
    console.log("caught:", e.message);
  }
}
main();
// logs: "caught: thrown inside async fn"
```

Because `risky()` is `async`, its `throw` becomes a rejected promise rather than a synchronous exception; `await`-ing it inside `main`'s `try` block converts that rejection back into a catchable throw at the `await` line.
