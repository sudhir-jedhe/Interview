# Arrow Functions and Lexical `this`

Arrow functions don't create their own `this` binding at all. Instead, `this` inside an arrow function is resolved by looking at the enclosing lexical scope — exactly like a normal variable lookup. This makes arrow functions immune to all four `this`-binding rules; you cannot change an arrow function's `this` with `call`, `apply`, `bind`, or by calling it as a method.

```js
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++; // `this` here is inherited from `start`'s `this`, i.e. `timer`
      console.log(this.seconds);
    }, 1000);
  }
};
timer.start(); // logs 1, 2, 3... correctly bound to `timer`
```

If `start` had used a regular `function` for the `setInterval` callback instead, `this` inside it would default to the global object (or `undefined` in strict mode), because the callback is invoked by the timer mechanism with no object context — a classic source of `this` bugs in callbacks and event handlers.

## Comparison table

| Aspect | Regular Function | Arrow Function |
|---|---|---|
| `this` source | Determined dynamically by how the function is called | Determined statically by where the function is defined (lexical scope) |
| Affected by `call`/`apply`/`bind`? | Yes | No — these have no effect on an arrow function's `this` |
| Affected by being a method vs standalone call? | Yes — changes `this` | No — always the same as the enclosing scope, regardless of how it's invoked |

Use regular functions for object methods, event handlers where you want `this` to be the element/caller, and anywhere `call`/`apply`/`bind` control is needed. Use arrow functions for nested callbacks inside methods where you want to keep referring to the outer `this`. The most common mistake is defining an object's methods as arrow functions (breaking `this`) or using a regular function for a nested callback inside a method (losing the outer `this` unintentionally).
