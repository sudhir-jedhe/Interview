# structuredClone performs a true deep clone (unlike spread)

```js
const original = { nested: { value: 1 } };
const clone = structuredClone(original);
clone.nested.value = 99;
console.log(original.nested.value, clone.nested.value);
// 1 99
```

A shallow copy (`{ ...original }`) would have left `clone.nested` pointing at the *same* nested object as `original.nested`, so mutating `clone.nested.value` would have also changed `original.nested.value`. `structuredClone` recursively clones nested structures, so the two objects are fully independent.
