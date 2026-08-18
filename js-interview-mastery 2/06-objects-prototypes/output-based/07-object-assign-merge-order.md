# Output: Object.assign merge order

```js
const a = { val: 1 };
const b = Object.assign({}, a, { val: 2 }, { extra: 3 });
console.log(a, b);
```

**Answer:** `{ val: 1 }` then `{ val: 2, extra: 3 }`

**Why:** `Object.assign` copies own enumerable properties from each source into the target (`{}` here) left to right, later sources overwriting earlier ones for the same key. `a` itself is never mutated because it's only used as a source, not the target.
