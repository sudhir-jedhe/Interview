```js
export const removeVowels = (str) => {
  const vowels = ["a", "e", "i", "o", "u"];

  const chars = str.split("");

  const filteredChars = chars.filter(
    (char) => !vowels.includes(char.toLowerCase()),
  );

  const result = filteredChars.join("");

  return result;
};

removeVowels("Hello, World!"); // Output: "Hll, Wrld!"
removeVowels("hello world"); // Output: "hll wrld"
removeVowels("programming is fun"); // Output: "prgrmmng s fn"
```

Your array-filtering implementation works correctly, but it has two key areas for improvement: **performance** and **Unicode / Emoji safety**.

---

### 1. Performance: Regular Expression (`replace`)

Converting a string into an array (`split`), filtering every element through `includes`, and joining it back into a string creates unnecessary intermediate arrays in memory.

A single Regular Expression using `replace` runs significantly faster and reduces code to a single line:

```javascript
export const removeVowels = (str) => str.replace(/[aeiou]/gi, "");

// Verification
console.log(removeVowels("Hello, World!")); // "Hll, Wrld!"
console.log(removeVowels("hello world"));    // "hll wrld"
console.log(removeVowels("PROGRAMMING"));   // "PRGRMMNG"

```

* **`[aeiou]`**: Matches any vowel character.
* **`g`**: Global flag (replaces all occurrences, not just the first).
* **`i`**: Case-insensitive flag (handles both lowercase and uppercase vowels).

---

### 2. Unicode & Accented Vowels (Internationalization)

If your application processes multi-language input or accented characters (e.g., `"Café"`, `"Naïve"`, `"Übung"`), `[aeiou]` will miss accented vowels.

You can use **Unicode Property Escapes** (`\p{L}`) combined with string normalization (`NFD`) to decompose and remove vowels with diacritics:

```javascript
/**
 * Removes both standard and accented vowels (e.g., é, ö, à)
 */
export const removeVowelsUnicode = (str) =>
  str
    .normalize("NFD") // Decomposes accented characters (e.g., 'é' -> 'e' + accent mark)
    .replace(/[aeiou\u0300-\u036f]/gi, ""); // Removes vowels and standalone accent marks

console.log(removeVowelsUnicode("Café")); // "Cf"
console.log(removeVowelsUnicode("Übung")); // "bng"

```

---

### Method Comparison

| Implementation                            | Time Complexity  | Auxiliary Space      | Handles Uppercase? | Handles Accents (`é`) |
| ----------------------------------------- | ---------------- | -------------------- | ------------------ | --------------------- |
| **`split().filter().join()` (Your Code)** | $\mathcal{O}(N)$ | $\mathcal{O}(N)$     | ✅ Yes              | ❌ No                  |
| **Regex (`/[aeiou]/gi`)**                 | $\mathcal{O}(N)$ | **$\mathcal{O}(1)$** | ✅ Yes              | ❌ No                  |
| **Unicode Decomposed Regex**              | $\mathcal{O}(N)$ | **$\mathcal{O}(1)$** | ✅ Yes              | ✅ **Yes**             |
