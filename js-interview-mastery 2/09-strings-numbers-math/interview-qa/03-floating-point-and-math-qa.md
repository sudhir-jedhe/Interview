# Interview Q&A: Floating Point & Math

**Q: Why does `0.1 + 0.2 !== 0.3` in JavaScript?**
JavaScript numbers are IEEE-754 double-precision floating point, and most decimal fractions (including `0.1` and `0.2`) can't be represented exactly in binary — they're stored as the closest possible approximation. Adding two approximations compounds the tiny error, producing `0.30000000000000004` instead of exactly `0.3`. This isn't a JS bug; it's inherent to binary floating-point representation and affects nearly every mainstream language.

**Q: How do you compare floating-point numbers safely?**
Instead of exact equality, check that the difference is within a small tolerance: `Math.abs(a - b) < Number.EPSILON` (or a custom epsilon appropriate to your value scale, since `Number.EPSILON` alone is very small and may be too strict for numbers involving larger magnitudes or more accumulated operations). For display purposes, `.toFixed(n)` rounding to a fixed number of decimals is usually sufficient.

**Q: How would you generate a random integer within an inclusive range using `Math.random()`?**
`Math.random()` returns a float in `[0, 1)`. To get an inclusive integer range `[min, max]`, scale and floor: `Math.floor(Math.random() * (max - min + 1)) + min`. The `+1` is essential — omitting it makes the range effectively exclusive of `max`, since `Math.floor` on the unscaled maximum possible value would never quite reach `max` without it.

**Q: What's the difference between `Math.round`, `Math.floor`, `Math.ceil`, and `Math.trunc`?**
`Math.floor` always rounds toward negative infinity, `Math.ceil` always rounds toward positive infinity, `Math.round` rounds to the nearest integer with ties going toward positive infinity (`Math.round(-2.5)` is `-2`, not `-3`), and `Math.trunc` simply removes the fractional part regardless of sign, rounding toward zero (`Math.trunc(-2.9)` is `-2`).

**Q: Why do you need spread syntax with `Math.max`/`Math.min` on an array?**
`Math.max` and `Math.min` accept individual arguments, not an array, so calling `Math.max(arr)` with an array directly returns `NaN` since the array itself isn't a valid number. Spreading the array's elements as individual arguments (`Math.max(...arr)`) is required, though for very large arrays this can hit call-stack argument limits, in which case `arr.reduce((a, b) => Math.max(a, b))` is a safer alternative.
