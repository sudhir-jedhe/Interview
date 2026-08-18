# Output: `WeakSet` is not iterable

```js
const set = new WeakSet();
let node = { type: "div" };
set.add(node);
console.log(set.has(node));
for (const item of set) {
  console.log(item);
}
```

**Answer:**
```
true
TypeError: set is not iterable
```

**Why:** `WeakSet.prototype.has` works normally for membership checks. But `WeakSet` (like `WeakMap`) deliberately does not implement the iterable protocol — there's no `Symbol.iterator` — because its contents can be silently removed by garbage collection at any time, making iteration order and completeness fundamentally unpredictable, so the language simply disallows it.
