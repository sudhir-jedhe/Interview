```js
const replaceLast = (str, pattern, replacement) => {
  const match =
    typeof pattern === "string"
      ? pattern
      : (str.match(new RegExp(pattern.source, "g")) || []).slice(-1)[0];
  if (!match) return str;
  const last = str.lastIndexOf(match);
  return last !== -1
    ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}`
    : str;
};

replaceLast("abcabdef", "ab", "gg"); // 'abcggdef'
replaceLast("abcabdef", /ab/, "gg"); // 'abcggdef'
replaceLast("abcabdef", "ad", "gg"); // 'abcabdef'
replaceLast("abcabdef", /ad/, "gg"); // 'abcabdef'
```

Your `replaceLast` function is a clever way to handle replacing the final match of either a literal string or a regex pattern!

However, there are a few **critical edge cases** and potential bugs in the regex path that could cause runtime exceptions or incorrect replacements.

---

### Critical Issues & Edge Cases

#### 1. Regex Flags are Stripped (e.g., `/ab/i`)

Using `new RegExp(pattern.source, "g")` strips all flags from the original regex (such as `i` for case-insensitivity or `u` for Unicode support).

* **Fix:** Pass `pattern.flags` (e.g., `new RegExp(pattern.source, pattern.flags + (pattern.global ? "" : "g"))`).

#### 2. Pattern Matching Different Substrings

If a regex matches different substrings across the text (e.g., `/\d/`), `lastIndexOf(match)` will match the **last occurrence of that specific character in the string**, not necessarily the position where the last regex match occurred!

```javascript
// BUG EXAMPLE:
replaceLast("1a1b", /\d/, "X"); 
// 1. Matches: ["1", "1"] -> last match is "1".
// 2. lastIndexOf("1") finds the FIRST '1' at index 0 instead of index 2!
// Expected: "1aXb" | Output: "Xa1b"

```

#### 3. Capture Groups and Replacements (`$1`, `$&`)

String replacements in JavaScript support special replacement patterns like `$&` (matched text) or `$1` (capture group). Concatenating raw `replacement` as a literal string misses this behavior.

---

### Robust & Spec-Compliant Refactoring

To handle all regular expressions (including flags, dynamic capture groups, and distinct matched substrings) correctly and efficiently, execute a reverse search or track match offsets directly:

```javascript
/**
 * Safely replaces the last occurrence of a string or regular expression.
 * @param {string} str - Source string
 * @param {string|RegExp} pattern - Substring or RegExp to match
 * @param {string|Function} replacement - Replacement string or function
 * @return {string}
 */
const replaceLast = (str, pattern, replacement) => {
  if (typeof pattern === "string") {
    const last = str.lastIndexOf(pattern);
    if (last === -1) return str;

    const replaceStr = typeof replacement === "function" 
      ? replacement(pattern, last, str) 
      : replacement;

    return `${str.slice(0, last)}${replaceStr}${str.slice(last + pattern.length)}`;
  }

  if (pattern instanceof RegExp) {
    // Ensure global flag is active so we can iterate all matches with matchAll
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const globalRegex = new RegExp(pattern.source, flags);
    
    // Collect all matches
    const matches = Array.from(str.matchAll(globalRegex));
    if (matches.length === 0) return str;

    // Grab the final match
    const lastMatch = matches[matches.length - 1];
    const matchIndex = lastMatch.index;
    const matchText = lastMatch[0];

    const replaceStr = typeof replacement === "function"
      ? replacement(...lastMatch, matchIndex, str)
      : replacement;

    return `${str.slice(0, matchIndex)}${replaceStr}${str.slice(matchIndex + matchText.length)}`;
  }

  return str;
};

// --- Test Verification ---
console.log(replaceLast("abcabdef", "ab", "gg")); // "abcggdef"
console.log(replaceLast("1a1b", /\d/, "X"));       // "1aXb" (Fixed!)
console.log(replaceLast("ABCABDEF", /ab/i, "gg"));  // "ABCggDEF" (Flags preserved!)

```

---

### Comparison Matrix

| Scenario                                             | Original Snippet          | Refactored Version         |
| ---------------------------------------------------- | ------------------------- | -------------------------- |
| **Literal Strings (`"ab"`)**                         | ✅ Works                   | ✅ Works                    |
| **Case-Insensitive Regex (`/ab/i`)**                 | ❌ Strips `i` flag         | ✅ Preserves flags          |
| **Regex Matching Distinct Tokens (`/\d/`)**          | ❌ Wrong index calculation | ✅ Tracks exact match index |
| **Replacement Functions (`(m) => m.toUpperCase()`)** | ❌ Not supported           | ✅ Supported                |
