# Output: apply with a non-array-like second argument

```js
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
const context = { name: 'Lee' };
console.log(greet.call(context, 'Hey'));
console.log(greet.apply(context, ['Hey']));
try {
  console.log(greet.apply(context, 'Hey'));
} catch (e) {
  console.log(e.constructor.name);
}
```

**Answer:** `'Hey, Lee'`, `'Hey, Lee'`, `'TypeError'`

**Why:** `call` and `apply` produce the same result when given equivalent arguments (`call` listed individually, `apply` as an array). But `apply`'s second argument must be `null`, `undefined`, or an object (an array or array-like) — internally it calls `CreateListFromArrayLike` on that argument, which requires an object type and throws `TypeError` for a primitive string like `'Hey'`. The fix would be wrapping it in an array: `greet.apply(context, ['Hey'])`.
