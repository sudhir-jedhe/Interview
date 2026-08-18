# Snippet: Array.from converting an array-like

```js
function collectArgs() { return Array.from(arguments); }
console.log(collectArgs(1, 2, 3)); // [1, 2, 3]

const withMap = Array.from({ length: 3 }, (_, i) => i * 2);
console.log(withMap); // [0, 2, 4]
```

`Array.from(arguments)` converts the array-like `arguments` object into a real array. Passing a plain `{ length: 3 }` object (with no actual indexed values) plus a mapping function is a common trick for generating a computed sequence.
