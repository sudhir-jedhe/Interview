# `typeof` on a Function Declared Later in the Same Scope

```js
function outer() {
  console.log(typeof inner);
  function inner() {}
}
outer();
```

**Answer:** `'function'`

**Why:** Function declarations are hoisted completely — both their name and body — to the top of the enclosing scope, before any code executes. So `inner` is already a fully-defined function by the time `typeof inner` runs, regardless of where the declaration appears in the source.
