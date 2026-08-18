# Output: Object destructuring `length` off an array

```js
let { length } = [1, 2, 3];
console.log(length);
```

**Answer:** `3`

**Why:** Object destructuring reads properties by name, and arrays are objects with a `length` property. `{ length }` is shorthand for `{ length: length }`, pulling the array's own `length` property — this works even though `[1, 2, 3]` is being destructured with object syntax, not array syntax.
