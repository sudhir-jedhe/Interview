```js
/****************************How to implement String.prototype.repeat********************* */
String.prototype.myRepeat = function (count) {
  if (typeof count !== "number" || count < 0) {
    throw new Error("Count must be a non-negative number.");
  }

  let repeatedString = "";

  for (let i = 0; i < count; i++) {
    repeatedString += this;
  }

  return repeatedString;
};

// Example usage:
const originalString = "Hello, ";
const repeatedString = originalString.myRepeat(3);

console.log(repeatedString);
// Output: 'Hello, Hello, Hello, '
```

Your custom polyfill for `String.prototype.repeat` is clear and straightforward! However, to strictly align with the [ECMAScript Specification for `String.prototype.repeat](https://www.google.com/search?q=https://tc39.es/ecma262/%23sec-string.prototype.repeat)`, there are **three key area adjustments** needed:

1. **Range & Type Error Handling:** The spec throws a `RangeError` (not a general `Error`) for negative counts or `Infinity`, and converts floating-point numbers to integers by truncating them (`Math.floor`).
2. **Infinite Count Check:** `count = Infinity` or numbers $\ge 2^{31} - 1$ (exceeding maximum string length) should throw a `RangeError`.
3. **Logarithmic Performance Optimization:** A simple `for` loop takes $\mathcal{O}(N)$ string concatenations. Using **Exponentiation by Squaring** (doubling the string length per iteration) improves execution speed to $\mathcal{O}(\log N)$ time, which is critical when duplicating large strings thousands of times.

---

### Spec-Compliant & Optimized Implementation

```javascript
String.prototype.myRepeat = function (count) {
  // 1. Guard against null or undefined context
  if (this == null) {
    throw new TypeError("String.prototype.myRepeat called on null or undefined");
  }

  // 2. Coerce target to string
  const str = String(this);

  // 3. Convert count to number
  let n = Number(count);

  // 4. Spec checks: Throw RangeError for negative numbers or Infinity
  if (n < 0 || n === Infinity) {
    throw new RangeError("Invalid count value");
  }

  // NaN becomes 0
  if (Number.isNaN(n)) {
    n = 0;
  }

  // Truncate floating-point numbers (e.g., 2.9 -> 2)
  n = Math.floor(n);

  if (n === 0 || str.length === 0) {
    return "";
  }

  // Check maximum allowed string length (~1GB in V8)
  if (str.length * n >= 1 << 28) {
    throw new RangeError("Invalid count value: string length exceeds maximum size");
  }

  // 5. Binary Exponentiation Algorithm - O(log N) performance
  let result = "";
  let pattern = str;

  while (n > 0) {
    if (n & 1) { // If lowest bit is 1, append current pattern
      result += pattern;
    }
    n >>= 1; // Bitwise right shift (divide by 2)
    if (n > 0) {
      pattern += pattern; // Double the pattern length
    }
  }

  return result;
};

// --- Test Cases ---
console.log("abc".myRepeat(3));     // "abcabcabc"
console.log("abc".myRepeat(2.8));   // "abcabc" (Truncated 2.8 to 2)
console.log("abc".myRepeat(0));     // ""

try {
  "abc".myRepeat(-1);
} catch (e) {
  console.error(e); // RangeError: Invalid count value
}

```

---

### Benchmark & Performance Difference

| Method                           | Time Complexity           | String Reallocations for `count = 1,000,000` |
| -------------------------------- | ------------------------- | -------------------------------------------- |
| **Simple `for` loop**            | $\mathcal{O}(N)$          | $1,000,000$ operations                       |
| **Binary Squaring (`myRepeat`)** | **$\mathcal{O}(\log N)$** | **~20 operations**                           |

Here are the spec-compliant polyfills for both `String.prototype.trim` and `String.prototype.padStart`, matching the exact ECMAScript requirements (including coercion, error handling, and Unicode support).

---

### 1. `String.prototype.trim` Polyfill

According to the [ECMAScript spec for `String.prototype.trim](https://www.google.com/search?q=https://tc39.es/ecma262/%23sec-string.prototype.trim)`, trimming must remove all whitespace characters matching the `White_Space` Unicode property, as well as line terminators (`\r`, `\n`, `\u2028`, `\u2029`).

#### Polyfill Implementation

```javascript
if (!String.prototype.myTrim) {
  String.prototype.myTrim = function () {
    // 1. Guard against null or undefined context (RequireObjectCoercible)
    if (this == null) {
      throw new TypeError("String.prototype.trim called on null or undefined");
    }

    // 2. Coerce target to a String
    const str = String(this);

    // 3. Match all ECMAScript Unicode whitespace and line terminators
    // Includes ASCII spaces, tabs, non-breaking spaces (\u00A0), 
    // BOM (\uFEFF), and line/paragraph separators (\u2028, \u2029).
    const whiteSpacePattern = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    return str.replace(whiteSpacePattern, "");
  };
}

// Verification:
console.log("   Hello World   ".myTrim());      // "Hello World"
console.log("\n\t\uFEFF Hello World \u2028".myTrim()); // "Hello World"

```

---

### 2. `String.prototype.padStart` Polyfill

The [ECMAScript spec for `String.prototype.padStart](https://www.google.com/search?q=https://tc39.es/ecma262/%23sec-string.prototype.padstart)` defines specific rules for target length coercion, default fill strings, and truncation:

1. If `maxLength` is less than or equal to string length, return the original string.
2. If `fillString` is empty (`""`), return the original string.
3. Truncate `fillString` if the required pad length is not an exact multiple of `fillString.length`.

#### Polyfill Implementation

```javascript
if (!String.prototype.myPadStart) {
  String.prototype.myPadStart = function (maxLength, fillString) {
    // 1. RequireObjectCoercible (check null/undefined)
    if (this == null) {
      throw new TypeError("String.prototype.padStart called on null or undefined");
    }

    // 2. Coerce context to String
    const str = String(this);

    // 3. Coerce maxLength to integer (ToLength)
    const intMaxLength = Math.floor(Number(maxLength)) || 0;

    const stringLength = str.length;

    // 4. Return early if target length is already met or exceeded
    if (intMaxLength <= stringLength) {
      return str;
    }

    // 5. Default fillString to space (" ") if undefined
    let filler = fillString === undefined ? " " : String(fillString);

    // 6. If fillString is empty, return original string
    if (filler === "") {
      return str;
    }

    // 7. Calculate exact fill length required
    const fillLength = intMaxLength - stringLength;

    // 8. Repeat filler and truncate remaining overflow
    while (filler.length < fillLength) {
      filler += filler; // Exponential string duplication O(log N)
    }

    const truncatedFiller = filler.slice(0, fillLength);

    // 9. Concatenate truncated filler + original string
    return truncatedFiller + str;
  };
}

// Verification:
console.log("5".myPadStart(3, "0"));        // "005"
console.log("hello".myPadStart(10, "123"));  // "12312hello" (Truncates filler)
console.log("abc".myPadStart(2, "*"));       // "abc" (Target length < string length)
console.log("abc".myPadStart(6));            // "   abc" (Defaults to space)

```

---

### Key ECMAScript Edge Cases Handled

| Requirement                 | Spec Behavior Handled in Polyfill                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **`this` context**          | Throws `TypeError` if invoked on `null` or `undefined` (e.g., `String.prototype.padStart.call(null)`).                                         |
| **Coercion**                | Converts non-string targets (e.g., numbers, booleans) to primitive strings via `String(this)`.                                                 |
| **Floating Points**         | `maxLength = 5.9` is truncated to `5` via `Math.floor`.                                                                                        |
| **`fillString` Truncation** | If padding length is `5` and `fillString` is `"123"`, repeats to `"123123"` and truncates to `"12312"`.                                        |
| **Performance**             | `padStart` uses exponential string duplication (`filler += filler`) inside the while loop instead of linear $O(N)$ single-character additions. |
