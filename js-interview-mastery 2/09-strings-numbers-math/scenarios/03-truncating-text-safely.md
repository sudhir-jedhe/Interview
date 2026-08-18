# Scenario: Truncating long user-generated text safely without cutting words mid-character

You need to truncate a post preview to roughly 100 characters, adding an ellipsis, but must avoid cutting in the middle of a word or, worse, in the middle of a multi-byte emoji (which would render as a broken character). How do you implement this?

**Approach:** Use `slice` for the raw truncation, then trim back to the last full word boundary, and use array-based (code-point-aware) splitting for emoji safety:

```js
function truncate(text, maxLength = 100) {
  const chars = Array.from(text); // splits by Unicode code point, not UTF-16 code unit
  if (chars.length <= maxLength) return text;
  let truncated = chars.slice(0, maxLength).join("");
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.7) truncated = truncated.slice(0, lastSpace);
  return truncated + "…";
}

console.log(truncate("The quick brown fox jumps over the lazy dog", 15));
// "The quick…" (cut at word boundary, not mid-word)
```

Edge case: plain `str.slice(0, 100)` operates on UTF-16 code units, so it can split a surrogate pair (like many emoji, which are 2 code units) right down the middle, producing an invalid/garbled character at the cut point. `Array.from(str)` iterates by Unicode code point (it uses the string's iterator, which is surrogate-pair aware), so slicing the resulting array is safe even with emoji-heavy text.
