# Arrays

Arrays are the workhorse data structure of everyday JavaScript, and interview questions on them almost always probe two things: whether you know which methods mutate the original array versus return a new one, and whether you understand the subtle return-value and callback-signature differences between `map`, `forEach`, and `reduce`. This topic covers that mutating/non-mutating split explicitly, the searching and flattening methods, how to turn array-like objects (like `arguments` or a `NodeList`) into real arrays, and one of the most-cited JavaScript surprises: the default `sort()` behavior.

### Structure

- `from-your-notes/` — original standalone notes (map vs filter) — untouched, kept as-is.
- `theory/` — concept write-ups: mutating vs non-mutating methods, `map`/`forEach`/`reduce`, `find`/`findIndex`/`some`/`every`, `flat`/`flatMap`, `Array.from`/`Array.of` and array-likes, and sparse arrays/sort gotchas.
- `snippets/` — one short runnable example per file.
- `output-based/` — "what does this log?" questions with full explanations.
- `scenarios/` — realistic problems (grouping orders by customer, deduping primitives vs objects, converting a live `NodeList`, pagination) with worked solutions.
- `interview-qa/` — Q&A grouped into mutation/core methods, searching/transforming, sorting/sparse arrays, and array-likes/conversions.
- `problems/` — hands-on implementation challenges with full solutions: `myMap`/`myFilter`/`myReduce` polyfills, a `flatten(arr, depth)` function, and a `chunk(arr, size)` function.
- `assets/` — placeholder for supporting images/PDFs from original notes.

**What's covered:**
- Mutating methods (`push`/`pop`/`shift`/`unshift`/`splice`/`sort`/`reverse`) vs non-mutating methods (`map`/`filter`/`slice`/`concat`/`toSorted`/`toReversed`)
- `map` vs `forEach` vs `reduce` — return values and correct use cases
- `find`/`findIndex`/`some`/`every`
- `flat`/`flatMap`
- `Array.from` and `Array.of`
- Array-like objects (`arguments`, `NodeList`) and converting them to real arrays
- Sparse arrays
- Sorting gotchas — the default lexicographic sort surprise
- Building `map`/`filter`/`reduce`, `flatten`, and `chunk` from scratch

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
