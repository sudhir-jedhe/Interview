```js
const leastFrequent = (arr) => {
  //Store the number counts in object
  const count = arr.reduce((a, b) => {
    if (!a[b]) {
      a[b] = 1;
    } else {
      a[b]++;
    }

    return a;
  }, {});

  let minCount = Number.MAX_SAFE_INTEGER;
  let numberWithLeastCount = 0;

  //Find the number with least count
  for (const [key, value] of Object.entries(count)) {
    if (value < minCount) {
      minCount = value;
      numberWithLeastCount = key;
    }
  }

  return numberWithLeastCount;
};

Input: console.log(leastFrequent([1, 1, 1, 2, 2, 2, 3, 3, 4]));
console.log(leastFrequent([2, 2, 2, 3, 3, 3, 4, 4, 4, 2, 5, 5, 5, 6, 6]));

Output: 4;
6;
```

The **Least Frequent Element** problem asks you to find the element that appears the **minimum number of times** in an array or string.

---

### Core Intuition: Frequency Counter Pattern

We solve this using a two-step approach:

1. **Count Frequencies**: Build a hash map (or JavaScript `Map`) to tally the occurrences of each element.
2. **Find Minimum**: Iterate through the frequency map to find the element with the lowest count.

---

### 1. Single Least Frequent Element ($\mathcal{O}(n)$ Time, $\mathcal{O}(n)$ Space)

Returns the first element with the minimum frequency:

```javascript
/**
 * Find the least frequent element in an array
 * @param {Array} arr
 * @return {any}
 */
function leastFrequent(arr) {
  if (arr.length === 0) return null;

  // Step 1: Build frequency map
  const freqMap = new Map();
  for (const item of arr) {
    freqMap.set(item, (freqMap.get(item) || 0) + 1);
  }

  // Step 2: Find element with minimum frequency
  let minFreq = Infinity;
  let leastFrequentItem = null;

  for (const [item, count] of freqMap.entries()) {
    if (count < minFreq) {
      minFreq = count;
      leastFrequentItem = item;
    }
  }

  return leastFrequentItem;
}

// Example:
console.log(leastFrequent([1, 3, 2, 1, 4, 1, 3, 2, 2]));
// Output: 4 (appears only 1 time)
```

---

### 2. All Least Frequent Elements (Handling Ties)

If multiple elements share the same lowest frequency, you can collect all of them:

```javascript
/**
 * Find all elements that share the lowest frequency
 * @param {Array} arr
 * @return {Array}
 */
function allLeastFrequent(arr) {
  if (arr.length === 0) return [];

  const freqMap = new Map();
  for (const item of arr) {
    freqMap.set(item, (freqMap.get(item) || 0) + 1);
  }

  // Find minimum frequency value
  const minFreq = Math.min(...freqMap.values());

  // Filter elements with minimum frequency
  const result = [];
  for (const [item, count] of freqMap.entries()) {
    if (count === minFreq) {
      result.push(item);
    }
  }

  return result;
}

// Example:
console.log(allLeastFrequent([1, 1, 2, 2, 3, 4, 4]));
// Output: [3] (appears 1 time)

console.log(allLeastFrequent(["a", "b", "a", "b", "c", "d"]));
// Output: ['c', 'd'] (both appear 1 time)
```

---

### 3. Least Frequent Character in a String

```javascript
/**
 * Find least frequent character in a string
 * @param {string} str
 * @return {string}
 */
function leastFrequentChar(str) {
  if (!str) return "";

  const freqMap = {};
  for (const char of str) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  let minCount = Infinity;
  let result = "";

  for (const char in freqMap) {
    if (freqMap[char] < minCount) {
      minCount = freqMap[char];
      result = char;
    }
  }

  return result;
}

// Example:
console.log(leastFrequentChar("swiss"));
// Output: 'w' or 'i' (both appear 1 time)
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n)$ — One pass to count frequencies, and one pass over unique elements ($k \le n$).
- **Space Complexity:** $\mathcal{O}(k)$ — Space required for the hash map, where $k$ is the number of distinct elements.

To solve **Top K Frequent Elements** (LeetCode #347) in guaranteed $\mathcal{O}(n)$ time, standard sorting ($\mathcal{O}(n \log n)$) or Min-Heap approaches ($\mathcal{O}(n \log k)$) won't suffice. Instead, we use a modified **Bucket Sort**.

---

### The Key Trick: Frequency as the Array Index

Instead of sorting elements by their counts, we create an array of buckets where the **array index represents the frequency count**.

Since an element in an array of size $n$ can appear at most $n$ times, the maximum possible frequency is $n$. By creating an array of size $n + 1$, we can group numbers into buckets based on how often they occur.

---

### Step-by-Step Algorithm

1. **Build a Frequency Map**: Count occurrences of each number in $\mathcal{O}(n)$ time.
2. **Populate Frequency Buckets**: Create an array of empty lists `buckets` of length $n + 1$. Place each element into `buckets[frequency]`.
3. **Gather Top K Elements**: Iterate through `buckets` backwards (from index $n$ down to $1$). Collect elements until we have $k$ numbers.

---

### JavaScript / TypeScript Implementation

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function topKFrequent(nums, k) {
  // Step 1: Count element frequencies
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Initialize bucket array (indices represent frequencies 0 to n)
  const buckets = Array.from({ length: nums.length + 1 }, () => []);

  // Place numbers into their corresponding frequency bucket
  for (const [num, count] of freqMap.entries()) {
    buckets[count].push(num);
  }

  // Step 3: Iterate backwards from highest frequency bucket to collect top K
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (buckets[i].length > 0) {
      for (const num of buckets[i]) {
        result.push(num);
        if (result.length === k) break;
      }
    }
  }

  return result;
}

// Example usage:
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));
// Output: [1, 2] (1 appears 3 times, 2 appears 2 times)
```

---

### Dry Run Trace (`nums = [1, 1, 1, 2, 2, 3]`, `k = 2`)

1. **Frequency Map**: `{ 1 => 3, 2 => 2, 3 => 1 }`
2. **Buckets Array** (length = 7):

- `buckets[0] = []`
- `buckets[1] = [3]` _(3 appears 1 time)_
- `buckets[2] = [2]` _(2 appears 2 times)_
- `buckets[3] = [1]` _(1 appears 3 times)_
- `buckets[4..6] = []`

1. **Collect from Right**:

- Inspect `buckets[3]`: Add `1` $\rightarrow$ `result = [1]`
- Inspect `buckets[2]`: Add `2` $\rightarrow$ `result = [1, 2]`
- `result.length === k` ($2$), return `[1, 2]`.

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n)$
- Building frequency map: $\mathcal{O}(n)$
- Populating buckets: $\mathcal{O}(n)$
- Scanning buckets backwards: $\mathcal{O}(n)$

- **Space Complexity:** $\mathcal{O}(n)$ — Space needed for the frequency map and bucket array.

---

### Comparison of Approaches for Top K Frequent

| Approach                      | Time Complexity          | Space Complexity     | Notes                                                              |
| ----------------------------- | ------------------------ | -------------------- | ------------------------------------------------------------------ |
| **Sort by Frequency**         | $\mathcal{O}(n \log n)$  | $\mathcal{O}(n)$     | Straightforward, but fails $\mathcal{O}(n)$ constraint.            |
| **Min-Heap (Priority Queue)** | $\mathcal{O}(n \log k)$  | $\mathcal{O}(n + k)$ | Optimal when $k \ll n$ and streaming data.                         |
| **Bucket Sort (Optimal)**     | $\mathcal{O}(n)$         | $\mathcal{O}(n)$     | Best theoretical time, relies on bounded frequencies ($1$ to $n$). |
| **Quickselect**               | $\mathcal{O}(n)$ average | $\mathcal{O}(n)$     | Average $\mathcal{O}(n)$, but worst-case $\mathcal{O}(n^2)$.       |

How do you find the first non-repeating character in a string in O(n) time?

To find the **first non-repeating character** in a string in $\mathcal{O}(n)$ time (LeetCode #387), use a **two-pass frequency hash map or array**.

---

### Key Intuition

1. **Pass 1:** Iterate through the string to count the frequencies of every character in a map or a fixed-size array.
2. **Pass 2:** Iterate through the string a second time. The first character whose frequency count equals $1$ is your answer.

---

### Solution 1: Standard Two-Pass Hash Map / Frequency Array

For lowercase English letters (`'a'` to `'z'`), a fixed-size integer array of length 26 acts as a fast direct-address hash map.

```javascript
/**
 * Returns the index of the first non-repeating character.
 * @param {string} s
 * @return {number} Returns index if found, else -1
 */
function firstUniqChar(s) {
  const charCounts = new Array(26).fill(0);
  const codeA = "a".charCodeAt(0);

  // Pass 1: Build frequency map
  for (let i = 0; i < s.length; i++) {
    charCounts[s.charCodeAt(i) - codeA]++;
  }

  // Pass 2: Find the first character with a count of 1
  for (let i = 0; i < s.length; i++) {
    if (charCounts[s.charCodeAt(i) - codeA] === 1) {
      return i; // Return index (or s[i] for the character itself)
    }
  }

  return -1;
}

// Example usage:
console.log(firstUniqChar("leetcode")); // Output: 0 ('l')
console.log(firstUniqChar("loveleetcode")); // Output: 2 ('v')
console.log(firstUniqChar("aabb")); // Output: -1
```

---

### Solution 2: Single-Pass Optimization (For Long / Streaming Inputs)

If the string is extremely long and you want to avoid iterating over the whole string twice, store the **first index** of each character instead of just its frequency:

- If character hasn't been seen: record its index.
- If character has been seen before: mark its index as `-2` (repeating).
- Finally, scan the fixed 26-element array to find the smallest index $> -1$.

```javascript
function firstUniqCharSinglePass(s) {
  // Store indices: -1 = unseen, -2 = duplicate, >= 0 = first seen index
  const charIndices = new Array(26).fill(-1);
  const codeA = "a".charCodeAt(0);

  for (let i = 0; i < s.length; i++) {
    const charCode = s.charCodeAt(i) - codeA;
    if (charIndices[charCode] === -1) {
      charIndices[charCode] = i; // First time seeing character
    } else {
      charIndices[charCode] = -2; // Duplicate found
    }
  }

  let minIndex = Infinity;
  for (let i = 0; i < 26; i++) {
    if (charIndices[i] >= 0) {
      minIndex = Math.min(minIndex, charIndices[i]);
    }
  }

  return minIndex === Infinity ? -1 : minIndex;
}
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n)$ — We iterate through the string at most twice. The final check across the 26-element array takes constant time $\mathcal{O}(26) = \mathcal{O}(1)$.
- **Space Complexity:** $\mathcal{O}(1)$ or $\mathcal{O}(\Sigma)$ — We use a fixed-size array of 26 integers (or $\Sigma$ for general character sets like ASCII/Unicode), which consumes constant memory space independent of string length $n$.

How do you solve Longest Substring with At Most K Distinct Characters using Sliding Window?
To solve **Longest Substring with At Most K Distinct Characters** (LeetCode #340) in $\mathcal{O}(n)$ time, we use the **Sliding Window** pattern paired with a **Frequency Map**.

---

### Key Intuition

We expand a sliding window `[left...right]` across the string to incorporate characters one by one while keeping track of character counts:

1. **Expand**: Incrementally move `right` and add `s[right]` to a frequency map.
2. **Contract**: If the number of unique characters in the map exceeds $k$, increment `left` to shrink the window until `freqMap.size <= k`. When a character's frequency drops to $0$, remove it from the map.
3. **Track Max**: At each step, update `maxLength = max(maxLength, right - left + 1)`.

---

### JavaScript Implementation ($\mathcal{O}(n)$ Time, $\mathcal{O}(k)$ Space)

```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
function lengthOfLongestSubstringKDistinct(s, k) {
  if (!s || k === 0) return 0;

  const freqMap = new Map();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    freqMap.set(char, (freqMap.get(char) || 0) + 1);

    // Shrink window until we have at most k distinct characters
    while (freqMap.size > k) {
      const leftChar = s[left];
      freqMap.set(leftChar, freqMap.get(leftChar) - 1);

      if (freqMap.get(leftChar) === 0) {
        freqMap.delete(leftChar);
      }
      left++;
    }

    // Record maximum valid window size
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Example 1:
console.log(lengthOfLongestSubstringKDistinct("eceba", 2));
// Output: 3 (Substring: "ece")

// Example 2:
console.log(lengthOfLongestSubstringKDistinct("aa", 1));
// Output: 2 (Substring: "aa")
```

---

### Step-by-Step Trace: `s = "eceba"`, `k = 2`

| `right` | Char  | `freqMap` State              | `freqMap.size`      | `left` | Window  | `maxLength` |
| ------- | ----- | ---------------------------- | ------------------- | ------ | ------- | ----------- |
| `0`     | `'e'` | `{ 'e': 1 }`                 | $1 \le 2$           | `0`    | `"e"`   | `1`         |
| `1`     | `'c'` | `{ 'e': 1, 'c': 1 }`         | $2 \le 2$           | `0`    | `"ec"`  | `2`         |
| `2`     | `'e'` | `{ 'e': 2, 'c': 1 }`         | $2 \le 2$           | `0`    | `"ece"` | **`3`**     |
| `3`     | `'b'` | `{ 'e': 2, 'c': 1, 'b': 1 }` | $3 > 2$ _(Shrink!)_ | `2`    | `"eb"`  | `3`         |
| `4`     | `'a'` | `{ 'e': 1, 'b': 1, 'a': 1 }` | $3 > 2$ _(Shrink!)_ | `3`    | `"ba"`  | `3`         |

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n)$ — Both `right` and `left` pointers move from left to right at most once, and Map operations take $\mathcal{O}(1)$ time.
- **Space Complexity:** $\mathcal{O}(k)$ — The frequency map stores at most $k + 1$ unique character entries at any point.

How do you find the first non-repeating character in a continuous data stream using a Queue?
To find the **first non-repeating character in a continuous data stream**, static two-pass string algorithms won't work because you cannot restart from index 0 every time a new character arrives.

Instead, we use a **Queue (FIFO)** paired with a **Frequency Map / Visited Array**.

---

### Key Intuition

1. **Queue**: Holds the sequence of characters in the order they arrived, serving as candidates for the first non-repeating character.
2. **Frequency Map**: Tracks how many times each character has appeared across the entire stream so far.

When a new character arrives:

- Increment its frequency count in the map.
- Push it to the back of the queue.
- **Lazy Clean-up**: Inspect the front of the queue (`queue[0]`). While the character at the front has a count greater than 1 (meaning it's repeated), pop it off.
- The character remaining at the front of the queue is your current first non-repeating character.

---

### JavaScript Class Implementation

```javascript
class FirstUniqueStream {
  constructor() {
    this.queue = []; // Queue storing candidate non-repeating characters
    this.freqMap = new Array(26).fill(0); // Frequency count for 'a' - 'z'
  }

  /**
   * Process a new character arriving in the stream
   * @param {string} char
   * @return {string} Current first non-repeating character, or '#' if none exists
   */
  add(char) {
    const code = char.charCodeAt(0) - 97; // Map 'a' -> 0, 'b' -> 1, etc.

    // 1. Update frequency and push candidate to queue
    this.freqMap[code]++;
    this.queue.push(char);

    // 2. Remove invalid (repeating) characters from the front of the queue
    while (this.queue.length > 0) {
      const frontCode = this.queue[0].charCodeAt(0) - 97;
      if (this.freqMap[frontCode] > 1) {
        this.queue.shift(); // Remove repeating character from front
      } else {
        break; // Valid non-repeating character found at the front!
      }
    }

    // 3. Return front element or '#' if queue is empty
    return this.queue.length > 0 ? this.queue[0] : "#";
  }
}

// -------------------------------------------------------------
// Stream Simulation
// -------------------------------------------------------------
const stream = new FirstUniqueStream();
const input = ["a", "a", "b", "c"];
const result = [];

for (const ch of input) {
  result.push(stream.add(ch));
}

console.log("Stream Input:", input.join(" -> "));
console.log("First Unique:", result.join(" -> "));
// Output: a -> # -> b -> b
```

---

### Step-by-Step Execution Trace

Let's trace the stream processing for input characters: `'a' -> 'a' -> 'b' -> 'c'`

| Incoming Char | Frequency Map State        | Queue State (Before Clean-up) | Queue State (After Clean-up)    | Output (`getFirstUnique`) |
| ------------- | -------------------------- | ----------------------------- | ------------------------------- | ------------------------- |
| `'a'`         | `{'a': 1}`                 | `['a']`                       | `['a']`                         | **`'a'`**                 |
| `'a'`         | `{'a': 2}`                 | `['a', 'a']`                  | `[]` _(pushed off both `'a'`s)_ | **`'#'`**                 |
| `'b'`         | `{'a': 2, 'b': 1}`         | `['b']`                       | `['b']`                         | **`'b'`**                 |
| `'c'`         | `{'a': 2, 'b': 1, 'c': 1}` | `['b', 'c']`                  | `['b', 'c']`                    | **`'b'`**                 |

---

### Complexity Analysis

- **Time Complexity per `add()` call:** **Amortized $\mathcal{O}(1)$**
- Each distinct character is pushed onto the queue at most once and shifted out at most once throughout the entire lifecycle.

- **Space Complexity:** **$\mathcal{O}(\Sigma)$** where $\Sigma$ is the alphabet size (e.g., 26 for lowercase English letters). The queue never holds more elements than the total number of unique characters in the alphabet.

```js
function leastFrequent(arr) {
    if (arr.length === 0) return null;

    const freqCounter = {};
    for (const item of arr) {
        freqCounter[item] = (freqCounter[item] || 0) + 1;
    }

    let minFrequency = Infinity;
    let leastFrequentItem = null;

    for (const item in freqCounter) {
        if (freqCounter[item] < minFrequency) {
            minFrequency = freqCounter[item];
            leastFrequentItem = item;
        }
    }

    return leastFrequentItem;
}

// Example usage:
console.log(leastFrequent([1, 3, 2, 1, 2, 2, 3, 1]));

```
