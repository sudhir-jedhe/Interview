# Output: `WeakMap` has no `.size`

```js
const cache = new WeakMap();
function attach(obj) {
  cache.set(obj, "metadata");
  return cache.has(obj);
}
console.log(attach({}));
console.log(cache.size);
```

**Answer:**
```
true
undefined
```

**Why:** `attach` correctly sets and confirms the entry while the object is still referenced by the local parameter. But `WeakMap` has no `.size` property at all (unlike `Map`) — accessing it returns `undefined` — because the number of live entries can change at any moment due to garbage collection, so exposing a "count" wouldn't be a meaningful, stable value.
