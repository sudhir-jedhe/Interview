# Output: parseInt and leading zeros

```js
console.log(parseInt("07"));
console.log(parseInt("08"));
console.log(Number("08"));
```

**Answer:** `7`, `8`, `8`

**Why:** Modern `parseInt` (ES5+) always defaults to base 10 unless the string has a `0x`/`0X` prefix, so `"07"` and `"08"` both parse as decimal `7` and `8` — there's no legacy octal-prefix confusion anymore (older engines used to guess octal for leading zeros, which is why explicitly passing a radix is still a defensive habit). `Number("08")` also parses as decimal `8` since `Number()` has never done octal auto-detection.
