/\*
The toUpperCase() method returns the value of the string converted to uppercase.
This method does not affect the value of the string itself since JavaScript strings are immutable.

MDN Link: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase>

Characters from A-Z have ASCII code from 65 - 90.
And characters from a-z have ASCII code from 97-122.
We're checking this condition to implement this function.

```js
*/
String.prototype.toUpperCase = function myToUpperCase() {
let upperCaseString = "";
for (let i = 0; i < this.length; i += 1) {
  const character = this[i];
  const charCode = character.charCodeAt();
  if (charCode >= 97 && charCode <= 122) {
    upperCaseString += String.fromCharCode(charCode - 32);
  } else {
    upperCaseString += character;
  }
}
return upperCaseString;
};

let vowels = ["A", "E", "I", "O", "U"];
let str = "LeaRNeRSBuCKeT iS THe BeST WeBSiTe To LeaRN PRoGRaMMiNG";
let temp = "";
for (let chars of str) {
if (vowels.includes(chars)) {
  temp += chars.toUpperCase();
} else {
  temp += chars;
}
}

console.log(temp);
//"LEARNERSBUCKET IS THE BEST WEBSITE TO LEARN PROGRAMMING"

let str = "eXAMPLE";
let temp = str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
console.log(temp);
//EXAMPLE

let str = "a(b)cdef{1}g2hi3gk%!78l";
let temp = "";
for (let chars of str) {
//Get the ascii value of character
let value = chars.charCodeAt();

//If the character is in uppercase
if (value >= 97 && value <= 122) {
  //convert it to lowercase
  temp += String.fromCharCode(value - 32);
} else {
  //else add the original character
  temp += chars;
}
}

console.log(temp);
//"A(B)CDEF{1}G2HI3GK%!78L"
```

Your custom ASCII conversion logic using `charCode - 32` effectively demonstrates how lowercase letters `a-z` (`97-122`) map to uppercase `A-Z` (`65-90`) at the byte level.

However, just like with the lowercase implementation, there are a few **syntax bugs**, **prototype pollution issues**, and **comment errors** in this snippet to be aware of.

---

### Critical Callouts & Fixes

#### 1. Misleading Comment

In the third example's loop comments:

```javascript
//If the character is in uppercase
if (value >= 97 && value <= 122) {
  //convert it to lowercase
  temp += String.fromCharCode(value - 32);
}

```

* **Correction:** `97-122` corresponds to **lowercase** characters, and subtracting 32 converts them to **uppercase**. The comment states the exact opposite.

#### 2. Re-declaration Errors (`let str`)

Declaring `let str` multiple times in the same scope will throw a runtime error:
`SyntaxError: Identifier 'str' has already been declared`

#### 3. Prototype Pollution & Unicode Limits

* Overriding `String.prototype.toUpperCase` mutates native behavior globally.
* ASCII subtraction (`- 32`) only works for standard English letters (`a-z`). It skips accented letters like `é` (`\u00E9`) or German `ß` (where `ß.toUpperCase()` becomes `"SS"` in Unicode standard).

---

### Refactored & Safe Implementation

Here is a standalone helper version without prototype mutation, fixing the variable redeclarations and comments:

```javascript
/**
 * Custom ASCII uppercase conversion function.
 */
function toASCIIUpperCase(str) {
  let upperCaseString = "";

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // ASCII 'a' (97) through 'z' (122)
    if (code >= 97 && code <= 122) {
      upperCaseString += String.fromCharCode(code - 32);
    } else {
      upperCaseString += str[i];
    }
  }

  return upperCaseString;
}

// Example 1: Ensure vowels in string are uppercase
const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);
let text1 = "LeaRNeRSBuCKeT iS THe BeST WeBSiTe To LeaRN PRoGRaMMiNG";
let uppercaseVowels = "";

for (const char of text1) {
  uppercaseVowels += vowels.has(char) ? toASCIIUpperCase(char) : char;
}

console.log(uppercaseVowels);
// Output: "LEARNERSBUCKET IS THE BEST WEBSITE TO LEARN PROGRAMMING"

// Example 2: Capitalize first letter (capitalize First)
let text2 = "eXAMPLE";
let capitalized = text2.charAt(0).toUpperCase() + text2.slice(1);
console.log(capitalized);
// Output: "EXAMPLE"

// Example 3: Convert full mixed string
let text3 = "a(b)cdef{1}g2hi3gk%!78l";
console.log(toASCIIUpperCase(text3));
// Output: "A(B)CDEF{1}G2HI3GK%!78L"

```

---

### Special Case: German Eszett (`ß`) & Unicode

In JavaScript's native `toUpperCase()`, converting certain characters can actually **increase the length of the string**:

```javascript
const GermanEszett = "straße";

// Native Unicode conversion
console.log(GermanEszett.toUpperCase()); 
// Output: "STRASSE" (Length increases from 6 to 7!)

// Custom ASCII - 32 conversion fails
console.log(toASCIIUpperCase(GermanEszett)); 
// Output: "straße" (Unchanged, because 'ß' charCode is 223, > 122)

```

`String.prototype.toLocaleUpperCase()` relies on the Unicode Standard and language-specific locale data (ICU/CLDR) to handle casing rules where simple ASCII offset arithmetic ($- 32$) or default English casing yields incorrect results.

The Turkish dotted/dotless **I** is the most famous example of this language-specific behavior.

---

### 1. The Turkish "I" Problem

In English:

* Lowercase `i` $\rightarrow$ Uppercase `I`
* Lowercase `ı` (dotless i) $\rightarrow$ Non-standard / Unchanged

In Turkish (and Azerbaijani):
The language has **two distinct versions of the letter I**, with and without dots:

1. **Dotted I:** `i` (lowercase) $\longleftrightarrow$ `İ` (uppercase, U+0130 "Latin Capital Letter I with Dot Above")
2. **Dotless I:** `ı` (lowercase, U+0131) $\longleftrightarrow$ `I` (uppercase, standard ASCII U+0049)

If you use standard `.toUpperCase()` on Turkish text, the lowercase dotted `i` becomes a dotless `I`, changing the word's pronunciation or meaning completely.

---

### 2. Code Comparison

```javascript
const turkishWord = "istanbul";

// ❌ Standard toUpperCase() uses default Latin rules
console.log(turkishWord.toUpperCase()); 
// Output: "ISTANBUL" (Incorrect in Turkish - lost the dot on 'İ')

// ✅ toLocaleUpperCase('tr-TR') applies Turkish-specific locale mappings
console.log(turkishWord.toLocaleUpperCase("tr-TR")); 
// Output: "İSTANBUL" (Correct!)

// Reverse direction (Lowercase)
const upperDotless = "IKINCI";
console.log(upperDotless.toLocaleLowerCase("tr-TR"));
// Output: "ıkıncı" (Preserves dotless 'ı')

```

---

### 3. Other Notable Locale-Specific Casing Rules

The Turkish `I` isn't the only special case handled by `toLocaleUpperCase()`:

#### A. German Sharp S (`ß`)

* In standard German casing, lowercase `ß` (Eszett) converts to two capital letters: `"SS"`.
* Modern Unicode also supports uppercase capital `ẞ` (U+01E9), but standard locale mapping converts `"straße"` $\rightarrow$ `"STRASSE"`.

```javascript
console.log("straße".toLocaleUpperCase("de-DE")); 
// Output: "STRASSE"

```

#### B. Greek Final Sigma (`σ` vs `ς`)

In Greek, the lowercase letter sigma has two forms: `σ` (in the middle of a word) and `ς` (at the end of a word). Both convert to the single capital `Σ`:

```javascript
console.log("μάρκος".toLocaleUpperCase("el-GR")); 
// Output: "ΜΑΡΚΟΣ"

```

#### C. Lithuanian Combining Dot Accent

In Lithuanian, when a lowercase `i` has an accent above it (like `ì`), converting to uppercase removes the combining dot beneath the accent so the capital letter doesn't end up with both a dot and an accent mark.

---

### 4. How `toLocaleUpperCase()` Determines the Locale

When you call `str.toLocaleUpperCase(locale)`:

1. **Explicit Locale:** If you pass a BCP 47 language tag (e.g., `'tr'`, `'tr-TR'`, `'az'`), the JS engine uses that specific locale's casing tables.
2. **Implicit Host Locale:** If no argument is passed (`str.toLocaleUpperCase()`), it automatically detects and uses the user's current environment/operating system locale settings.

```javascript
// Uses system/browser environment locale automatically:
const result = "istanbul".toLocaleUpperCase(); 

```

---

### Best Practice

Whenever your application processes user-generated text or internationalized content where language context matters (such as search queries, sorting, or user names), always pass the user's active locale tag to `toLocaleUpperCase(userLocale)`.

`String.prototype.normalize()` solves a fundamental problem in Unicode text handling: **canonical equivalence**.

In Unicode, the exact same visual character can often be represented in memory in multiple ways. `normalize()` converts strings into a unified, standard Unicode representation so that comparisons, searches, and string operations behave consistently.

---

### The Problem: Dual Unicode Representations

Take the accented character **`é`**. Unicode can represent it in two distinct ways:

1. **Precomposed Character (Single Code Point):**
`"é"` $\rightarrow$ `\u00E9` (1 code point, `length === 1`)
2. **Decomposed Sequence (Base Character + Combining Diacritic):**
`"e"` + `"\u0301"` (Combining Acute Accent) $\rightarrow$ `\u0065\u0301` (2 code points, `length === 2`)

Visually, they look identical (`é` vs `é`). However, raw JavaScript equality checks (`===`) will fail because their underlying code points differ:

```javascript
const str1 = "café"; // Precomposed (\u00E9)
const str2 = "cafe\u0301"; // Decomposed (e + \u0301)

console.log(str1 === str2); // false! ❌
console.log(str1.length);   // 4
console.log(str2.length);   // 5

```

---

### The Solution: Unicode Normalization Forms

`String.prototype.normalize(form)` accepts one of four standard Unicode normalization forms:

```javascript
// Normalizing both strings to NFC makes them strictly equal
console.log(str1.normalize() === str2.normalize()); // true! ✅

```

#### The 4 Normalization Forms

| Form         | Name                              | What It Does                                                                                                                               | Common Use Case                                                             |
| ------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **`"NFC"`**  | Canonical Composition *(Default)* | Combines base characters and diacritics into single precomposed characters where possible.                                                 | **Standard Web Default.** Best for general display and string comparison.   |
| **`"NFD"`**  | Canonical Decomposition           | Separates precomposed characters into their base character and individual combining marks.                                                 | **Stripping Accents.** Useful when creating search slugs or searching text. |
| **`"NFKC"`** | Compatibility Composition         | Applies compatibility transformations (e.g., converting ligatures `æ` or superscript `²` into standard characters) and then composes them. | **Search Indexing.** Normalizes stylistic variants to plain text.           |
| **`"NFKD"`** | Compatibility Decomposition       | Applies compatibility transformations and fully decomposes characters into base marks.                                                     | Deep text cleanup and search matching.                                      |

---

### Practical Use Cases

#### 1. Stripping Accents / Diacritics (Diacritic Removal)

A classic problem in web development is creating URL slugs or performing accent-insensitive searches (e.g., matching `"cafe"` to `"café"`).

By combining **NFD** decomposition with a Unicode Property Escape regex targeting combining marks (`\p{M}`), you can easily strip accents:

```javascript
/**
 * Strips diacritics and accents from a string.
 */
function removeAccents(str) {
  return str
    .normalize("NFD") // 1. Separate base letters from accents (e.g., 'é' -> 'e' + '\u0301')
    .replace(/\p{M}/gu, ""); // 2. Remove all combining accent marks (\p{M})
}

console.log(removeAccents("Café au lait, s'il vous plaît"));
// Output: "Cafe au lait, s'il vous plait"

console.log(removeAccents("Crème brûlée"));
// Output: "Creme brulee"

```

---

#### 2. Accent-Insensitive Search Matching

```javascript
function searchMatch(query, text) {
  const cleanQuery = removeAccents(query).toLowerCase();
  const cleanText = removeAccents(text).toLowerCase();
  
  return cleanText.includes(cleanQuery);
}

console.log(searchMatch("cafe", "Welcome to our Café!")); // true ✅

```

---

#### 3. Handling Ligatures and Formatting Variants (NFKC)

`NFKC` / `NFKD` normalize stylistic character variants (such as full-width characters, fractions, or superscripts) into standard ASCII equivalents:

```javascript
// Superscripts & Fractions
const fancyText = "x² ⅓";

console.log(fancyText.normalize("NFKC")); 
// Output: "x2 1⁄3" (Converts superscript '²' to standard '2')

// Full-width East Asian Latin characters
const fullWidth = "Ｈｅｌｌｏ";

console.log(fullWidth.normalize("NFKC")); 
// Output: "Hello"

```

---

### Summary Checklist

* Always normalize user inputs using `.normalize("NFC")` before storing or comparing strings in databases to prevent duplicate entries caused by encoding differences.
* Use `.normalize("NFD")` + `replace(/\p{M}/gu, '')` whenever you need to strip accents or convert titles into search-friendly URL slugs.
