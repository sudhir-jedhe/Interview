```js
function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let start = 0;
  let charMap = new Map(); // Map to store character indices

  for (let end = 0; end < s.length; end++) {
    let char = s[end];

    if (charMap.has(char)) {
      // If character is already in the map and its index is >= start
      // Move the start pointer to one position after the last occurrence of the character
      start = Math.max(charMap.get(char) + 1, start);
    }

    // Update the index of the current character in the map
    charMap.set(char, end);

    // Calculate the current window size
    let currentLength = end - start + 1;

    // Update maxLength if current window size is larger
    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3

/********************************** */
function lengthOfLongestSubstring(s) {
  let longest = 0;
  let seen = {};
  let start = 0;

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // If the character has already been seen within the window
    if (seen[char] !== undefined && seen[char] >= start) {
      // Update the start index to exclude the previous occurrence
      start = Math.max(start, seen[char] + 1);
    }
    // Update the longest substring length if the current window is longer
    longest = Math.max(longest, i - start + 1);
    // Update the character's last seen index
    seen[char] = i;
  }

  return longest;
}

// Examples
console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3

/************************************************** */
function lengthOfLongestSubstring(s) {
  let longest = 0;
  let window = new Set();

  for (let i = 0, j = 0; i < s.length; i++) {
    const char = s[i];
    // If the character is already in the set (not unique within window)
    while (window.has(char)) {
      window.delete(s[j]); // Remove leftmost character from window
      j++; // Slide window to the right
    }
    window.add(char); // Add current character to the set
    longest = Math.max(longest, window.size); // Update longest if window size is larger
  }

  return longest;
}

// Examples
console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3

/**************************************** */
function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  let charSet = new Set();

  for (let right = 0; right < s.length; right++) {
    let char = s[right];

    while (charSet.has(char)) {
      charSet.delete(s[left]);
      left++;
    }

    charSet.add(char);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3
```

The **Longest Substring Without Repeating Characters** (LeetCode #3) problem is one of the most fundamental sliding window algorithmic challenges.

---

### Key Intuition: Sliding Window + Hash Map

We use two pointers (`left` and `right`) to represent a sliding window containing a valid substring with no duplicate characters:

1. As `right` moves forward through the string, we store each character's **last seen index** in a Hash Map (or Array).
2. If we encounter a character that is **already in our window** (i.e., its last seen index is $\ge$ `left`), we jump `left` directly to `lastSeenIndex + 1`.
3. At every step, we calculate `windowLength = right - left + 1` and update the maximum length.

---

### JavaScript Implementation ($\mathcal{O}(n)$ Time, $\mathcal{O}(\min(n, m))$ Space)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If character was seen and falls within the current window
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1; // Slide left pointer past duplicate
    }

    // Update last seen index of character
    lastSeen.set(char, right);

    // Track longest valid window
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Examples
console.log(lengthOfLongestSubstring("abcabcbb")); // Output: 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb")); // Output: 1 ("b")
console.log(lengthOfLongestSubstring("pwwkew")); // Output: 3 ("wke")
```

---

### Step-by-Step Trace: `"pwwkew"`

| `right` | Char  | `lastSeen` Check      | `left` Pointer     | Current Window | `maxLength` |
| ------- | ----- | --------------------- | ------------------ | -------------- | ----------- |
| `0`     | `'p'` | Not in map            | `0`                | `"p"`          | `1`         |
| `1`     | `'w'` | Not in map            | `0`                | `"pw"`         | `2`         |
| `2`     | `'w'` | Seen at `1` ($\ge 0$) | Jump `left` to `2` | `"w"`          | `2`         |
| `3`     | `'k'` | Not in map            | `2`                | `"wk"`         | `2`         |
| `4`     | `'e'` | Not in map            | `2`                | `"wke"`        | **`3`**     |
| `5`     | `'w'` | Seen at `2` ($\ge 2$) | Jump `left` to `3` | `"kew"`        | `3`         |

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n)$ — Every character is visited at most once by the `right` pointer.
- **Space Complexity:** $\mathcal{O}(\min(n, m))$ where $n$ is string length and $m$ is the size of the character set (e.g., $128$ for ASCII).
