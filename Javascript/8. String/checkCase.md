Checking if a string is entirely uppercase or entirely lowercase in JavaScript can be done either by comparing the string to its transformed version or by using regular expressions.

---

### Option 1: Direct String Comparison (Simplest & Most Reliable)

The easiest approach is to compare the string directly against `str.toUpperCase()` or `str.toLowerCase()`.

```javascript
function checkCase(str) {
  // Option A: Check if completely uppercase
  const isAllUpper = str === str.toUpperCase();

  // Option B: Check if completely lowercase
  const isAllLower = str === str.toLowerCase();

  return { isAllUpper, isAllLower };
}

// Examples:
console.log(checkCase("HELLO")); 
// Output: { isAllUpper: true, isAllLower: false }

console.log(checkCase("hello")); 
// Output: { isAllUpper: false, isAllLower: true }

console.log(checkCase("Hello")); 
// Output: { isAllUpper: false, isAllLower: false }

```

> **Note on Numbers/Symbols:** `"HELLO 123!" === "HELLO 123!".toUpperCase()` evaluates to `true` because numbers and punctuation don't have uppercase or lowercase variants.

---

### Option 2: Require at least ONE Letter (Handling Numbers/Symbols)

If you want to ensure the string contains **at least one actual letter** (so that `"123!"` isn't considered "all uppercase"), combine the check with a letter test:

```javascript
function isStrictlyUppercase(str) {
  // Must contain at least one letter and have no lowercase letters
  const hasLetters = /[a-zA-Z]/.test(str);
  return hasLetters && str === str.toUpperCase();
}

function isStrictlyLowercase(str) {
  // Must contain at least one letter and have no uppercase letters
  const hasLetters = /[a-zA-Z]/.test(str);
  return hasLetters && str === str.toLowerCase();
}

console.log(isStrictlyUppercase("HELLO 123")); // true
console.log(isStrictlyUppercase("123!"));      // false (no letters)

```

---

### Option 3: Regex Test (Letters-Only Check)

If you want to check that a string consists **only** of letters and is entirely in one case (no spaces or numbers allowed):

```javascript
// Check if string contains ONLY uppercase letters (A-Z)
const isOnlyUpper = (str) => /^[A-Z]+$/.test(str);

// Check if string contains ONLY lowercase letters (a-z)
const isOnlyLower = (str) => /^[a-z]+$/.test(str);

console.log(isOnlyUpper("HELLO"));    // true
console.log(isOnlyUpper("HELLO 123"));// false (contains space and numbers)

```

---

### Option 4: International / Accented Letters Support (Unicode)

If your text includes accented characters (like `É`, `Ç`, or `ñ`), use Unicode property escapes in Regex:

```javascript
// Matches if there are letters and NONE are lowercase
const isUnicodeUpper = (str) => /\p{Lu}/u.test(str) && !/\p{Ll}/u.test(str);

// Matches if there are letters and NONE are uppercase
const isUnicodeLower = (str) => /\p{Ll}/u.test(str) && !/\p{Lu}/u.test(str);

console.log(isUnicodeUpper("NOËL")); // true
console.log(isUnicodeLower("café")); // true

```

---

### Summary Checklist

| Requirement                                | Best Approach                                         |
| ------------------------------------------ | ----------------------------------------------------- |
| Quick check (ignores numbers/symbols)      | `str === str.toUpperCase()`                           |
| Must have letters, ignores numbers/symbols | `/[a-zA-Z]/.test(str) && str === str.toUpperCase()`   |
| Strictly letters only (no spaces/numbers)  | `/^[A-Z]+$/.test(str)`                                |
| Accented/International text support        | `str === str.toUpperCase()` or `\p{Lu}` Unicode regex |
