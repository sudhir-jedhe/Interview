# `async`/`await`

`async`/`await` is syntax sugar over promises: an `async function` always returns a promise, and `await` pauses execution of that function (without blocking the thread) until the awaited promise settles, then either returns the resolved value or throws the rejection reason.

```js
async function getInvoiceTotal(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    return orders.reduce((sum, o) => sum + o.total, 0);
  } catch (err) {
    console.error('failed to compute total:', err.message);
    throw err; // re-throw so callers know it failed
  }
}
```

`try`/`catch` around `await` is the direct equivalent of `.catch()` in the chain style — a rejected awaited promise throws synchronously (from the async function's perspective) at the `await` line.

## Callback-style vs. promise-style vs. `async`/`await`

| Aspect | Callbacks | Promises (`.then`) | `async`/`await` |
|---|---|---|---|
| Error handling | Manual, per-callback `(err, data)` checks | Centralized via `.catch()` | Standard `try`/`catch` |
| Composition (parallel/sequential) | Manual, error-prone nesting | Combinators (`Promise.all`, etc.) | Combinators + linear-looking code |
| Readability for sequential steps | Deeply nested ("callback hell") | Flatter, but chain can still get long | Reads like synchronous code |
| Return value | None (side-effect based) | A promise object | A promise (implicitly wrapped) |

`async`/`await` is generally preferred for its readability, but it's still built entirely on promises underneath — you still need `Promise.all` for genuine parallelism, and `.catch()`/`try-catch` are equivalent error-handling mechanisms, not alternatives. The common mistake is thinking `async`/`await` is a *replacement* for promises rather than sugar on top of them, leading to accidentally-sequential code when parallel execution was intended.

## `.catch()` vs. `try`/`catch` with `await`

| Aspect | `.catch()` | `try`/`catch` around `await` |
|---|---|---|
| Syntax style | Chained onto the promise | Wraps the `await` expression(s) |
| Scope of error handling | Only errors within the chain up to that point | Any synchronous or awaited error inside the `try` block |
| Mixing sync and async errors | Only catches promise rejections | Catches both a thrown synchronous error AND a rejected awaited promise, uniformly |

They're functionally equivalent for catching rejected promises, but `try`/`catch` is often preferable in `async` functions because it can also catch synchronous throws in the same block (e.g., a `JSON.parse` error alongside an `await fetch(...)` call) without needing separate handling paths. The common mistake is wrapping an `await` in `try`/`catch` but forgetting that a `.catch()` placed on a promise *before* it's awaited will swallow the rejection, causing the surrounding `try`/`catch` to never see an error at all (since the promise no longer rejects — it resolved to whatever `.catch()` returned).

## Two easy-to-miss facts

- An `async function` with no explicit `return` still returns a promise that resolves to `undefined`.
- A synchronous-looking `throw` inside an `async function` never propagates as a real synchronous exception — it's automatically converted into a rejected promise, observable only via `.catch()` or `await` inside `try`/`catch`.
