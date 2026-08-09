Your implementation for **LeetCode 2788 ("Split Strings by Separator")** using `Array.prototype.flatMap` is **optimal, concise, and production-ready**!

---

### Code Analysis

```typescript
function splitWordsBySeparator(words: string[], separator: string): string[] {
    return words.flatMap(w => w.split(separator).filter(s => s.length > 0));
}

```

* **Why `flatMap` is ideal:** It maps each string into an array of split substrings and flattens the resulting array of arrays into a single 1D array in a single pass ($\mathcal{O}(N)$ time complexity).
* **Filtering empty strings:** `.filter(s => s.length > 0)` (or simply `.filter(Boolean)`) correctly strips out empty segments caused by leading, trailing, or consecutive separators (such as `"$easy$"` or `"|||"`).

---

### Micro-Optimization (Cleaner Syntax)

You can pass `Boolean` directly to `.filter()` to implicitly convert strings to booleans (empty strings `""` evaluate to `false`):

```typescript
function splitWordsBySeparator(words: string[], separator: string): string[] {
    return words.flatMap(w => w.split(separator).filter(Boolean));
}

// Verification
console.log(splitWordsBySeparator(["one.two.three", "four.five", "six"], "."));
// ["one", "two", "three", "four", "five", "six"]

console.log(splitWordsBySeparator(["$easy$", "$problem$"], "$"));
// ["easy", "problem"]

console.log(splitWordsBySeparator(["|||"], "|"));
// []

```

---

### Complexity & Edge Case Verification

| Metric / Case                 | Value / Outcome               | Note                                                   |
| ----------------------------- | ----------------------------- | ------------------------------------------------------ |
| **Time Complexity**           | **$\mathcal{O}(N \times M)$** | $N$ = total words, $M$ = average length of each word   |
| **Space Complexity**          | **$\mathcal{O}(N \times M)$** | Auxiliary space used for output array and split tokens |
| **Special Regex Chars (`.`, ` | `,`$`)**                      | ✅ Safe                                                 | `String.prototype.split(string)` takes literal strings, so regex special characters do not need escaping |
| **Empty Input Array (`[]`)**  | ✅ Safe                        | Returns `[]` immediately                               |
