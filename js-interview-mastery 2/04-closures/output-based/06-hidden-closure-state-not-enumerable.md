# Closed-Over State Is Not an Enumerable Property

```js
function secretHolder(secret) {
  return {
    reveal: function() { return secret; }
  };
}
const holder = secretHolder('42');
console.log(Object.keys(holder));
console.log(holder.secret);
console.log(holder.reveal());
```

**Answer:** `['reveal']`, `undefined`, `'42'`

**Why:** `secret` is never attached as a property on the returned object — it only exists in `secretHolder`'s closure, accessible exclusively through the `reveal` function that was defined inside that scope. `Object.keys` only sees the object's own enumerable properties (`reveal`), not the hidden closed-over variable, and direct access via `holder.secret` correctly returns `undefined`.
