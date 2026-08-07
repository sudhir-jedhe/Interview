"Repeat Characters" can mean multiple interview problems. Here are the most common ones:

---

# 1. Find First Repeating Character

### Input

```js
const str = "javascript";
```

### Output

```js
"a";
```

### Solution

```js
function firstRepeatingChar(str) {
  const seen = new Set();

  for (const char of str) {
    if (seen.has(char)) {
      return char;
    }

    seen.add(char);
  }

  return null;
}

console.log(firstRepeatingChar("javascript"));
```

### Complexity

```text
Time: O(n)
Space: O(n)
```

---

# 2. Count Repeated Characters

### Input

```js
"programming";
```

### Output

```js
{
  r: 2,
  g: 2,
  m: 2
}
```

### Solution

```js
function countRepeatedChars(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  const result = {};

  for (const key in freq) {
    if (freq[key] > 1) {
      result[key] = freq[key];
    }
  }

  return result;
}

console.log(countRepeatedChars("programming"));
```

---

# 3. Print Duplicate Characters

### Input

```js
"programming";
```

### Output

```js
["r", "g", "m"];
```

### Solution

```js
function getDuplicateChars(str) {
  const seen = new Set();
  const duplicates = new Set();

  for (const char of str) {
    if (seen.has(char)) {
      duplicates.add(char);
    } else {
      seen.add(char);
    }
  }

  return [...duplicates];
}

console.log(getDuplicateChars("programming"));
```

---

# 4. First Non-Repeating Character

### Input

```js
"aabbccddefg";
```

### Output

```js
"e";
```

### Solution

```js
function firstNonRepeating(str) {
  const freq = {};

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  for (const char of str) {
    if (freq[char] === 1) {
      return char;
    }
  }

  return null;
}

console.log(firstNonRepeating("aabbccddefg"));
```

---

# 5. Compress Repeating Characters (Run-Length Encoding)

### Input

```js
"aaabbccccd";
```

### Output

```js
"a3b2c4d1";
```

### Solution

```js
function compress(str) {
  let result = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      result += str[i] + count;
      count = 1;
    }
  }

  return result;
}

console.log(compress("aaabbccccd"));
```

---

# 6. Remove Repeated Characters

### Input

```js
"programming";
```

### Output

```js
"progamin";
```

### Solution

```js
function removeDuplicates(str) {
  return [...new Set(str)].join("");
}

console.log(removeDuplicates("programming"));
```

---

# Interview Favourite: Most Frequently Repeated Character

### Input

```js
"javascript";
```

### Output

```js
"a";
```

### Solution

```js
function maxRepeatedChar(str) {
  const freq = {};

  let maxChar = "";
  let maxCount = 0;

  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;

    if (freq[char] > maxCount) {
      maxCount = freq[char];
      maxChar = char;
    }
  }

  return maxChar;
}

console.log(maxRepeatedChar("javascript"));
```

### Complexity

```text
Time: O(n)
Space: O(k)
```

Where:

```text
n = string length
k = unique characters
```

For React/JavaScript interviews, the **most frequently asked variants** are:

1. First repeating character
2. First non-repeating character
3. Find duplicate characters
4. Maximum occurring character
5. String compression (Run-Length Encoding)

Your compilation covers the core "Repeat Characters" patterns asked in technical interviews. Every solution is optimal and runs in $\mathcal{O}(N)$ time.

To round out this reference sheet, here are **3 additional "Repeat Characters" variants** frequently asked at companies like Meta, Amazon, and Google.

---

### Variant 7: Longest Substring Without Repeating Characters (LeetCode 3)

Find the length of the longest substring containing all unique characters.

#### Input

```javascript
"abcabcbb"

```

#### Output

```javascript
3 // "abc"

```

#### Sliding Window Solution ($\mathcal{O}(N)$ Time, $\mathcal{O}(K)$ Space)

```javascript
function lengthOfLongestSubstring(str) {
  const seen = new Map();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < str.length; right++) {
    const char = str[right];

    // If character was seen inside the current window, shrink window
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }

    seen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3

```

---

### Variant 8: Longest Repeating Character Replacement (LeetCode 424)

Given a string and an integer `k`, return the maximum length of a substring containing the same letter after replacing up to `k` characters.

#### Input

```javascript
str = "AABABBA", k = 1

```

#### Output

```javascript
4 // "AABA" -> replace 'B' with 'A' to get "AAAA"

```

#### Solution ($\mathcal{O}(N)$ Time, $\mathcal{O}(1)$ Space)

```javascript
function characterReplacement(s, k) {
  const freq = {};
  let maxFreq = 0;
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    freq[char] = (freq[char] || 0) + 1;
    maxFreq = Math.max(maxFreq, freq[char]);

    // Window length - max single character count > k means invalid window
    if (right - left + 1 - maxFreq > k) {
      freq[s[left]]--;
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

console.log(characterReplacement("AABABBA", 1)); // 4

```

---

### Variant 9: Remove Consecutive Duplicate Characters (Stack Pattern)

Remove adjacent duplicates from a string iteratively (e.g., LeetCode 1047: "abbaca" $\rightarrow$ "ca").

#### Input

```javascript
"abbaca"

```

#### Output

```javascript
"ca"

```

#### Solution ($\mathcal{O}(N)$ Time, $\mathcal{O}(N)$ Space)

```javascript
function removeDuplicates(str) {
  const stack = [];

  for (const char of str) {
    if (stack.length > 0 && stack[stack.length - 1] === char) {
      stack.pop(); // Remove matching adjacent duplicate
    } else {
      stack.push(char);
    }
  }

  return stack.join("");
}

console.log(removeDuplicates("abbaca")); // "ca"

```

---

### Master Complexity Cheat Sheet

| Interview Problem                       | Algorithm Technique       | Time Complexity  | Space Complexity                   |
| --------------------------------------- | ------------------------- | ---------------- | ---------------------------------- |
| **First Repeating / Duplicate**         | Hash Set / Set            | $\mathcal{O}(N)$ | $\mathcal{O}(K)$                   |
| **First Non-Repeating / Max Freq**      | Frequency Counter Object  | $\mathcal{O}(N)$ | $\mathcal{O}(K)$                   |
| **Run-Length Encoding**                 | Two-Pointer Iteration     | $\mathcal{O}(N)$ | $\mathcal{O}(1)$                   |
| **Longest Substring Without Repeating** | Sliding Window + Hash Map | $\mathcal{O}(N)$ | $\mathcal{O}(K)$                   |
| **Longest Repeating Replacement**       | Dynamic Sliding Window    | $\mathcal{O}(N)$ | $\mathcal{O}(26) = \mathcal{O}(1)$ |
| **Remove Adjacent Duplicates**          | Stack                     | $\mathcal{O}(N)$ | $\mathcal{O}(N)$                   |
