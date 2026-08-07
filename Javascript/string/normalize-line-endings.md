Historically, different operating systems have used different characters to represent line endings in text files. For example, Windows uses '\r\n' (carriage return + line feed), Unix-like systems use '\n' (line feed), and older Mac systems used '\r' (carriage return). All of these differences can cause issues when working with text files or strings.

Normalization is the process of converting all line endings in a string to a consistent format. Often, you'll want to convert all line endings to a specific format, such as '\r\n' or '\n'.

Luckily, all you need to do is use String.prototype.replace() with a regular expression to match and replace line endings. As the sequences of characters are known and ordered consistently, you need only check for an optional carriage return (\r?) followed by a line feed (\n).

```js
const normalizeLineEndings = (str, normalized = "\n") =>
  str.replace(/\r?\n/g, normalized);

normalizeLineEndings("This\r\nis a\nmultiline\nstring.\r\n");
// 'This\nis a\nmultiline\nstring.\n'

normalizeLineEndings("This\r\nis a\nmultiline\nstring.\r\n", "\r\n");
// 'This\r\nis a\r\nmultiline\r\nstring.\r\n'
```

As the much older Mac systems are no longer in common use, you can safely ignore the standalone carriage return (\r) character in most cases. However, if you need to support these systems, you can modify the regular expression to include it: /\r?\n|\r/g.

Your regex `/\r?\n/g` is the standard, pragmatic choice for almost all modern text normalization because standalone `\r` (Classic Mac OS 9 and earlier) hasn't been used since the early 2000s.

However, if you do need to handle legacy systems, or if you want your function to handle every possible line-ending scenario reliably, there are **two edge cases** in line-ending regex patterns worth noting.

---

### Edge Case 1: The Standalone `\r` Order Trap

When adding support for classic Mac OS `\r`, the order of your alternation branch matters:

* **Correct Pattern:** `/\r\n|\r|\n/g` or `/\r?\n|\r/g`
* **Broken Pattern:** `/\r|\r\n|\n/g`

If `\r` comes first without `\n`, the regex engine will greedily match the `\r` inside a Windows `\r\n` sequence first, turning a single `\r\n` line ending into **two** line endings (`\n\n` or `\r\n\r\n`).

```javascript
// DON'T DO THIS:
const badNormalize = (str, normalized = "\n") => str.replace(/\r|\r\n|\n/g, normalized);
console.log(JSON.stringify(badNormalize("Line 1\r\nLine 2"))); 
// Output: "Line 1\n\nLine 2" (Duplicates line breaks!)

```

---

### Edge Case 2: Unicode Line & Paragraph Separators

In modern web applications handling copy-pasted text from rich editors, multi-language documents, or Windows/Unix mixed sources, Unicode defines additional line-break characters:

* `\u2028` (Line Separator)
* `\u2029` (Paragraph Separator)

If you want a **bulletproof cross-platform normalizer**, you can match all newline variations seamlessly:

```javascript
/**
 * Completely normalizes all line endings (CRLF, LF, CR, and Unicode separators)
 * @param {string} str - Input text
 * @param {string} normalized - Target line ending sequence (default '\n')
 * @return {string}
 */
const normalizeLineEndingsStrict = (str, normalized = "\n") =>
  str.replace(/\r\n|\r|\n|\u2028|\u2029/g, normalized);

// Verification
const mixedText = "Windows\r\nUnix\nClassic Mac\rUnicode\u2028End";

console.log(JSON.stringify(normalizeLineEndingsStrict(mixedText, "\n")));
// Output: "Windows\nUnix\nClassic Mac\nUnicode\nEnd"

console.log(JSON.stringify(normalizeLineEndingsStrict(mixedText, "\r\n")));
// Output: "Windows\r\nUnix\r\nClassic Mac\r\nUnicode\r\nEnd"

```

---

### Summary Checklist for Line Ending Regex Patterns

| Pattern        | Supported Line Endings        | Best Used For                                   |
| -------------- | ----------------------------- | ----------------------------------------------- |
| **`/\r?\n/g`** | Windows (`\r\n`), Unix (`\n`) | Modern web & server applications (Your snippet) |
| **`/\r\n       | \r                            | \n/g`**                                         | Windows, Unix, Classic Mac (`\r`) | Legacy text file processors |
| **`/\r\n       | \r                            | \n                                              | \u2028                            | \u2029/g`**                 | All above + Unicode line/paragraph separators | Text editors & Rich Text/Clipboard normalization |
