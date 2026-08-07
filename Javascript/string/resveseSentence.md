```js
export const reverseSentence = (sentence) => {
  const words = sentence.split(" ");
  const reversedWords = words.reverse();
  const reversedSentence = reversedWords.join(" ");
  return reversedSentence;
};
```

Your `reverseSentence` implementation is clean, straightforward, and works well for standard sentences.

However, there are two common edge cases in production applications worth noting: **multiple spaces between words** and **trailing/leading whitespace**.

---

### The Edge Case Issue

```javascript
reverseSentence("  hello   world  ");
// Output: "  world   hello  " (Preserves unintended empty array slots)

```

1. **`split(" ")`** creates empty string elements `""` when encountering multiple spaces in a row.
2. Reversing those empty elements leads to inconsistent spacing.

---

### Refactored Options

#### Option A: Regex Split (`/\s+/`) + `trim()` (Most Popular)

Matches one or more whitespace characters (`\s+`) to ignore extra spaces between words:

```javascript
export const reverseSentence = (sentence) => 
  sentence
    .trim()
    .split(/\s+/)
    .reverse()
    .join(" ");

console.log(reverseSentence("  hello   world  ")); 
// Output: "world hello" (Clean spaces!)

```

#### Option B: One-Liner without Array Reallocation

If you want to handle multi-word inputs without intermediate array variables:

```javascript
export const reverseSentence = (s) => s.trim().split(/\s+/).reverse().join(" ");

```

---

### Side-by-Side Comparison

| Feature                               | Original (`split(" ")`) | Regex (`split(/\s+/)`)        |
| ------------------------------------- | ----------------------- | ----------------------------- |
| **Simple Sentence** (`"hello world"`) | `"world hello"`         | `"world hello"`               |
| **Extra Spaces** (`"hello   world"`)  | `"world   hello"`       | `"world hello"`               |
| **Leading/Trailing Spaces**           | Preserves padding       | Cleans leading/trailing space |
