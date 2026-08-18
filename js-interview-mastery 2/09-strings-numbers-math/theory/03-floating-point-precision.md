# Floating Point Precision

JavaScript numbers are IEEE-754 double-precision floats, and most decimal fractions (like `0.1`) can't be represented exactly in binary, causing tiny rounding errors that accumulate during arithmetic.

```js
console.log(0.1 + 0.2);            // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);    // false
```

This isn't a JavaScript bug — it's inherent to binary floating-point representation and affects nearly every mainstream language that uses IEEE-754 doubles.

## Fixes

- **Epsilon comparison** — compare with a small tolerance instead of exact equality: `Math.abs(a - b) < Number.EPSILON` (note `Number.EPSILON` is very small and may be too strict once more operations/larger magnitudes are involved; a custom tolerance appropriate to your value scale is often more robust).
- **Rounding for display** — `.toFixed(n)` rounds to `n` decimal places, but it **returns a string**, so convert back with `Number()` if you need to keep computing with the result rather than just displaying it.
- **Integer arithmetic for money** — avoid floats entirely for currency: store integer cents (or the smallest unit of the currency) throughout your calculations and only convert to a decimal string at the very last step for display. This avoids compounding rounding error across many additions before you ever round.

```js
console.log((0.1 + 0.2).toFixed(2));                       // "0.30" (string!)
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);   // true
```

One more trap worth knowing: `toFixed` *rounds*, it doesn't truncate, and because of how some decimals are stored, that rounding can surprise you — `(1.005).toFixed(2)` actually gives `"1.00"`, not `"1.01"`, because `1.005` itself isn't stored exactly as `1.005` in binary. This is another reason to prefer integer-based math for anything beyond a final, one-time display step.
