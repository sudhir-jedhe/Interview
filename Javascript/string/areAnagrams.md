```js
areAnagrams("cinema", "iceman"); // Output: true
areAnagrams("restful", "fluster"); // Output: true
areAnagrams("hello", "world"); // Output: false
areAnagrams("eat", "ate"); // Output: false

export const areAnagrams = (strOne, strTwo) => {
  strOne = strOne.toLowerCase();
  strTwo = strTwo.toLowerCase();

  if (strOne.length !== strTwo.length) {
    return false;
  }

  const sortedStrOne = strOne.split("").sort().join("");
  const sortedStrTwo = strTwo.split("").sort().join("");

  return sortedStrOne === sortedStrTwo;
};
```

```js
export const areAnagrams = (strOne, strTwo) => {
  if (strOne.length !== strTwo.length) return false;

  const s1 = strOne.toLowerCase();
  const s2 = strTwo.toLowerCase();
  const charCounts = {};

  for (let char of s1) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }

  for (let char of s2) {
    if (!charCounts[char]) return false;
    charCounts[char]--;
  }

  return true;
};
```

To ignore non-alphanumeric characters (spaces, punctuation, symbols), strip them out using a regular expression (`/[^a-z0-9]/g`) before running the comparison logic.

Here are the updated implementations for both the frequency map ($O(N)$) and sorting ($O(N \log N)$) approaches:

### Option 1: Frequency Map Approach ($O(N)$ — Optimal)

```js
export const areAnagrams = (strOne, strTwo) => {
  // Strip all non-alphanumeric characters and normalize to lowercase
  const s1 = strOne.toLowerCase().replace(/[^a-z0-9]/g, "");
  const s2 = strTwo.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (s1.length !== s2.length) return false;

  const charCounts = {};

  for (let char of s1) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }

  for (let char of s2) {
    if (!charCounts[char]) return false;
    charCounts[char]--;
  }

  return true;
};

// Examples:
console.log(areAnagrams("A decimal point!", "I'm a dot in place.")); // true
console.log(areAnagrams("Dormitory!", "Dirty room?"));             // true
console.log(areAnagrams("Conversation", "Voices rant on!!"));      // true

```

---

### Option 2: Sorting Approach ($O(N \log N)$)

If you prefer keeping the shorter syntax:

```js
export const areAnagrams = (strOne, strTwo) => {
  const cleanStrOne = strOne.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanStrTwo = strTwo.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (cleanStrOne.length !== cleanStrTwo.length) return false;

  const sortedOne = cleanStrOne.split("").sort().join("");
  const sortedTwo = cleanStrTwo.split("").sort().join("");

  return sortedOne === sortedTwo;
};

```

### Regex Breakdown

* `/[^a-z0-9]/g`
* `^` inside square brackets means **NOT**.
* `a-z0-9` matches any lowercase letter or digit.
* `/g` flag ensures **all** non-alphanumeric characters are replaced, not just the first one.

To group an array of strings into anagrams (e.g., `["eat", "tea", "tan", "ate", "nat", "bat"]` $\rightarrow$ `[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]`), use a **Map or Hash Object** where the key is a normalized "signature" representing the sorted characters of each word.

---

### Implementation: Frequency/Sorted Key Map ($O(N \cdot K \log K)$)

This is the standard, cleanest solution. Each word is sorted alphabetically to generate a unique key. Words with identical sorted characters map to the same array bucket.

```javascript
const groupAnagrams = (words) => {
  const map = new Map();

  for (const word of words) {
    // Standardize: option to strip non-alphanumeric/lowercase if needed
    const sortedKey = word.toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");

    if (!map.has(sortedKey)) {
      map.set(sortedKey, []);
    }
    map.get(sortedKey).push(word);
  }

  return Array.from(map.values());
};

// Example Usage
const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log(groupAnagrams(words));
// Output:
// [
//   ["eat", "tea", "ate"],
//   ["tan", "nat"],
//   ["bat"]
// ]

```

---

### Optimal Implementation: Character Count Key ($O(N \cdot K)$)

If performance is critical or word lengths ($K$) are extremely large, avoid sorting altogether by building a fixed-size character frequency array (e.g., `#1#0#0...`) as the Map key:

```javascript
const groupAnagramsOptimal = (words) => {
  const map = new Map();

  for (const word of words) {
    // Create a frequency counter array for 26 lowercase English letters
    const count = new Array(26).fill(0);
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");

    for (const char of cleanWord) {
      count[char.charCodeAt(0) - 97]++; // 97 is 'a'
    }

    // Convert frequency array into a unique key string, e.g., "#1#0#0#0#1..."
    const key = count.join("#");

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(word);
  }

  return Array.from(map.values());
};

```

### Complexity Comparison

* **Sorting Approach:** $O(N \cdot K \log K)$ time, where $N$ is the number of words and $K$ is the maximum word length.
* **Frequency Count Approach:** $O(N \cdot K)$ time, linear time optimal.
