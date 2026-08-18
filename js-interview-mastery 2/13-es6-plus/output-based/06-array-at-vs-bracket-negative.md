```js
console.log([10, 20, 30].at(-2));
console.log([10, 20, 30][-2]);
```
**Answer:**
```
20
undefined
```
**Why:** `.at()` supports negative indices, counting from the end of the array (`-2` means "second from last" → `20`). Plain bracket indexing `arr[-2]` does not support negative indices at all — it just does a normal property lookup for the string key `"-2"`, which doesn't exist on the array, so it returns `undefined`.
