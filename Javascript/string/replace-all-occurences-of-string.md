```js
const str = "Hello World";

str.replaceAll("o", "x"); // 'Hellx Wxrld'

/****************************************** */

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replaceAll = (str, subStr, newSubStr) =>
  str.replace(new RegExp(escapeRegExp(subStr), "g"), newSubStr);

const str = "Hello World";

replaceAll(str, "o", "x"); // 'Hellx Wxrld'
```

Your snippets demonstrate the evolution of string replacement in JavaScript: `String.prototype.replaceAll` (introduced in ES2021) and the classic regex-escaped fallback polyfill used prior to ES2021.

Both implementations achieve the same result, but understanding their technical nuances helps when writing cross-platform or legacy code.

---

### Technical Breakdown

#### 1. `String.prototype.replaceAll` (ES2021 Native)

```javascript
const str = "Hello World";
str.replaceAll("o", "x"); // 'Hellx Wxrld'

```

* **How it works:** Replaces all occurrences of the substring directly without needing regular expressions or string escaping.
* **Important Caveat (Global Flag Rule):** If you pass a `RegExp` instance to `.replaceAll()`, it **must** have the global (`g`) flag enabled, or JavaScript will throw a `TypeError`:

```javascript
// ❌ Throws TypeError: String.prototype.replaceAll called with a non-global RegExp
"Hello World".replaceAll(/o/, "x");

// ✅ Works correctly
"Hello World".replaceAll(/o/g, "x");

```

---

#### 2. Regex-Escaped Fallback Function

```javascript
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const replaceAll = (str, subStr, newSubStr) =>
  str.replace(new RegExp(escapeRegExp(subStr), "g"), newSubStr);

```

* **Why `escapeRegExp` is necessary:** If `subStr` contains special regex meta-characters (like `.` or `?`), creating `new RegExp(".")` would match **every character**, not literal dots.
* **What `\\$&` does:** In `replace()`, `$&` represents the matched substring itself. Prepending `\\` escapes special characters (e.g., `.` becomes `\.`).

---

### Alternative: Zero-Regex Polyfill (`split` / `join`)

If you want a zero-regex alternative that works in every JavaScript environment since ES3 (without needing regex escaping):

```javascript
const replaceAllSimple = (str, subStr, newSubStr) =>
  str.split(subStr).join(newSubStr);

console.log(replaceAllSimple("Hello World", "o", "x")); // 'Hellx Wxrld'
console.log(replaceAllSimple("price: $10.00", "$10.00", "$20.00")); // 'price: $20.00'

```

---

### Method Comparison Matrix

| Approach                               | ES Version  | Handles Special Characters (`$`, `.`, `?`) | Performance                        |
| -------------------------------------- | ----------- | ------------------------------------------ | ---------------------------------- |
| **`str.replaceAll()`**                 | **ES2021+** | ✅ Native handling                          | **Fastest** (V8 C++ engine level)  |
| **`new RegExp(escapeRegExp(s), 'g')`** | ES3+        | ✅ Safe via regex escaping                  | Moderate (Regex creation overhead) |
| **`str.split().join()`**               | ES3+        | ✅ Safe (No regex involved)                 | Fast for short strings             |
