How can I truncate a string to a specified length using JavaScript?

Breaking a string into words is not the easiest, neither is finding a good place to truncate a string. Part of the problem is recognizing word boundaries and words themselves. An even more advanced use-case might even need to account for locale. Let's build up from the simplest case to the most advanced.

Truncate string
The absolute simplest way to truncate a string is to use String.prototype.slice(). All you have to do is compare String.prototype.length to the desired length and return the string truncated to the desired length. If the string is shorter than the desired length, return the string as-is.

const truncateString = (str, num) =>
str.length > num ? str.slice(0, num) : str;

truncateString('boomerang', 6); // 'boomer'
Truncate string, adding ellipsis
That works, but the result doesn't hint at the fact that the string has been truncated. Let's add an ellipsis to the end of the string to indicate that it has been truncated. We can do this by appending '...' to the end of the string if it has been truncated. We will also have to account for the length of the ellipsis itself, so we'll need to subtract its length from the desired length.

const truncateString = (str, lim) =>
str.length > lim ? str.slice(0, lim > 3 ? lim - 3 : lim) + '...' : str;

truncateString('boomerang', 7); // 'boom...'
Truncate string at whitespace
Up until this point, we've been truncating the string at the specified length, regardless of whether it's in the middle of a word or not. But you might need to respect word boundaries and truncate the string at a whitespace character.

We can do this by using String.prototype.lastIndexOf() to find the index of the last space below the desired length. We can then use String.prototype.slice() to appropriately truncate the string based on the index of the last space, respecting whitespace if possible and appending '...' at the end.

```js
const truncateStringAtWhitespace = (str, lim, ending = "...") => {
  if (str.length <= lim) return str;
  const lastSpace = str.slice(0, lim - ending.length + 1).lastIndexOf(" ");
  return str.slice(0, lastSpace > 0 ? lastSpace : lim - ending.length) + ending;
};

truncateStringAtWhitespace("short", 10); // 'short'
truncateStringAtWhitespace("not so short", 10); // 'not so...'
truncateStringAtWhitespace("trying a thing", 10); // 'trying...'
truncateStringAtWhitespace("javascripting", 10); // 'javascr...'
```

Locale-sensitive string truncation
Finally, we've arrived at the most complex problem - locale-sensitive string truncation. This is a difficult problem to solve, which is why JavaScript has kindly added the Intl.Segmenter object.

Intl.Segmenter allows you to specify a locale and a granularity option to specify how a string should be segmented. The granularity option can be set to 'grapheme', 'word' or 'sentence', as needed. Using Intl.Segmenter.prototype.segment() on a string returns an iterable Segments object. This can then be used to find the correct index to split a string without being in the middle of a word or a sentence.

```js
const truncateStringAtWord = (str, lim, locale = "en-US", ending = "...") => {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  let lastWordBreak = -1;

  for (let word of segmenter.segment(str)) {
    if (word.isWordLike) continue;
    if (word.index >= lim) break;
    lastWordBreak = word.index;
  }

  return str.slice(0, lastWordBreak) + "...";
};

const truncateStringAtSentence = (
  str,
  lim,
  locale = "en-US",
  ending = "...",
) => {
  const segmenter = new Intl.Segmenter(locale, { granularity: "sentence" });
  let lastSentenceBreak = -1;

  for (let sentence of segmenter.segment(str)) {
    if (
      lastSentenceBreak !== -1 &&
      sentence.index + sentence.segment.length >= lim
    )
      break;
    lastSentenceBreak = sentence.index + sentence.segment.length;
  }

  return str.slice(0, lastSentenceBreak).trim().slice(0, -1) + "...";
};

const str =
  "The quick brown fox jumps over the lazy dog. The jay, pig, fox, zebra and my wolves quack!";
const lim = 50;

truncateStringAtWord(str, lim);
// 'The quick brown fox jumps over the lazy dog. The...'
truncateStringAtSentence(str, lim);
// 'The quick brown fox jumps over the lazy dog...'
```

Your progressive breakdown—from basic slice operations to locale-aware segmentation with `Intl.Segmenter`—provides a complete hierarchy for string truncation in modern JavaScript.

Here is a quick code review and technical refinement of your implementations, specifically addressing **`Intl.Segmenter` edge cases** and **Unicode grapheme boundary issues**.

---

## 1. Code Review & Edge-Case Fixes

### A. The Unicode Grapheme Cluster Trap (Basic `slice`)

For basic non-locale truncation (`slice(0, num)`), using `str.length` can break multi-byte characters like emojis or composite Unicode glyphs:

```javascript
const emojiStr = "👨‍👩‍👧‍👦 Family";

// ❌ Native slice breaks surrogate pairs and combining sequences
console.log(emojiStr.slice(0, 4)); 
// Output: "👨‍👩" (Corrupted emoji sequence!)

// ✅ Intl.Segmenter (granularity: 'grapheme') preserves entire user-perceived characters
const graphemeSegmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const graphemes = Array.from(graphemeSegmenter.segment(emojiStr), s => s.segment);
console.log(graphemes.slice(0, 2).join("")); 
// Output: "👨‍👩‍👧‍👦 " (Preserves emoji cluster perfectly)

```

---

### B. Bug Fix in `truncateStringAtWord`

In your `truncateStringAtWord` function using `Intl.Segmenter`:

```javascript
for (let word of segmenter.segment(str)) {
  if (word.isWordLike) continue; // ⚠️ ISSUE HERE
  if (word.index >= lim) break;
  lastWordBreak = word.index;
}

```

1. **Skipping Word Tokens:** Skipping when `word.isWordLike` is true means the loop only updates `lastWordBreak` on **spaces and punctuation**, rather than tracking the end boundary of the words themselves.
2. **Missing `ending` Parameter Use:** The function signature accepts `ending = "..."`, but the return statement hardcodes `+ "..."` instead of using `ending`.

#### Refactored `truncateStringAtWord`

Here is a corrected version that correctly accounts for word boundaries, subtracts the length of the ellipsis indicator, and handles single long words gracefully:

```javascript
/**
 * Truncates a string at word boundaries using Intl.Segmenter.
 */
const truncateStringAtWord = (
  str,
  lim,
  locale = "en-US",
  ending = "..."
) => {
  if (str.length <= lim) return str;

  const targetLen = lim - ending.length;
  if (targetLen <= 0) return ending.slice(0, lim);

  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  let cutIndex = -1;

  for (const segment of segmenter.segment(str)) {
    // If the next word/boundary exceeds our target length, stop
    if (segment.index > targetLen) break;

    // Track the end index of the word token
    if (segment.isWordLike) {
      const wordEnd = segment.index + segment.segment.length;
      if (wordEnd <= targetLen) {
        cutIndex = wordEnd;
      }
    }
  }

  // Fallback if the first word itself is longer than targetLen
  if (cutIndex === -1) {
    cutIndex = targetLen;
  }

  return str.slice(0, cutIndex).trimEnd() + ending;
};

// --- Test Verification ---
const text = "The quick brown fox jumps over the lazy dog.";

console.log(truncateStringAtWord(text, 20));
// Output: "The quick brown..." ✅ (Cleanly breaks after "brown" instead of mid-word)

```

---

### C. Refactored `truncateStringAtSentence`

Your sentence truncation logic manually trims trailing punctuation using `.slice(0, -1)`. Using `Intl.Segmenter` directly gives us exact sentence boundary offsets:

```javascript
/**
 * Truncates a string at full sentence boundaries using Intl.Segmenter.
 */
const truncateStringAtSentence = (
  str,
  lim,
  locale = "en-US",
  ending = "..."
) => {
  if (str.length <= lim) return str;

  const targetLen = lim - ending.length;
  const segmenter = new Intl.Segmenter(locale, { granularity: "sentence" });
  let cutIndex = -1;

  for (const segment of segmenter.segment(str)) {
    const sentenceEnd = segment.index + segment.segment.length;
    
    if (sentenceEnd <= targetLen) {
      cutIndex = sentenceEnd;
    } else {
      break;
    }
  }

  // If no full sentence fits, fall back to word truncation
  if (cutIndex === -1) {
    return truncateStringAtWord(str, lim, locale, ending);
  }

  return str.slice(0, cutIndex).trimEnd() + ending;
};

// --- Test Verification ---
const paragraph = "The quick brown fox jumps over the lazy dog. The jay, pig, fox, zebra and my wolves quack!";

console.log(truncateStringAtSentence(paragraph, 50));
// Output: "The quick brown fox jumps over the lazy dog...." ✅

```

---

## 2. Decision Matrix: Which Approach to Choose?

| Strategy                            | Speed / Overhead | Unicode / Emoji Safe? | Word-Boundary Safe? | Best Use Case                                                          |
| ----------------------------------- | ---------------- | --------------------- | ------------------- | ---------------------------------------------------------------------- |
| **`str.slice(0, lim)`**             | 🚀 Blazing Fast   | ❌ No                  | ❌ No                | Internal system IDs, plain ASCII text without UI display requirements. |
| **`lastIndexOf(" ")`**              | ⚡ Very Fast      | ❌ No                  | ⚠️ Basic Space Only  | Simple UI cards with standard English/Latin text.                      |
| **`Intl.Segmenter` (`"grapheme"`)** | 🐢 Moderate       | ✅ Yes                 | ❌ No                | Short inputs containing emojis, symbols, or multi-byte CJK text.       |
| **`Intl.Segmenter` (`"word"`)**     | 🐢 Moderate       | ✅ Yes                 | ✅ Yes               | Production-grade UI text excerpts, blogs, and internationalized apps.  |

Choosing between CSS-based truncation and JavaScript string truncation depends on whether your priority is visual layout integrity, performance, or precise character control.

---

### Comparison Overview

| Feature / Aspect          | CSS `text-overflow: ellipsis`      | CSS `-webkit-line-clamp`           | JavaScript String Truncation                   |
| ------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------------------- |
| **Lines Supported**       | **Single line only**               | **Multi-line**                     | Multi-line or single line (via markup)         |
| **Underlying Data**       | Preserves full string in DOM       | Preserves full string in DOM       | **Permanently mutates/cuts** DOM content       |
| **Responsive Resize**     | ✅ Automatic (adapts to container)  | ✅ Automatic (adapts to container)  | ❌ Static (requires window resize listeners)    |
| **SEO & Accessibility**   | ✅ Full text read by screen readers | ✅ Full text read by screen readers | ❌ Truncated text lost to assistive tech        |
| **Performance**           | 🚀 Blazing Fast (GPU/Layout Engine) | 🚀 Blazing Fast (GPU/Layout Engine) | 🐢 Slower (DOM mutation / JS execution)         |
| **Word / Sentence Rules** | ❌ Dumb visual cut (mid-word)       | ❌ Dumb visual cut (mid-word)       | ✅ **Smart** (respects words, `Intl.Segmenter`) |
| **Custom Ending**         | ❌ Hardcoded `...`                  | ❌ Hardcoded `...`                  | ✅ Highly customizable (e.g. `"... Read More"`) |

---

### 1. Single-Line CSS: `text-overflow: ellipsis`

This is the standard approach for single-line text overflows (such as table cells, navigation items, or card headers).

```css
.truncate-single {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%; /* Or fixed width / max-width */
}

```

* **Pros:** Extremely lightweight, natively fluid on screen resize.
* **Cons:** Strictly limited to 1 line. If `white-space: nowrap` is missing, it fails silently.

---

### 2. Multi-Line CSS: `-webkit-line-clamp`

Originally a WebKit extension, `-webkit-line-clamp` is now part of the modern CSS standard and supported across all modern browsers. It allows you to truncate text after a specific number of lines.

```css
.truncate-multi {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Truncate after 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

```

* **Pros:** Seamless multi-line truncation without calculating character lengths. Automatically recalculates lines if container width changes or orientation switches on mobile devices.
* **Cons:** Cuts text visually right at the container boundary, which often slices mid-word (e.g., `"Javascripting"` becomes `"Javascr..."`).

---

### 3. JavaScript String Truncation (e.g., `Intl.Segmenter`)

JavaScript truncation physically cuts the string before inserting it into the DOM.

```javascript
const truncateWord = (str, limit) => {
  const segmenter = new Intl.Segmenter("en", { granularity: "word" });
  let cut = limit;
  for (const seg of segmenter.segment(str)) {
    if (seg.index > limit) break;
    if (seg.isWordLike) cut = seg.index + seg.segment.length;
  }
  return str.slice(0, cut) + "...";
};

```

* **Pros:**
* **Linguistic precision:** Can respect word boundaries, sentences, emojis, and non-Latin locales.
* **Custom UI triggers:** Allows embedding interactive inline elements at the cut point (e.g., `"... <a href="#">Read More</a>"`).

* **Cons:**
* **Layout unawareness:** JS operates on character count, not visual pixels. 50 capital `"W"`s take up twice as much layout width as 50 lowercase `"i"`s (`"WWWW"` vs `"iiii"`), making character-count limits unreliable for responsive layouts.

---

### Best Practices Strategy

1. **Default to CSS (`-webkit-line-clamp` / `text-overflow`)** for standard card descriptions, titles, and UI lists. CSS handles responsive window resizes and keeps full content readable for search engines and screen readers.
2. **Use JavaScript Truncation** when:

* You need strict word or sentence boundary truncation (`Intl.Segmenter`).
* You are rendering thousands of DOM elements where rendering full strings inside hidden CSS overflow containers creates noticeable DOM memory bloat.
* You need custom appended elements like an inline `"Show More"` toggle button directly attached to the ellipsis.
