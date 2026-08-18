# Snippet: partial application with bind

```js
function power(exponent, base) { return base ** exponent; }
const square = power.bind(null, 2);
const cube = power.bind(null, 3);
console.log(square(5)); // 25
console.log(cube(5));   // 125
```

Each `bind` call pre-fills the `exponent` argument, producing a specialized function that only needs `base` supplied at call time. `this` is irrelevant to `power`, so `null` is passed as a placeholder.
