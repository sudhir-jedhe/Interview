# Interview Q&A: mutation and core methods

**Q: Which common array methods mutate the original array?**
`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, and `copyWithin` all mutate in place. Everything else commonly used (`map`, `filter`, `slice`, `concat`, `reduce`, `flat`, `flatMap`) returns a new array or value without touching the original. ES2023 added non-mutating counterparts for the mutating ones — `toSorted`, `toReversed`, `toSpliced`, and `with`.

**Q: What's the difference between `slice` and `splice`?**
`slice(start, end)` is non-mutating — it returns a shallow copy of a portion of the array without touching the original. `splice(start, deleteCount, ...items)` is mutating — it removes and/or inserts elements directly in the original array and returns the removed elements. They're easy to confuse by name; a good mnemonic is "splice changes, slice copies."

**Q: Explain the return-value difference between `map`, `forEach`, and `reduce`.**
`map` returns a new array of the same length, one transformed value per input element. `forEach` always returns `undefined` — it exists purely for side effects. `reduce` returns whatever the accumulator ends up being, which can be a number, string, object, array, or anything else, making it the general-purpose tool when the output shape doesn't match "one value per input."
