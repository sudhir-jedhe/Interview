The most efficient and clean way to find common elements (array intersection) in JavaScript depends on whether you want **unique common values** or to preserve duplicates.

---

### Method 1: Using `Set` (Optimal for Unique Values)

* **Time Complexity:** $O(n + m)$
* **Space Complexity:** $O(n)$

```javascript
function findCommonElements(arr1, arr2) {
  const set1 = new Set(arr1);
  // Filter arr2 against set1, then wrap in a Set to remove duplicate matches
  return [...new Set(arr2.filter(item => set1.has(item)))];
}

// Example:
const a = [1, 2, 2, 3, 4];
const b = [2, 2, 4, 6, 7];

console.log(findCommonElements(a, b)); 
// Output: [2, 4]

```

---

### Method 2: Modern ES2024 `Set.prototype.intersection()`

* Native browser support across modern runtimes (Node 22+, Chrome 122+, Safari 17+).

```javascript
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

const common = [...setA.intersection(setB)];
console.log(common); 
// Output: [3, 4]

```

---

### Method 3: Preserving Multiplicity / Duplicates (Multiset Intersection)

If `[2, 2]` appears in both arrays and you want both occurrences matched:

* **Time Complexity:** $O(n + m)$

```javascript
function findCommonWithDuplicates(arr1, arr2) {
  const countMap = new Map();
  for (const num of arr1) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  const result = [];
  for (const num of arr2) {
    if (countMap.get(num) > 0) {
      result.push(num);
      countMap.set(num, countMap.get(num) - 1);
    }
  }

  return result;
}

// Example:
const a = [1, 2, 2, 1];
const b = [2, 2];

console.log(findCommonWithDuplicates(a, b)); 
// Output: [2, 2]

```

---

### Method 4: For Pre-Sorted Arrays (Two Pointers)

* **Time Complexity:** $O(n + m)$
* **Space Complexity:** $O(1)$ auxiliary space

```javascript
function findCommonSorted(arr1, arr2) {
  let i = 0, j = 0;
  const result = [];

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] === arr2[j]) {
      // Avoid duplicate inserts
      if (result.length === 0 || result[result.length - 1] !== arr1[i]) {
        result.push(arr1[i]);
      }
      i++;
      j++;
    } else if (arr1[i] < arr2[j]) {
      i++;
    } else {
      j++;
    }
  }

  return result;
}

// Example:
console.log(findCommonSorted([1, 2, 4, 5, 6], [2, 3, 5, 7])); 
// Output: [2, 5]

```
