# Output: for-of on a plain object throws

```js
const obj = { a: 1, b: 2 };
for (const key of obj) {
  console.log(key);
}
```

**Answer:** `TypeError: obj is not iterable`

**Why:** Plain objects do not implement `Symbol.iterator` by default, so `for-of` cannot be used on them directly — only `for-in` (or `Object.keys`/`values`/`entries` combined with a different loop) works on plain objects. Reaching for `for-of` on `{}` is one of the most common beginner mistakes.
