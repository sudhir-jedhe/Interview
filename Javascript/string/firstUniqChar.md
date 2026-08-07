```js
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  const cnt = new Array(26).fill(0);
  for (const c of s) {
    ++cnt[c.charCodeAt() - "a".charCodeAt()];
  }
  for (let i = 0; i < s.length; ++i) {
    if (cnt[s[i].charCodeAt() - "a".charCodeAt()] === 1) {
      return i;
    }
  }
  return -1;
};

// Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.

// Example 1:

// Input: s = "leetcode"
// Output: 0
// Example 2:

// Input: s = "loveleetcode"
// Output: 2
// Example 3:

// Input: s = "aabb"
// Output: -1
```

Your implementation for **LeetCode 387: First Unique Character in a String** is optimal, clean, and runs in linear time.

---

### Code Analysis

Your solution uses a **Two-Pass Frequency Array** strategy:

1. **First Pass (Count Frequencies):** Iterates over string `s` and populates the 26-element frequency array `cnt`.
2. **Second Pass (Find First Unique):** Iterates over `s` again in original order and checks `cnt` for the first character with a count of `1`.

* **Time Complexity:** $\mathcal{O}(N)$ where $N$ is the length of string `s` (two passes through `s`).
* **Space Complexity:** $\mathcal{O}(1)$ auxiliary space since the fixed array size is always 26 regardless of input size.

---

### Slight Micro-Optimizations

While your solution is already optimal, here are two clean alternative ways to write it in JavaScript/TypeScript:

#### 1. Pre-caching ASCII Base Code

Instead of calling `"a".charCodeAt()` repeatedly inside the loops, cache `97` or `"a".charCodeAt(0)` once:

```javascript
var firstUniqChar = function (s) {
  const cnt = new Int32Array(26);
  const codeA = 97; // 'a'.charCodeAt(0)

  for (let i = 0; i < s.length; i++) {
    cnt[s.charCodeAt(i) - codeA]++;
  }

  for (let i = 0; i < s.length; i++) {
    if (cnt[s.charCodeAt(i) - codeA] === 1) {
      return i;
    }
  }

  return -1;
};

```

---

#### 2. Using `Map` (For Any Unicode Characters)

If the problem constraints were expanded beyond lowercase English letters to include any ASCII or Unicode characters, a `Map` preserves insertion order and eliminates the need for 26-element array mapping:

```javascript
var firstUniqCharMap = function (s) {
  const counts = new Map();

  for (const char of s) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) {
      return i;
    }
  }

  return -1;
};

```

---

### Complexity Comparison

| Solution                         | Time Complexity  | Auxiliary Space              | Generalizability           |
| -------------------------------- | ---------------- | ---------------------------- | -------------------------- |
| **Your Code (`Int32Array(26)`)** | $\mathcal{O}(N)$ | $\mathcal{O}(1)$             | Lowercase `'a'`–`'z'`      |
| **Map Lookup**                   | $\mathcal{O}(N)$ | $\mathcal{O}(K)$ ($K \le N$) | Supports any character set |
