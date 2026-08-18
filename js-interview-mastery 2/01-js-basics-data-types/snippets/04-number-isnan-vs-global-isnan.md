# `Number.isNaN` vs Global `isNaN`

```js
console.log(isNaN('abc'));            // true  — coerces 'abc' -> NaN first
console.log(Number.isNaN('abc'));     // false — no coercion, 'abc' is not the NaN value
console.log(isNaN(undefined));        // true  — Number(undefined) is NaN
console.log(Number.isNaN(undefined)); // false
```

Prefer `Number.isNaN` whenever you need to check for the literal `NaN` value without accidental coercion.
