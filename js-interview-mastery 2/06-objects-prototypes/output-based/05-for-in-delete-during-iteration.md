# Output: deleting the current key mid for...in

```js
const obj = { a: 1, b: 2 };
for (const key in obj) {
  if (key === "a") delete obj.a;
  console.log(key);
}
```

**Answer:** `"a"` then `"b"`

**Why:** `for...in` computes property visitation dynamically, but engines generally handle deleting the *current* key mid-iteration safely — it just won't be revisited, and keys already yielded or not yet visited are unaffected as long as you don't add new keys. `a` is logged before being deleted, and `b` still gets visited normally afterward.
