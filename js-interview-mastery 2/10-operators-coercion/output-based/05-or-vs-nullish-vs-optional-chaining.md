# Output: || vs ?? vs ?. on a nested config object

```js
const user = { settings: { theme: "" } };
console.log(user.settings.theme || "dark");
console.log(user.settings.theme ?? "dark");
console.log(user.missing?.theme ?? "dark");
```

**Answer:** `"dark"`, `""`, `"dark"`

**Why:** `theme` is an empty string, which is falsy, so `||` treats it as "missing" and substitutes `"dark"`. `??` only treats `null`/`undefined` as missing, and `""` is neither, so it correctly preserves the empty string as a deliberately-set value. `user.missing` doesn't exist, so `?.` short-circuits the whole chain to `undefined`, and `??` then substitutes `"dark"` since `undefined` is nullish.
