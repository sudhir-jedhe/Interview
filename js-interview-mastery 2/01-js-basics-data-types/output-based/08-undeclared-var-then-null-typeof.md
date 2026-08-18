# `typeof` on an Unassigned Variable, Then After Assigning `null`

```js
let count;
console.log(count);
console.log(typeof count);
count = null;
console.log(typeof count);
```

**Answer:** `undefined`, `'undefined'`, `'object'`

**Why:** A declared-but-unassigned variable is `undefined` by default, and `typeof` on it reports `'undefined'`. Once explicitly assigned `null`, `typeof` reports `'object'` — the historical `typeof null` bug — even though semantically `count` still holds "no value."
