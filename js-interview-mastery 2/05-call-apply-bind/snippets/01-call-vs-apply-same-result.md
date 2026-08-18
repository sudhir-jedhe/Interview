# Snippet: call vs apply — same result, different argument syntax

```js
function sum3(a, b, c) { return a + b + c; }
console.log(sum3.call(null, 1, 2, 3));    // 6 — args listed individually
console.log(sum3.apply(null, [1, 2, 3])); // 6 — args as an array
```

Both invoke `sum3` immediately with `this` set to `null` (unused here since `sum3` doesn't reference `this`). The only difference is how the three arguments are supplied — individually to `call`, as an array to `apply`.
