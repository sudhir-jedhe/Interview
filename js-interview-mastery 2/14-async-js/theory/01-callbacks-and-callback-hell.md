# Callbacks and "Callback Hell"

The earliest async pattern is passing a function to be invoked later, once an operation finishes:

```js
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getInvoice(orders[0].id, (invoice) => {
      console.log(invoice);
    });
  });
});
```

Nesting callbacks like this ("callback hell" or "pyramid of doom") makes error handling inconsistent (each level needs its own error check), control flow hard to follow, and composition (running things in parallel, racing them) awkward to hand-roll. Promises were introduced specifically to fix this.

## What specifically is wrong with it

- **Error handling**: the Node convention is an `(err, data)` first argument, and every single nesting level must remember to check `err` — forgetting even one lets an error vanish silently.
- **Composition**: running two independent callback-based operations in parallel and waiting for both requires manually tracking completion counts; there's no built-in combinator.
- **Readability**: the indentation grows with each dependent step, and the logical order of operations (top to bottom) gets buried in nested closures.

Promises fix all three: a formal error channel (rejection) that propagates automatically, built-in combinators (`Promise.all`, etc.), and flat `.then()` chaining instead of nesting.
