```js
function reverseString(str) {
  const reversedString = str.split("").reduce((acc, char) => char + acc, "");
  console.log(reversedString);
}
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************** */

// Function to reverse string
function reverseString(str) {
  const strRev = str.split("").reverse().join("");
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/***************************** */
// Function to reverse string
function reverseString(str) {
  const strRev = [...str].reverse().join("");
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*********************************** */

// Function to reverse string
function reverseString(str) {
  const strRev = [...str].reduce((x, y) => y.concat(x));
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************** */
// Function to reverse string
function reverseString(str) {
  let strRev = "";
  for (let i = str.length - 1; i >= 0; i--) {
    strRev += str[i];
  }
  console.log(strRev);
}



function reverseString(str) {
  // Base case: if the string is empty or has only one character, return the string
  if (str.length <= 1) {
    return str;
  }
  // Recursive case: return the last character + reverseString of all characters except the last
  return str.charAt(str.length - 1) + reverseString(str.substring(0, str.length - 1));
}
// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************************** */
function strReverse(str) {
  if (str === "") {
    return "";
  } else {
    return strReverse(str.substr(1)) + str.charAt(0);
  }
}
console.log(strReverse("GeeksforGeeks"));
console.log(strReverse("JavaScript"));
console.log(strReverse("TypeScript"));

/************************************* */
function reverseString(str) {
  return [...str].reduceRight((accumulator, current) => accumulator + current);
}


var reverseString = function (s) {
  for (let i = 0, j = s.length - 1; i < j; ++i, --j) {
      [s[i], s[j]] = [s[j], s[i]];
  }
};

// Given a string s and an integer k, reverse the first k characters for every 2k characters counting from the start of the string.


// Input: s = "abcdefg", k = 2
// Output: "bacdfeg"
// Example 2:

// Input: s = "abcd", k = 2
// Output: "bacd"



function reverseStr(s: string, k: number): string {
  const n = s.length;
  const cs = s.split('');
  for (let i = 0; i < n; i += 2 * k) {
      for (let l = i, r = Math.min(i + k - 1, n - 1); l < r; l++, r--) {
          [cs[l], cs[r]] = [cs[r], cs[l]];
      }
  }
  return cs.join('');
}
```

Your collection covers almost every major approach to reversing a string in JavaScript—from standard array methods and reductions to recursion, two-pointer swaps, and specialized LeetCode windowing problems.

Here is a technical analysis of your examples, highlighting key performance traps, bugs, and best practices.

---

### 1. The Best Practice Approaches

#### Spread Operator (`[...str]`) over `split("")`

```javascript
function reverseString(str) {
  return [...str].reverse().join("");
}

```

* **Why it's the best approach:** `split("")` splits by UTF-16 code units, which **corrupts emojis and surrogate pairs** (e.g., `"hello🤖".split("").reverse().join("")` yields `"\uD83Eolleh"`). Using the spread operator `[...str]` uses the string's iterator, which is **Unicode-aware** and preserves complex characters.

---

### 2. Identifying Bug & Performance Traps

#### A. In-Place String Mutation Bug ⚠️

```javascript
var reverseString = function (s) {
  for (let i = 0, j = s.length - 1; i < j; ++i, --j) {
      [s[i], s[j]] = [s[j], s[i]]; // ❌ Fails silently in JavaScript!
  }
};

```

* **The Bug:** JavaScript strings are **primitive and immutable**. Assigning `s[i] = s[j]` does nothing (and throws an error in `'use strict'` mode).
* **Fix:** Convert to an array first, perform the two-pointer swap, and `.join("")` at the end:

```javascript
var reverseString = function (str) {
  const s = [...str];
  for (let i = 0, j = s.length - 1; i < j; ++i, --j) {
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s.join("");
};

```

#### B. Recursion Call-Stack Risk ⚠️

```javascript
function strReverse(str) {
  if (str === "") return "";
  return strReverse(str.substr(1)) + str.charAt(0);
}

```

* **Performance:** Takes $\mathcal{O}(N^2)$ time due to repeated string copying (`substr`).
* **Stack Overflow:** If given a string longer than ~10,000 characters, it will throw a `RangeError: Maximum call stack size exceeded`.

#### C. Deprecated Method Notice

* `str.substr()` is deprecated in modern JavaScript. Replace it with `str.slice(1)` or `str.substring(1)`.

---

### 3. LeetCode 541 Solution Analysis (`reverseStr`)

Your TypeScript implementation for reversing $k$ characters for every $2k$ characters is **optimal and clean** ($\mathcal{O}(N)$ time, $\mathcal{O}(N)$ space):

```typescript
function reverseStr(s: string, k: number): string {
  const n = s.length;
  const cs = s.split('');
  
  for (let i = 0; i < n; i += 2 * k) {
    for (let l = i, r = Math.min(i + k - 1, n - 1); l < r; l++, r--) {
      [cs[l], cs[r]] = [cs[r], cs[l]]; // Two-pointer array swap
    }
  }
  
  return cs.join('');
}

```

---

### Method Comparison Matrix

| Approach                                 | Unicode/Emoji Safe?  | Performance               | Memory Usage     | Stack Overflow Risk?     |
| ---------------------------------------- | -------------------- | ------------------------- | ---------------- | ------------------------ |
| **`[...str].reverse().join("")`**        | ✅ **Yes**            | **Fast**                  | $\mathcal{O}(N)$ | ❌ No                     |
| **`str.split("").reverse().join("")`**   | ❌ No                 | **Fastest**               | $\mathcal{O}(N)$ | ❌ No                     |
| **Backward `for` Loop**                  | ❌ No                 | **Fast**                  | $\mathcal{O}(N)$ | ❌ No                     |
| **Array `.reduce()` / `.reduceRight()**` | ✅ (if using `[...]`) | Moderate                  | $\mathcal{O}(N)$ | ❌ No                     |
| **Recursion (`slice`)**                  | ❌ No                 | Slow ($\mathcal{O}(N^2)$) | $\mathcal{O}(N)$ | ⚠️ **Yes** ($N > 10,000$) |
