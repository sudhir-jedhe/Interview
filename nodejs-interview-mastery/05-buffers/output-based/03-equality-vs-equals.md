# == Reference Equality vs .equals() Content Equality

```js
console.log(Buffer.from('abc') == Buffer.from('abc'));
console.log(Buffer.from('abc').equals(Buffer.from('abc')));
```

**Answer:** `false`, then `true`.

**Why:** `==` compares object identity for two distinct Buffer instances (reference equality), which is always false for separately created buffers. `.equals()` does a byte-by-byte content comparison and correctly returns `true`.
