While working on a project a little while back, I came across a problem that made me stop and think. I was trying to check if a truncated HTML string that was serialized from the server had been truncated in the middle of a tag. Naturally, instead of writing a one-off solution, I decided to create a reusable helper function.

Check if a string starts with a substring of another string
String.prototype.startsWith() allows us to easily check if a string starts with a given substring. Unfortunately, in the case of this problem, this is insufficient by itself. Instead, we can use String.prototype.slice() to get each substring of the other string and check it against our text.

If we go from longest to shortest substring of the target string, we are guaranteed to come across the longest substring that the text starts with first. We can then return this substring, if it is found. Otherwise, we can return undefined.

```js
const startsWithSubstring = (text, word) => {
  for (i = word.length; i > 0; i--) {
    const substr = word.slice(-i);
    if (text.startsWith(substr)) return substr;
  }
  return undefined;
};

startsWithSubstring('/>Lorem ipsum dolor sit amet', '<br />'); // '/>'
Check if a string ends with a substring of another string
We can use the same approach to check if a string ends with a substring of another string. The only difference is that we need to use String.prototype.endsWith() instead of String.prototype.startsWith() and change the order of iteration of the substrings.

const endsWithSubstring = (text, word) => {
  for (i = word.length; i > 0; i--) {
    const substr = word.slice(0, i);
    if (text.endsWith(substr)) return substr;
  }
  return undefined;
};

endsWithSubstring('Lorem ipsum dolor sit amet<br /', '<br />'); // '<br /'
```

This is a clever approach to solving the truncated tag/overlap detection problem! You identified a real edge case with raw string matching and built an intuitive helper.

However, there are a few **critical global scope bugs**, **performance traps**, and **edge cases in HTML parsing** worth addressing before using this in production.

---

### Critical Issues & Bug Fixes

#### 1. Scope Leakage (`i` is implicitly global) ⚠️

In both functions, `for (i = word.length; ...)` omits `let` or `const`.

* **In non-strict mode:** Creates a global variable `window.i`, which will cause catastrophic bugs if nested in other loops or async operations.
* **In strict mode (`'use strict'`):** Throws a `ReferenceError: i is not defined`.

#### 2. `startsWithSubstring` Index Slicing Bug

In `startsWithSubstring`:

* Iteration 1 ($i = 6$ for `'<br />'`): `word.slice(-6)` $\rightarrow$ `'<br />'`
* Iteration 2 ($i = 5$): `word.slice(-5)` $\rightarrow$ `'br />'`
* Iteration 3 ($i = 4$): `word.slice(-4)` $\rightarrow$ `'r />'`
* Iteration 4 ($i = 3$): `word.slice(-3)` $\rightarrow$ `' />'`
* Iteration 5 ($i = 2$): `word.slice(-2)` $\rightarrow$ `'/>'`

While it happened to match `'/>'` in your example, **it checks suffixes of `word` against prefixes of `text**`. If `word = "<a>"` and `text = "a>text"`, `word.slice(-2)` yields `">"`, matching `">"`, but missing the `'a>'` substring because `'a>'` is neither a full prefix nor suffix of `word`!

#### 3. Single-Tag Limitation for HTML Parsing

Searching against a single target string like `'<br />'` fails when HTML contains arbitrary tags (e.g., `<div class="content">`, `<span>`, `<a href="...">`).

---

### Refactored & Production-Ready Version

If you are looking for the longest prefix of `word` that matches the end of `text` (or longest suffix of `word` that matches the start of `text`), track the loop index safely with `let`:

```javascript
/**
 * Checks if `text` ends with any non-empty prefix of `target`.
 * Returns the matching overlap substring, or `undefined`.
 */
const endsWithPrefixOf = (text, target) => {
  for (let i = target.length; i > 0; i--) {
    const prefix = target.slice(0, i);
    if (text.endsWith(prefix)) return prefix;
  }
  return undefined;
};

/**
 * Checks if `text` starts with any non-empty suffix of `target`.
 * Returns the matching overlap substring, or `undefined`.
 */
const startsWithSuffixOf = (text, target) => {
  for (let i = 0; i < target.length; i++) {
    const suffix = target.slice(i);
    if (text.startsWith(suffix)) return suffix;
  }
  return undefined;
};

// --- Test Verification ---
console.log(endsWithPrefixOf("Lorem ipsum dolor sit amet<br /", "<br />")); 
// Output: '<br /'

console.log(startsWithSuffixOf("/>Lorem ipsum dolor sit amet", "<br />")); 
// Output: '/>'

```

---

### Robust HTML Truncation Detection (Regex Alternative)

If your real-world goal is to check whether a serialized HTML string was truncated inside **any arbitrary HTML tag**, exact string matching against fixed tags like `'<br />'` will miss dynamic tags.

Instead, use a **Regular Expression** that detects an unclosed angle bracket at the end of the text:

```javascript
/**
 * Detects if a truncated string ends in the middle of an unclosed HTML tag or entity.
 * @param {string} htmlString - The truncated HTML string from server
 * @returns {boolean} - True if truncated inside a tag/entity
 */
const isTruncatedInTag = (htmlString) => {
  // Matches '<' followed by any characters that haven't been closed by '>'
  const unclosedTagRegex = /<[^>]*$/;
  
  // Matches an incomplete HTML entity at the end (e.g. "&am", "&#12")
  const unclosedEntityRegex = /&[a-zA-Z0-9#]*$/;

  return unclosedTagRegex.test(htmlString) || unclosedEntityRegex.test(htmlString);
};

// --- Tests ---
console.log(isTruncatedInTag("<div>Hello <span class='bold'>World</span></div>")); // false (Clean)
console.log(isTruncatedInTag("<div>Hello <span class=\"bo"));                        // true  (Truncated inside tag)
console.log(isTruncatedInTag("Hello &am"));                                         // true  (Truncated inside entity)

```

---

### Method Comparison Matrix

| Approach                      | Fixed Strings (`<br />`) | Dynamic HTML Tags (`<div id="...">`) | Handles Entities (`&amp;`) | Time Complexity          |
| ----------------------------- | ------------------------ | ------------------------------------ | -------------------------- | ------------------------ |
| **Original Loop (Bug Fixed)** | ✅ Works                  | ❌ Misses unknown tags                | ❌ No                       | $\mathcal{O}(M \cdot N)$ |
| **Regex (`/<[^>]*$/`)**       | ✅ Works                  | ✅ Works for **ALL** tags             | ✅ Works with entity check  | $\mathcal{O}(N)$         |
