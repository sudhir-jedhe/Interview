# Output: find returns a value, findIndex returns -1 when not found

```js
const users = [{ name: "A", age: 20 }, { name: "B", age: 30 }];
console.log(users.find((u) => u.age > 25).name);
console.log(users.findIndex((u) => u.age > 100));
```

**Answer:** `"B"` then `-1`

**Why:** `find` returns the first element satisfying the predicate (here, the object for `"B"`), so accessing `.name` on it gives `"B"`. `findIndex` returns `-1` when no element satisfies the predicate, mirroring `indexOf`'s not-found convention rather than returning `undefined`.
