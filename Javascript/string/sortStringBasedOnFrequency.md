```js
const frequencySort = function (s) {
  const frequency = s.split("").reduce((a, b) => {
    a[b] ? a[b]++ : (a[b] = 1);
    return a;
  }, {});

  const sortedCharactersArr = Object.keys(frequency).sort((a, b) => {
    if (frequency[a] > frequency[b]) {
      return -1;
    }

    if (frequency[a] < frequency[b]) {
      return 1;
    }

    return 0;
  });

  const str = sortedCharactersArr.reduce((a, b) => {
    a += b.repeat(frequency[b]);
    return a;
  }, "");

  return str;
};

Input: console.log(frequencySort("tree"));
console.log(frequencySort("cccaaa"));

Output: "eetr";
("aaaccc");
```

Your code solves **LeetCode 451 ("Sort Characters By Frequency")** correctly! You accurately count character frequencies, sort the unique keys descending by frequency, and rebuild the string using `String.prototype.repeat`.

Here are a few ways to refine your solution for **cleaner syntax**, **better time complexity**, and **handling special cases like upper/lowercase letters**.

---

### 1. Modernizing Syntax (`Map` + `sort`)

Instead of using plain objects and `reduce` with ternary assignments, `Map` provides better key-type guarantees, and `.sort((a, b) => freq[b] - freq[a])` makes the comparator cleaner:

```javascript
const frequencySort = function (s) {
  // 1. Build frequency map
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // 2. Sort unique characters by frequency descending
  const sortedChars = Array.from(freq.keys()).sort(
    (a, b) => freq.get(b) - freq.get(a)
  );

  // 3. Reconstruct string
  return sortedChars.map((char) => char.repeat(freq.get(char))).join("");
};

console.log(frequencySort("tree"));   // "eert" (or "eetr")
console.log(frequencySort("cccaaa")); // "cccaaa" (or "aaaccc")
console.log(frequencySort("Aabb"));   // "bbAa"

```

---

### 2. Linear Time Optimization: Bucket Sort ($\mathcal{O}(N)$ Time)

Sorting the unique characters takes $\mathcal{O}(K \log K)$ time (where $K$ is the number of unique characters).

By using **Bucket Sort**, where the array index represents the character frequency, you can achieve true **$\mathcal{O}(N)$ time complexity**:

```javascript
const frequencySortBucket = function (s) {
  // 1. Count frequencies
  const freq = {};
  for (const char of s) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // 2. Group characters into frequency buckets
  // Bucket index = frequency count
  const buckets = Array.from({ length: s.length + 1 }, () => []);
  for (const [char, count] of Object.entries(freq)) {
    buckets[count].push(char);
  }

  // 3. Iterate buckets backward (highest frequency first)
  let result = "";
  for (let i = buckets.length - 1; i > 0; i--) {
    for (const char of buckets[i]) {
      result += char.repeat(i);
    }
  }

  return result;
};

console.log(frequencySortBucket("tree"));   // "eert"
console.log(frequencySortBucket("cccaaa")); // "aaaccc"

```

---

### Algorithm Comparison

| Approach                        | Time Complexity             | Space Complexity | Best For                    |
| ------------------------------- | --------------------------- | ---------------- | --------------------------- |
| **Object + `sort` (Your Code)** | $\mathcal{O}(N + K \log K)$ | $\mathcal{O}(N)$ | General use                 |
| **`Map` + `sort**`              | $\mathcal{O}(N + K \log K)$ | $\mathcal{O}(N)$ | Clean syntax / Modern JS    |
| **Bucket Sort**                 | **$\mathcal{O}(N)$**        | $\mathcal{O}(N)$ | High-performance / LeetCode |

*(Where $N$ is string length and $K$ is the number of unique characters).*
