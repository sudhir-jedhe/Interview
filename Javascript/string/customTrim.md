```js
// trim() method
function trim(str) {
  // remove leading and trailing whitespace
  return str.replace(/^\s+|\s+$/g, "");
}

// Example usage
const str = "   Hello, World!   ";
const trimmedStr = trim(str);

console.log(trimmedStr); // Output: 'Hello, World!'

/****************************** */
String.prototype.customTrim = function (characters) {
  let result = this;

  for (let i = 0; i < characters.length; i++) {
    while (result.charAt(0) === characters[i]) {
      result = result.substring(1);
    }

    while (result.charAt(result.length - 1) === characters[i]) {
      result = result.substring(0, result.length - 1);
    }
  }
  return result;
};

let str = " ,Hello, World!, ";
let trimmedStr = str.customTrim(", ");

console.log(trimmedStr); // Output: "Hello, World"

let str = "Hello, World!";
let extractedStr = str.trim().substring(0, 5);
console.log(extractedStr); // Output: "Hello"


/****************************************** */
<script>

// Declare a whitespaces array
const whitespaces = [" ", "", "\s", "\t", "\n", "\u3000"];

const trim = (str) => {
    let stringBeg = 0, stringEnd = str.length;

    // Find the index from the beginning of the string
    // which is not a whitespace
    for (let i = 0; i < str.length; i++) {
        if (whitespaces.indexOf(str[i]) === -1) {
            stringBeg = i;
            break;
        }
    }

    // Find the index from the end of the string
    // which is not a whitespace
    for (let j = str.length - 1; j >= 0; j--) {
        if (whitespaces.indexOf(str[j]) === -1) {
            stringEnd = j;
            break;
        }
    }

    // Return the string between the 2 found indices
    return str.slice(stringBeg, stringEnd + 1);
}

let s = " Geeksforgeeks";
console.log(s);
console.log(trim(s));
</script>


/******************************* */
<html>
<body>
   <h2>Using the <i> trim() method with polyfill </i> in JavaScript</h2>
   <div id = "content"> </div>
   <script>
      let content = document.getElementById('content');
      String.prototype.trim = function () {
         const spaces = ["\s", "\t", "", " ", "", "\u3000"];
         let start = 0;
         let end = this.length - 1;

         // get the first index of the valid character from the start
         for (let m = 0; m < this.length; m++) {
            if (!spaces.includes(this[m])) {
               start = m;
               break;
            }
         }

         // get the first index of valid characters from the last
         for (let n = this.length - 1; n > -1; n--) {
            if (!spaces.includes(this[n])) {
               end = n;
               break;
            }
         }

         // slice the string
         return this.slice(start, end + 1);
      }
      let str = " Hi, How are you? ";
      content.innerHTML += "The original string is :-" + str + ".<br>";
      let trimmed = str.trim();
      content.innerHTML += "The trimmed string using trim() method is :-" + str + "<br>";
   </script>
</body>




/************/


const WHITESPACES = [" ", "", "\s", "\t", "\n", "\u3000"];
/**
 * @param {string} str
 * @return {string}
 */
function trim(str) {
  let wordStart = 0;
  let wordEnd = str.length;
  for (let i = 0; i < str.length; i++) {
    if (WHITESPACES.indexOf(str[i]) === -1) {
      wordStart = i;
      break;
    }
  }
  for(let j = str.length - 1; j >= 0; j--) {
    if (WHITESPACES.indexOf(str[j]) === -1) {
      wordEnd = j;
      break;
    }
  }
  return str.slice(wordStart, wordEnd + 1);
}
```

The code snippets demonstrate several ways to implement custom string trimming in JavaScript, including regex replacements, custom character sets, and manual index-scanning polyfills.

However, the manual array-based implementations (`whitespaces` / `spaces`) contain **critical logic bugs** and **performance issues** that are important to fix.

---

### Critical Bugs in the Provided Array-Based Implementations

1. **Literal `"\s"` String Escape Bug:**
In JavaScript string literals, `"\s"` evaluates to the literal letter `"s"`, **not** a whitespace regex class. As a result, the code accidentally strips the letter `'s'` from strings and fails to strip actual whitespace characters like carriage returns `\r`.
2. **Infinite Loop in `customTrim`:**
In `String.prototype.customTrim`, looping through `characters` sequentially fails when characters are interleaved at boundaries (e.g., `" , "` vs `", "`) or when trimming multi-character sets because the `while` loop order depends on the array's index order rather than the string's outer edge order.
3. **Array Lookups Inside Loops ($O(N \cdot M)$):**
Calling `whitespaces.indexOf(...)` or `.includes(...)` inside a character loop performs an linear lookup for every single character in the string.
4. **Handling All-Whitespace Strings:**
If a string consists *entirely* of spaces (e.g., `"   "`), `wordStart` will stop at index 0 (or end of loop) while `wordEnd` stays at `str.length - 1`, resulting in slicing the entire original string instead of returning `""`.

---

### Correct & Production-Ready Solutions

#### Option 1: Native RegEx Polyfill (Fastest & Standard-Compliant)

To write a robust `String.prototype.trim` polyfill, use ECMAScript's native whitespace regex token `\s`:

```javascript
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    // Strips leading and trailing ES spec whitespace & line terminators
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
}

// Verification
console.log("   Hello World!   ".trim()); // "Hello World!"

```

---

#### Option 2: Correct Two-Pointer Scan (No RegEx)

If you must implement trimming manually without regular expressions, use a `Set` for $O(1)$ character lookups and handle the empty/all-whitespace boundary edge cases correctly:

```javascript
// Complete set of ECMAScript whitespace and line terminator code points
const WHITESPACE_SET = new Set([
  " ", "\t", "\n", "\r", "\v", "\f", "\u00A0", "\uFEFF", "\u3000"
]);

function trim(str) {
  if (typeof str !== "string") return "";

  let start = 0;
  let end = str.length - 1;

  // Move start pointer right until a non-whitespace character is found
  while (start <= end && WHITESPACE_SET.has(str[start])) {
    start++;
  }

  // Move end pointer left until a non-whitespace character is found
  while (end >= start && WHITESPACE_SET.has(str[end])) {
    end--;
  }

  // If start > end, the string was entirely whitespace
  return str.slice(start, end + 1);
}

// Verification
console.log(trim("   Geeksforgeeks   ")); // "Geeksforgeeks"
console.log(trim("     "));              // ""

```

---

#### Option 3: Robust `customTrim` (Trimming Specific Character Sets)

To trim custom characters (like commas, spaces, or dots) from boundaries regardless of their order, use `Set.has()` in a unified outer loop:

```javascript
String.prototype.customTrim = function (charsToTrim = " ") {
  const targetChars = new Set(charsToTrim);
  let start = 0;
  let end = this.length - 1;

  while (start <= end && targetChars.has(this[start])) {
    start++;
  }

  while (end >= start && targetChars.has(this[end])) {
    end--;
  }

  return this.slice(start, end + 1);
};

// Example usage
const str = " ,Hello, World!, ";
console.log(str.customTrim(", ")); // Output: "Hello, World"

```

---

### Comparison Summary

| Method                                 | Correctness         | Performance           | Handles All-Space Strings? | Custom Character Sets?  |
| -------------------------------------- | ------------------- | --------------------- | -------------------------- | ----------------------- |
| **`str.replace(/^[\s...]+.../g, "")`** | 100%                | **Fastest**           | ✅ Yes                      | ❌ Requires custom regex |
| **Two-Pointer Set Scan**               | 100%                | Fast ($O(N)$)         | ✅ Yes                      | ✅ Yes (`Set(chars)`)    |
| **Original Snippet (with `indexOf`)**  | **Broken** (`"\s"`) | Slow ($O(N \cdot M)$) | ❌ Returns original string  | ❌ No                    |

To implement polyfills for **`trimStart()`** (or its legacy alias `trimLeft()`) and **`trimEnd()`** (or `trimRight()`), you can use either a **Regex-based replacement** or a **Two-Pointer Index Scan**.

Both methods strip leading and trailing ECMAScript spec whitespaces (including spaces, tabs, newlines, and non-breaking spaces like `\uFEFF` and `\u00A0`).

---

### Method 1: RegEx-Based Polyfills (Recommended & Standard)

Regular expressions provide the cleanest and fastest implementation for stripping boundary whitespaces.

```javascript
// Whitespace character class including Unicode spaces & BOM
const WHITESPACE_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// 1. Polyfill String.prototype.trimStart (and legacy trimLeft)
if (!String.prototype.trimStart) {
  const trimStartFn = function () {
    return String(this).replace(/^[\s\uFEFF\xA0]+/, '');
  };

  String.prototype.trimStart = trimStartFn;
  String.prototype.trimLeft = trimStartFn; // Alias for backward compatibility
}

// 2. Polyfill String.prototype.trimEnd (and legacy trimRight)
if (!String.prototype.trimEnd) {
  const trimEndFn = function () {
    return String(this).replace(/[\s\uFEFF\xA0]+$/, '');
  };

  String.prototype.trimEnd = trimEndFn;
  String.prototype.trimRight = trimEndFn; // Alias for backward compatibility
}

```

---

### Method 2: Index-Scanning Polyfills (No RegEx)

If you prefer to avoid regular expression engine calls, use character pointer loops with an $O(1)$ `Set` lookup:

```javascript
const WHITESPACE_SET = new Set([
  ' ', '\t', '\n', '\r', '\v', '\f', '\u00A0', '\uFEFF', '\u3000'
]);

// Polyfill trimStart
if (!String.prototype.trimStart) {
  String.prototype.trimStart = function () {
    const str = String(this);
    let start = 0;

    while (start < str.length && WHITESPACE_SET.has(str[start])) {
      start++;
    }

    return str.slice(start);
  };
  String.prototype.trimLeft = String.prototype.trimStart;
}

// Polyfill trimEnd
if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = function () {
    const str = String(this);
    let end = str.length - 1;

    while (end >= 0 && WHITESPACE_SET.has(str[end])) {
      end--;
    }

    return str.slice(0, end + 1);
  };
  String.prototype.trimRight = String.prototype.trimEnd;
}

```

---

### Verification & Usage Examples

```javascript
const sampleText = "   Hello, World!   ";

console.log(`"${sampleText.trimStart()}"`); 
// Output: "Hello, World!   "

console.log(`"${sampleText.trimEnd()}"`);   
// Output: "   Hello, World!"

console.log(`"${sampleText.trimStart().trimEnd()}"`); 
// Output: "Hello, World!"

```

---

### Key Details for Polyfills

1. **`String(this)` Coercion:** Ensures calling the method on boxed String objects or primitives works safely without throwing errors.
2. **Aliases (`trimLeft` / `trimRight`):** ES2019 standardized `trimStart` and `trimEnd`, but mapped `trimLeft` and `trimRight` as direct aliases for legacy web compatibility.

`String.prototype.padStart()` and `String.prototype.padEnd()` format strings by padding them with another string until they reach a specified target length.

* **`padStart(targetLength [, padString])`**: Adds padding to the **beginning** (left) of the string.
* **`padEnd(targetLength [, padString])`**: Adds padding to the **end** (right) of the string.

---

### Syntax & Parameters

```javascript
str.padStart(targetLength, padString)
str.padEnd(targetLength, padString)

```

1. **`targetLength`**: The total desired length of the resulting string after padding.

* If `targetLength` is **less than or equal to** `str.length`, the original string is returned unchanged.

1. **`padString`** *(Optional)*: The string to pad with. Defaults to a single space (`" "`) if omitted.

* If `padString` is too long to fit exactly within `targetLength`, it will be truncated from the right.

---

### Practical Examples

#### 1. Number Formatting (Dates & Time)

Add leading zeros to single-digit numbers for consistent timestamps or dates:

```javascript
const hours = "9";
const minutes = "5";

const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
console.log(formattedTime); 
// Output: "09:05"

```

#### 2. Masking Sensitive Information

Mask credit card or account numbers, leaving only the last 4 digits visible:

```javascript
const cardNumber = "4532112398761234";
const last4Digits = cardNumber.slice(-4);

const maskedCard = last4Digits.padStart(cardNumber.length, "*");
console.log(maskedCard); 
// Output: "************1234"

```

#### 3. CLI or Console Text Alignment

Align output columns neatly in a terminal or log display:

```javascript
const items = [
  { name: "Apple", price: "$1.50" },
  { name: "Watermelon", price: "$5.00" },
  { name: "Kiwi", price: "$0.75" },
];

items.forEach((item) => {
  const name = item.name.padEnd(15, ".");
  const price = item.price.padStart(8, " ");
  console.log(`${name}${price}`);
});

/* Output:
Apple..........   $1.50
Watermelon.....   $5.00
Kiwi...........   $0.75
*/

```

#### 4. Truncating Long `padString`

If the padding string exceeds the remaining space required to hit `targetLength`, JavaScript truncates `padString`:

```javascript
const str = "5";

// Only needs 4 extra characters to reach target length of 5
console.log(str.padStart(5, "abcdef")); 
// Output: "abcd5" (Truncates "ef")

```

---

### Key Rules to Remember

| Scenario                         | Behavior                     | Example                                            |
| -------------------------------- | ---------------------------- | -------------------------------------------------- |
| **`targetLength <= str.length`** | Returns original string      | `"hello".padStart(3, "0")` $\rightarrow$ `"hello"` |
| **`padString` omitted**          | Defaults to space `" "`      | `"42".padStart(5)` $\rightarrow$ `"   42"`         |
| **Numeric inputs**               | Must convert to string first | `String(9).padStart(2, "0")` $\rightarrow$ `"09"`  |

`String.prototype.padStart()` and `String.prototype.padEnd()` format strings by padding them with another string until they reach a specified target length.

* **`padStart(targetLength [, padString])`**: Adds padding to the **beginning** (left) of the string.
* **`padEnd(targetLength [, padString])`**: Adds padding to the **end** (right) of the string.

---

### Syntax & Parameters

```javascript
str.padStart(targetLength, padString)
str.padEnd(targetLength, padString)

```

1. **`targetLength`**: The total desired length of the resulting string after padding.

* If `targetLength` is **less than or equal to** `str.length`, the original string is returned unchanged.

1. **`padString`** *(Optional)*: The string to pad with. Defaults to a single space (`" "`) if omitted.

* If `padString` is too long to fit exactly within `targetLength`, it will be truncated from the right.

---

### Practical Examples

#### 1. Number Formatting (Dates & Time)

Add leading zeros to single-digit numbers for consistent timestamps or dates:

```javascript
const hours = "9";
const minutes = "5";

const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
console.log(formattedTime); 
// Output: "09:05"

```

#### 2. Masking Sensitive Information

Mask credit card or account numbers, leaving only the last 4 digits visible:

```javascript
const cardNumber = "4532112398761234";
const last4Digits = cardNumber.slice(-4);

const maskedCard = last4Digits.padStart(cardNumber.length, "*");
console.log(maskedCard); 
// Output: "************1234"

```

#### 3. CLI or Console Text Alignment

Align output columns neatly in a terminal or log display:

```javascript
const items = [
  { name: "Apple", price: "$1.50" },
  { name: "Watermelon", price: "$5.00" },
  { name: "Kiwi", price: "$0.75" },
];

items.forEach((item) => {
  const name = item.name.padEnd(15, ".");
  const price = item.price.padStart(8, " ");
  console.log(`${name}${price}`);
});

/* Output:
Apple..........   $1.50
Watermelon.....   $5.00
Kiwi...........   $0.75
*/

```

#### 4. Truncating Long `padString`

If the padding string exceeds the remaining space required to hit `targetLength`, JavaScript truncates `padString`:

```javascript
const str = "5";

// Only needs 4 extra characters to reach target length of 5
console.log(str.padStart(5, "abcdef")); 
// Output: "abcd5" (Truncates "ef")

```

---

### Key Rules to Remember

| Scenario                         | Behavior                     | Example                                            |
| -------------------------------- | ---------------------------- | -------------------------------------------------- |
| **`targetLength <= str.length`** | Returns original string      | `"hello".padStart(3, "0")` $\rightarrow$ `"hello"` |
| **`padString` omitted**          | Defaults to space `" "`      | `"42".padStart(5)` $\rightarrow$ `"   42"`         |
| **Numeric inputs**               | Must convert to string first | `String(9).padStart(2, "0")` $\rightarrow$ `"09"`  |
