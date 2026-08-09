Find the Index of the First Occurrence in a String
Easy
Topics
Companies
Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.

Example 1:

Input: haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" occurs at index 0 and 6.
The first occurrence is at index 0, so we return 0.
Example 2:

Input: haystack = "leetcode", needle = "leeto"
Output: -1
Explanation: "leeto" did not occur in "leetcode", so we return -1.

```js
var strStr = function (haystack, needle) {
  const slen = haystack.length;
  const plen = needle.length;
  if (slen == plen) {
    return haystack == needle ? 0 : -1;
  }
  for (let i = 0; i <= slen - plen; i++) {
    let j;
    for (j = 0; j < plen; j++) {
      if (haystack[i + j] != needle[j]) {
        break;
      }
    }
    if (j == plen) return i;
  }
  return -1;
};
```

Your brute-force solution for **LeetCode 28: Find the Index of the First Occurrence in a String** is functionally correct. It runs in $\mathcal{O}(N \times M)$ time complexity and $\mathcal{O}(1)$ space complexity, where $N$ is the length of `haystack` and $M$ is the length of `needle`.

---

### Modern JavaScript Built-In Solution

In production JavaScript, built-in string methods like `.indexOf()` or `.search()` are implemented in C++ at the engine level (V8) and run at near-native speeds:

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  return haystack.indexOf(needle);
};

```

---

### Optimal Algorithm: KMP (Knuth-Morris-Pratt) Algorithm

If an interviewer asks for a linear **$\mathcal{O}(N + M)$** time solution without relying on built-in string functions, use the **Knuth-Morris-Pratt (KMP)** pattern-matching algorithm.

#### KMP Concept

When a character mismatch occurs during comparison:

1. Standard brute force shifts `needle` by 1 position and restarts comparison from scratch.
2. **KMP** uses a precomputed **Longest Prefix Suffix (LPS)** array to skip redundant comparisons by jumping `j` directly to the longest valid prefix.

```javascript
/**
 * KMP Pattern Matching Algorithm
 * Time Complexity: O(N + M)
 * Auxiliary Space: O(M)
 */
var strStrKMP = function (haystack, needle) {
  if (needle.length === 0) return 0;
  if (needle.length > haystack.length) return -1;

  // 1. Build Longest Prefix Suffix (LPS) table
  const lps = new Int32Array(needle.length);
  let prevLPS = 0;
  let i = 1;

  while (i < needle.length) {
    if (needle[i] === needle[prevLPS]) {
      prevLPS++;
      lps[i] = prevLPS;
      i++;
    } else if (prevLPS === 0) {
      lps[i] = 0;
      i++;
    } else {
      prevLPS = lps[prevLPS - 1];
    }
  }

  // 2. Pattern Search using LPS table
  let hIdx = 0; // Index for haystack
  let nIdx = 0; // Index for needle

  while (hIdx < haystack.length) {
    if (haystack[hIdx] === needle[nIdx]) {
      hIdx++;
      nIdx++;
    } else {
      if (nIdx === 0) {
        hIdx++;
      } else {
        nIdx = lps[nIdx - 1]; // Skip unnecessary comparisons
      }
    }

    // Full match found
    if (nIdx === needle.length) {
      return hIdx - needle.length;
    }
  }

  return -1;
};

// Verification
console.log(strStrKMP("sadbutsad", "sad")); // 0
console.log(strStrKMP("leetcode", "leeto")); // -1

```

---

### Complexity Comparison

| Algorithm                      | Time Complexity                  | Auxiliary Space  | Best For                                       |
| ------------------------------ | -------------------------------- | ---------------- | ---------------------------------------------- |
| **Brute Force (Your Code)**    | $\mathcal{O}(N \times M)$        | $\mathcal{O}(1)$ | Small strings or simple interviews             |
| **`haystack.indexOf(needle)`** | Native Engine ($\mathcal{O}(N)$) | $\mathcal{O}(1)$ | Production JS Applications                     |
| **KMP Algorithm**              | **$\mathcal{O}(N + M)$**         | $\mathcal{O}(M)$ | Strict linear time requirement / Long patterns |

In **LeetCode 459: Repeated Substring Pattern**, you are given a non-empty string `s`. You need to check if it can be constructed by taking a substring of it and appending multiple copies of the substring together.

---

### Method 1: The String Concatenation Trick ($\mathcal{O}(N)$ Time)

#### The Intuition

If `s` is made up of a repeating pattern (e.g., `s = "abcabc"` made of `"abc"`), then doubling `s` to form `s + s` yields:

$$\text{"abcabcabcabc"}$$

If you remove the **first** and **last** characters from `s + s`, the original string `s` will still appear as a substring inside the remaining string if and only if `s` consists of a repeated substring!

#### Why It Works

Let $s = P + P + \dots + P$ ($k$ times, where $k \ge 2$).

* $s + s = P \dots P \ (+ \text{middle border} +) \ P \dots P$
* Removing the first and last character prevents matching $s$ at index $0$ or index $N$.
* If $s$ is periodic, the overlapping segments created in the middle will reconstruct $s$.

```javascript
/**
 * String Concatenation Trick
 * Time Complexity: O(N)
 * Auxiliary Space: O(N)
 */
function repeatedSubstringPatternConcat(s) {
  // Double string, remove head and tail, then search for s
  return (s + s).slice(1, -1).includes(s);
}

// Verification
console.log(repeatedSubstringPatternConcat("abab"));   // true
console.log(repeatedSubstringPatternConcat("aba"));    // false
console.log(repeatedSubstringPatternConcat("abcabc")); // true

```

---

### Method 2: The KMP Prefix Table Approach ($\mathcal{O}(N)$ Time, $\mathcal{O}(N)$ Space)

#### The Intuition

In the **Knuth-Morris-Pratt (KMP)** algorithm, the **LPS (Longest Prefix Suffix)** table stores the length of the longest proper prefix that is also a suffix for every prefix of `s`.

For a string `s` of length $N$:

1. Let $L$ be the value of the last element in the LPS table: $L = \text{lps}[N - 1]$.
2. $L$ represents the length of the longest matching prefix and suffix of `s`.
3. The length of the candidate repeating unit is $N - L$.
4. If $L > 0$ and $N \pmod{N - L} == 0$, then `s` is composed entirely of the repeated substring of length $N - L$.

#### Step-by-Step Implementation

```javascript
/**
 * KMP LPS Approach
 * Time Complexity: O(N)
 * Auxiliary Space: O(N)
 */
function repeatedSubstringPatternKMP(s) {
  const n = s.length;
  const lps = new Int32Array(n);

  let prevLPS = 0;
  let i = 1;

  // 1. Build the KMP LPS array for string s
  while (i < n) {
    if (s[i] === s[prevLPS]) {
      prevLPS++;
      lps[i] = prevLPS;
      i++;
    } else if (prevLPS === 0) {
      lps[i] = 0;
      i++;
    } else {
      prevLPS = lps[prevLPS - 1];
    }
  }

  const longestPrefixSuffix = lps[n - 1];

  // 2. Check if the remaining length divides the total string length
  return (
    longestPrefixSuffix > 0 && 
    n % (n - longestPrefixSuffix) === 0
  );
}

// Verification
console.log(repeatedSubstringPatternKMP("abab"));      // true (LPS=2, len=4 -> 4 % (4-2) == 0)
console.log(repeatedSubstringPatternKMP("aba"));       // false (LPS=1, len=3 -> 3 % (3-1) != 0)
console.log(repeatedSubstringPatternKMP("abcabcabc")); // true (LPS=6, len=9 -> 9 % (9-6) == 0)

```

---

### Visualizing the KMP LPS Array for `"abcabcabc"`

* **Length $N = 9$**

| Index `i`    | `0`   | `1`   | `2`   | `3`   | `4`   | `5`   | `6`   | `7`   | `8`     |
| ------------ | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ------- |
| **`s[i]`**   | `'a'` | `'b'` | `'c'` | `'a'` | `'b'` | `'c'` | `'a'` | `'b'` | `'c'`   |
| **`lps[i]`** | `0`   | `0`   | `0`   | `1`   | `2`   | `3`   | `4`   | `5`   | **`6`** |

* $L = \text{lps}[8] = 6$
* Candidate pattern length = $N - L = 9 - 6 = 3$ (pattern is `"abc"`)
* Check: $9 \pmod 3 = 0$ $\rightarrow$ **`true`**

---

### Complexity Comparison

| Method                                   | Time Complexity  | Auxiliary Space  | Readability                |
| ---------------------------------------- | ---------------- | ---------------- | -------------------------- |
| **String Concatenation (`(s+s).slice`)** | $\mathcal{O}(N)$ | $\mathcal{O}(N)$ | ⭐⭐⭐⭐⭐ (One-liner trick)    |
| **KMP LPS Table**                        | $\mathcal{O}(N)$ | $\mathcal{O}(N)$ | ⭐⭐⭐ (Algorithmic / Strict) |

The **Rabin-Karp algorithm** solves the string matching problem by using a **Rolling Hash**.

Instead of comparing characters one-by-one at every position (which takes $\mathcal{O}(N \times M)$ time), Rabin-Karp computes a numeric hash value for the `pattern` and compares it against the hash of each sliding window in the `haystack`. If the hashes match, a character-by-character check is performed to confirm the match and avoid false positives caused by **hash collisions**.

---

### Key Concept: Polynomial Rolling Hash

To update the hash of a sliding window in $\mathcal{O}(1)$ time when moving one position to the right:

1. **Subtract** the high-order term corresponding to the character leaving the window on the left.
2. **Multiply** the remaining hash by the base $B$.
3. **Add** the value of the new character entering the window on the right.
4. **Modulo** $M$ at each step to prevent integer overflow.

The mathematical formula for rolling a hash from window $H_{i}$ to $H_{i+1}$ is:

$$H_{i+1} = \big((H_i - S[i] \cdot B^{M-1}) \cdot B + S[i+M]\big) \pmod{P}$$

---

### Step-by-Step JavaScript Implementation

In JavaScript, standard Bitwise operations convert numbers to 32-bit signed integers. Using BigInt or `Math.abs` with explicit modulo arithmetic ensures we avoid negative values during modulo operations.

```javascript
/**
 * Rabin-Karp Algorithm for String Matching
 * @param {string} haystack - The text to search within
 * @param {string} needle - The pattern to search for
 * @return {number} - The starting index of the first match, or -1 if not found
 */
function strStrRabinKarp(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;

  if (m === 0) return 0;
  if (m > n) return -1;

  // Base and Modulo constants (Use a large prime for modulo to minimize collisions)
  const BASE = 256; 
  const MOD = 1_000_000_007;

  let needleHash = 0;
  let currentWindowHash = 0;
  let highestBasePower = 1; // BASE^(m-1) % MOD

  // Precompute BASE^(m-1) % MOD
  for (let i = 0; i < m - 1; i++) {
    highestBasePower = (highestBasePower * BASE) % MOD;
  }

  // Compute initial hash values for needle and first window of haystack
  for (let i = 0; i < m; i++) {
    needleHash = (needleHash * BASE + needle.charCodeAt(i)) % MOD;
    currentWindowHash = (currentWindowHash * BASE + haystack.charCodeAt(i)) % MOD;
  }

  // Slide the window across the haystack
  for (let i = 0; i <= n - m; i++) {
    // 1. If hashes match, perform character verification (Guard against collisions)
    if (needleHash === currentWindowHash) {
      let isMatch = true;
      for (let j = 0; j < m; j++) {
        if (haystack[i + j] !== needle[j]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) return i; // First occurrence found
    }

    // 2. Compute rolling hash for the next sliding window
    if (i < n - m) {
      const charLeaving = haystack.charCodeAt(i);
      const charEntering = haystack.charCodeAt(i + m);

      // Subtract leading character contribution
      currentWindowHash = (currentWindowHash - (charLeaving * highestBasePower) % MOD + MOD) % MOD;
      // Multiply by BASE and add trailing character
      currentWindowHash = (currentWindowHash * BASE + charEntering) % MOD;
    }
  }

  return -1;
}

// --- Verification ---
console.log(strStrRabinKarp("sadbutsad", "sad"));   // Output: 0
console.log(strStrRabinKarp("leetcode", "leeto"));   // Output: -1
console.log(strStrRabinKarp("hello world", "world")); // Output: 6

```

---

### Step-by-Step Rolling Hash Walkthrough

Consider searching for `"cat"` in `"cater"`:

1. **Initial Window (`"cat"`):** Compute $H_{\text{cat}}$ and $H_{\text{needle}}$. Since hashes match, verify characters $\rightarrow$ Match found at index `0`.
2. **Slide Window to (`"ate"`):**

* Remove `'c'`: Subtract $(\text{ASCII('c')} \times 256^2) \pmod{\text{MOD}}$
* Shift Base: Multiply remaining value by $256$
* Add `'e'`: Add $\text{ASCII('e')}$

1. **Compare New Hash:** If $H_{\text{ate}} \neq H_{\text{cat}}$, move to the next index without doing full character comparisons.

---

### Complexity Analysis

| Metric               | Average / Best Case      | Worst Case                | Reason                                                                                                               |
| -------------------- | ------------------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Time Complexity**  | **$\mathcal{O}(N + M)$** | $\mathcal{O}(N \times M)$ | Average case assumes few hash collisions. Worst case occurs if every window causes a hash collision (spurious hits). |
| **Space Complexity** | **$\mathcal{O}(1)$**     | $\mathcal{O}(1)$          | Uses a fixed number of variables regardless of input size.                                                           |

---

### Advantage of Rabin-Karp

While KMP is strictly linear for single-pattern matching, **Rabin-Karp shines in Multi-Pattern Search** (e.g., searching for $K$ different patterns of length $M$ simultaneously). By storing all pattern hashes in a Hash Set, we can check for matches against $K$ patterns in a single pass of the text in $\mathcal{O}(N)$ average time.
