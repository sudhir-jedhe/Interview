# Arrays

Arrays are the workhorse data structure of everyday JavaScript, and interview questions on them almost always probe two things: whether you know which methods mutate the original array versus return a new one, and whether you understand the subtle return-value and callback-signature differences between `map`, `forEach`, and `reduce`. This topic covers that mutating/non-mutating split explicitly, the searching and flattening methods, how to turn array-like objects (like `arguments` or a `NodeList`) into real arrays, and one of the most-cited JavaScript surprises: the default `sort()` behavior.

What's covered:
- Mutating methods (`push`/`pop`/`shift`/`unshift`/`splice`/`sort`/`reverse`) vs non-mutating methods (`map`/`filter`/`slice`/`concat`/`toSorted`/`toReversed`)
- `map` vs `forEach` vs `reduce` — return values and correct use cases
- `find`/`findIndex`/`some`/`every`
- `flat`/`flatMap`
- `Array.from` and `Array.of`
- Array-like objects (`arguments`, `NodeList`) and converting them to real arrays
- Sparse arrays
- Sorting gotchas — the default lexicographic sort surprise

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
