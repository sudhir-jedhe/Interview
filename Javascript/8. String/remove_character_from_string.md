Here is a code review of your snippets, pointing out a bug in the last example and providing modern, robust alternatives.

---

### Snippet Breakdown & Fixes

#### 1. Remove All Occurrences of a Character

```javascript
let str = "Hello World";
let charToRemove = "l";
let output = str.replace(/l/g, ""); // "Heo Word"

```

* **Review:** Works well for hardcoded `'l'`. However, if `charToRemove` is dynamic (a variable), hardcoding `/l/g` won't use the variable.
* **Modern ES2021 Alternative (`replaceAll`):**

```javascript
let str = "Hello World";
let charToRemove = "l";
let output = str.replaceAll(charToRemove, ""); // "Heo Word"

```

---

#### 2. Remove Character at a Specific Index

```javascript
let originalString = "Hello World";
let indexRemove = 3;
let output = originalString.slice(0, indexRemove) + originalString.slice(indexRemove + 1); // "Helo World"

```

* **Review:** **Optimal & Correct.** `slice()` is the standard, zero-dependency way to remove a character by index in JavaScript strings.

---

#### 3. Remove Non-Numeric Characters

```javascript
let originalString = "Hello123World";
let output = originalString.replace(/\D/g, ""); // "123"

```

* **Review:** **Optimal & Correct.** `/\D/g` matches any non-digit character and replaces it with an empty string.

---

#### 4. Replace Character at Index (Critical Bug Fix ⚠️)

In your original code:

```javascript
let originalString = "Hello World";
let indexRemove = 3;
let removedCharacter = originalString.charAt(indexRemove); // 'l'
let output = originalString.replace(removedCharacter, "T"); // "HeTlo World"

```

* **The Bug:** `originalString.replace('l', 'T')` replaces the **first** occurrence of `'l'` found in the string (index 2), **not index 3**!
* **The Fix:** To target the exact index position regardless of duplicate characters, use `slice()`:

```javascript
let originalString = "Hello World";
let indexRemove = 3;
let replacementChar = "T";

let output = 
  originalString.slice(0, indexRemove) + 
  replacementChar + 
  originalString.slice(indexRemove + 1);

console.log(output); // "HelTo World" (Correctly targets index 3!)

```

---

### Summary Reference Table

| Goal                               | Best Practice Code                             |
| ---------------------------------- | ---------------------------------------------- |
| **Remove all occurrences of char** | `str.replaceAll(char, "")`                     |
| **Remove char at index `i**`       | `str.slice(0, i) + str.slice(i + 1)`           |
| **Replace char at index `i**`      | `str.slice(0, i) + newChar + str.slice(i + 1)` |
| **Keep digits only**               | `str.replace(/\D/g, "")`                       |
