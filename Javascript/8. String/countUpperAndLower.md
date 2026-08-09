Here are three clear ways to count uppercase versus lowercase letters in a JavaScript string.

---

### Option 1: Using Regular Expressions (`match`) — Cleanest & Fastest

The `match()` method paired with regex is the most concise way to pull out and count matching letters.

```javascript
function countUpperAndLower(str) {
  // [A-Z] matches uppercase letters, [a-z] matches lowercase letters
  const upper = str.match(/[A-Z]/g) || [];
  const lower = str.match(/[a-z]/g) || [];

  return {
    uppercaseCount: upper.length,
    lowercaseCount: lower.length
  };
}

// Example usage:
const text = "Hello World! 123";
console.log(countUpperAndLower(text));
// Output: { uppercaseCount: 2, lowercaseCount: 8 }

```

---

### Option 2: Using a `for...of` Loop — Single-Pass Check

If you want to iterate through the string in a single pass without creating intermediate arrays:

```javascript
function countUpperAndLowerLoop(str) {
  let uppercaseCount = 0;
  let lowercaseCount = 0;

  for (const char of str) {
    if (char >= 'A' && char <= 'Z') {
      uppercaseCount++;
    } else if (char >= 'a' && char <= 'z') {
      lowercaseCount++;
    }
  }

  return { uppercaseCount, lowercaseCount };
}

// Example usage:
const text = "JavaScript ES6";
console.log(countUpperAndLowerLoop(text));
// Output: { uppercaseCount: 3, lowercaseCount: 9 }

```

---

### Option 3: Supporting Non-English Unicode Letters (Accents, International Alphabets)

Standard `[A-Z]` and `[a-z]` regex only check ASCII English letters. If your string includes letters like `É`, `ñ`, `ü`, or `Ç`, use Unicode property escapes (`\p{Lu}` for uppercase and `\p{Ll}` for lowercase):

```javascript
function countUnicodeUpperLower(str) {
  // \p{Lu} matches uppercase Unicode letters
  // \p{Ll} matches lowercase Unicode letters
  const upper = str.match(/\p{Lu}/gu) || [];
  const lower = str.match(/\p{Ll}/gu) || [];

  return {
    uppercaseCount: upper.length,
    lowercaseCount: lower.length
  };
}

// Example usage:
const text = "Café & NOËL 123";
console.log(countUnicodeUpperLower(text));
// Output: { uppercaseCount: 5, lowercaseCount: 3 }

```

---

### Summary Comparison

| Method                             | ASCII Letters (`A-Z`, `a-z`) | Accented / International Letters (`É`, `ñ`) | Performance                        |
| ---------------------------------- | ---------------------------- | ------------------------------------------- | ---------------------------------- |
| **Option 1 (`match`)**             | Yes                          | No                                          | Fast & Readable                    |
| **Option 2 (`for...of`)**          | Yes                          | No                                          | Lowest Memory Allocation           |
| **Option 3 (`\p{Lu}` / `\p{Ll}`)** | Yes                          | Yes                                         | Best for Global/International Text |
