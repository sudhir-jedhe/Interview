# Output: hasOwnProperty on a null-prototype object

```js
const dict = Object.create(null);
dict.a = 1;
console.log(dict);
console.log(dict.hasOwnProperty("a"));
```

**Answer:** logs something like `[Object: null prototype] { a: 1 }`, then throws `TypeError: dict.hasOwnProperty is not a function`

**Why:** `Object.create(null)` produces an object with no prototype chain at all, so it has no inherited `hasOwnProperty`, `toString`, etc. Node's console specially labels such objects as "null prototype" to distinguish them from ordinary objects. To safely check ownership you'd need `Object.prototype.hasOwnProperty.call(dict, "a")` or, in modern JS, `Object.hasOwn(dict, "a")`.
