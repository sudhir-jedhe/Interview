# Interview Q&A: sorting and sparse arrays

**Q: Why does `[10, 1, 2].sort()` not return `[1, 2, 10]`?**
Because `sort()` without a comparator function converts every element to a string and compares them lexicographically (Unicode code point order), not numerically. `"10"` sorts before `"2"` because `"1"` is a lower code point than `"2"` at the first character. To sort numbers correctly you must pass an explicit comparator: `.sort((a, b) => a - b)`.

**Q: Is `Array.prototype.sort` stable in modern JavaScript?**
Yes — as of ES2019, the spec requires `sort` to be stable, meaning elements that compare as equal retain their original relative order. This matters for multi-key sorting: you can sort by a secondary key first, then sort by the primary key, and ties on the primary key will still preserve the secondary-key ordering.

**Q: What is a sparse array and how does it affect iteration?**
A sparse array has "holes" — indices with no actual stored value, as opposed to indices explicitly set to `undefined`. `.length` still accounts for holes, and a plain `for` loop or `.length` access sees them, but higher-order methods like `map`, `forEach`, `filter`, and `reduce` all skip holes without invoking the callback for them, which is a common source of "why didn't my callback run for every index" confusion.
