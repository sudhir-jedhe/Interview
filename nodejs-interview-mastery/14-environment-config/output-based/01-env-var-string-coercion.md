# Output-Based: env vars are always strings

```js
process.env.COUNT = 5;
console.log(typeof process.env.COUNT);
console.log(process.env.COUNT + 1);
```

**Answer:** `string`, then `51`

**Why:** Assigning a number to `process.env.COUNT` implicitly stringifies it — environment variables are always strings, no exceptions. `"5" + 1` is string concatenation, producing `"51"`, not numeric addition.
