# Scenario: removing duplicates from an array of primitives vs an array of objects

**Prompt:** You need a `dedupe` utility. It works fine on `[1, 2, 2, 3]` but fails on an array of objects like `[{id:1}, {id:1}]` where the objects are different references but represent the same logical entity. How do you handle both cases?

**Approach:** For primitives, `Set` is a one-liner. For objects, dedupe by a key selector:

```js
const dedupePrimitives = (arr) => [...new Set(arr)];
console.log(dedupePrimitives([1, 2, 2, 3])); // [1, 2, 3]

function dedupeBy(arr, keyFn) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
const users = [{ id: 1, name: "A" }, { id: 1, name: "A-dup" }, { id: 2, name: "B" }];
console.log(dedupeBy(users, (u) => u.id)); // keeps first occurrence per id
```

Edge case: `Set` only dedupes by reference/`===` equality, so two structurally-identical-but-different object references (`{id:1}` twice, created separately) are never deduped by `new Set()` alone — that's exactly why the keyed version is needed for object data.
