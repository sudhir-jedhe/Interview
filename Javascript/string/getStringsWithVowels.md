```js
getStringsWithVowels(["apple", "banana", "orange", "pear"]); // Output: ['apple', 'orange']
getStringsWithVowels(["Elephant", "Zebra", "Ostrich", "Umbrella"]); // Output: ['Elephant', 'Umbrella']
getStringsWithVowels(["cat", "dog", "elephant", "pig"]); // Output: ['elephant']
getStringsWithVowels([]); // Output: []

export const getStringsWithVowels = (array) => {
  const vowels = ["a", "e", "i", "o", "u"];
  return array.filter((string) => {
    return vowels.includes(string.charAt(0).toLowerCase());
  });
};
```

Your implementation for `getStringsWithVowels` is clean, functional, and correctly filters array strings that start with a vowel.

Here are two slight refinements to consider for performance, readability, and edge-case handling:

---

### 1. Using a `Set` or Regular Expression

For checking vowels, a **Regular Expression** or a **`Set`** offers clean alternatives:

#### Regex Approach (Concise & Readable)

```javascript
export const getStringsWithVowels = (array) => {
  if (!Array.isArray(array)) return [];
  return array.filter((str) => str && /^[aeiou]/i.test(str));
};

```

* `/^[aeiou]/i` matches any string that starts (`^`) with a vowel, case-insensitively (`i` flag).
* `str &&` safely skips empty strings (`""`), `null`, or `undefined` elements.

#### Set Approach ($O(1)$ Lookup)

```javascript
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export const getStringsWithVowels = (array) => {
  if (!Array.isArray(array)) return [];
  return array.filter((str) => str && VOWELS.has(str[0].toLowerCase()));
};

```

---

### Edge-Case Handling Comparison

| Input                 | Original Code       | Refactored (Regex) | Reason                                                     |
| --------------------- | ------------------- | ------------------ | ---------------------------------------------------------- |
| **`["apple", ""]`**   | `["apple"]`         | `["apple"]`        | `"".charAt(0)` returns `""`, which is not in `vowels`.     |
| **`["apple", null]`** | Error (`TypeError`) | `["apple"]`        | Safe check prevents runtime crash on `null`/`undefined`.   |
| **`"notAnArray"`**    | Error (`TypeError`) | `[]`               | `Array.isArray()` guard handles invalid inputs gracefully. |

---

### Benchmark / Performance

All three approaches (`.includes()`, `Set.has()`, and `RegExp.test()`) run in **$\mathcal{O}(N)$ time complexity** where $N$ is the number of items in the array. For array filtering tasks, the Regex approach is both idiomatic and highly performant in modern JavaScript engines.
