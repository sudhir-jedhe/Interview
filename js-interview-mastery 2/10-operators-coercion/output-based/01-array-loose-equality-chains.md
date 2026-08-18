# Output: Array loose-equality chains

```js
console.log([] == false);
console.log([] == "");
console.log([] == 0);
console.log([""] == false);
```

**Answer:** `true`, `true`, `true`, `true`

**Why:** In each case an array is compared against a primitive, so the array is first converted via `ToPrimitive`, which for a plain array calls `.toString()` — an empty array becomes `""`, and `[""]` (one empty-string element) also becomes `""` when joined. From there, `"" == false` coerces `false` to `0` and `""` to `0`, matching; `"" == ""` matches directly; `"" == 0` coerces `""` to `0`, matching. All four chains eventually bottom out at `0 == 0` or `"" == ""`.
