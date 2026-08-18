# Math Essentials

## Random numbers

`Math.random()` returns a float in `[0, 1)`. To get an integer within an inclusive range, scale and floor:

```js
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

The `+1` is essential — omitting it makes the range effectively exclusive of `max`, a classic off-by-one. `Math.random()` is not cryptographically secure; for anything security-sensitive (tokens, password reset codes) use `crypto.getRandomValues()` instead.

## Math.max / Math.min on arrays

`Math.max(...arr)`/`Math.min(...arr)` need spread since these functions take individual arguments, not an array — calling `Math.max(arr)` directly returns `NaN` because the array itself isn't a valid number.

```js
const nums = [4, 1, 9, 2];
Math.max(nums);       // NaN
Math.max(...nums);    // 9
```

For very large arrays, spreading can hit call-stack argument limits; `arr.reduce((a, b) => Math.max(a, b))` is a safer alternative in that case.

## Math.floor vs Math.ceil vs Math.round vs Math.trunc

| Aspect | `Math.floor` | `Math.ceil` | `Math.round` | `Math.trunc` |
|---|---|---|---|---|
| Direction | Always toward `-Infinity` | Always toward `+Infinity` | Nearest integer, ties toward `+Infinity` | Toward `0` (drops the decimal part) |
| `2.5` | `2` | `3` | `3` | `2` |
| `-2.5` | `-3` | `-2` | `-2` | `-2` |

```js
Math.round(2.5);    // 3
Math.round(-2.5);   // -2, not -3 — ties always go toward +Infinity, regardless of sign
Math.round(-2.6);   // -3
```

Use `Math.floor` for pagination/bucketing math where you always want to round down regardless of sign, `Math.round` for genuine "nearest value" rounding (like display formatting), and `Math.trunc` when you specifically want to discard the fractional part without directional rounding. The most common mistake is assuming `Math.round(-2.5)` behaves like `-Math.round(2.5)` — it doesn't, because round-half-up always biases toward positive infinity regardless of sign.
