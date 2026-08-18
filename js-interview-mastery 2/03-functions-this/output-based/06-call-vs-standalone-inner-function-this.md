# `this` Doesn't Propagate From an Outer Function's `.call()` to a Returned Inner Function

```js
function outer() {
  console.log(this);
  return function inner() {
    console.log(this);
  };
}
const innerFn = outer.call({ id: 'outer-context' });
innerFn();
```

**Answer:** `{ id: 'outer-context' }` then the global object (or `undefined` in strict mode)

**Why:** `outer.call({...})` explicitly sets `this` for `outer`'s execution. But `inner` is a regular function returned and then invoked standalone (`innerFn()`), which is a plain function call — it gets its own independent `this` binding via the default rule, completely unrelated to `outer`'s `this`. Functions don't "inherit" `this` from their enclosing function unless they're arrow functions.
