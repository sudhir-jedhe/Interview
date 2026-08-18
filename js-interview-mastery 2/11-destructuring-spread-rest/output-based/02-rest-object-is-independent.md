# Output: Rest-collected object is independent of the source

```js
const obj = { a: 1, b: 2, c: 3 };
const { a, ...rest } = obj;
rest.a = 99;
console.log(obj.a, rest);
```

**Answer:** `1 { b: 2, c: 3, a: 99 }`

**Why:** `rest` is a brand-new plain object built from the leftover own enumerable properties (`b`, `c`) — `a` was excluded. Mutating `rest` never touches `obj`, and you can freely add new keys like `a` back onto `rest` without affecting the original.
