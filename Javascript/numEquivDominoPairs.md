The problem you're tackling is to count the number of equivalent domino pairs in an array of dominoes. Two dominoes are considered equivalent if one can be rotated to match the other. In this context, the pair `[a, b]` is equivalent to `[b, a]`, which means order doesn't matter, only the values on the dominoes themselves.

### Breakdown of the Approach:

1. **Normalize Domino Representation**:  
   Each domino has two values `[a, b]`. To account for rotations (i.e., `[a, b]` is the same as `[b, a]`), we will sort each domino. For example:
   - `[1, 2]` will be stored as `1:2`
   - `[2, 1]` will also be stored as `1:2`

   This way, both `[1, 2]` and `[2, 1]` are treated as equivalent.

2. **Count Occurrences**:  
   We can use a map (`countMap`) to store how many times each unique normalized domino appears. The key in this map will be the sorted domino, and the value will be the count of occurrences.

3. **Calculate the Number of Pairs**:  
   Once we have the counts of each unique domino, we can calculate the number of pairs for each unique domino using the combination formula:

   \[
   \text{Pairs for a domino with count } c = \frac{c \times (c - 1)}{2}
   \]

   This formula counts the number of ways to pick 2 dominoes out of `c` dominoes.

### Steps to Solve:

1. **Normalize each domino** by sorting it.
2. **Store the count** of each unique domino in a map.
3. **Calculate the number of equivalent pairs** using the formula.

### Code Implementation:

```javascript
// numEquivDominoPairs.js
export function numEquivDominoPairs(dominoes) {
  const countMap = new Map();
  let pairs = 0;

  // Step 1: Count occurrences of each unique normalized domino
  for (const domino of dominoes) {
    // Sort each domino to ensure that [a, b] and [b, a] are treated the same
    const key =
      domino[0] < domino[1]
        ? `${domino[0]}:${domino[1]}`
        : `${domino[1]}:${domino[0]}`;

    // Increment the count of the current domino
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  // Step 2: Calculate the number of equivalent pairs
  for (const count of countMap.values()) {
    pairs += (count * (count - 1)) / 2; // Combination formula C(n, 2)
  }

  return pairs;
}
```

### Example:

Let's consider the example tests you provided:

#### Example 1:

```javascript
const dominoes = [
  [1, 2],
  [2, 1],
  [3, 4],
  [5, 6],
];

console.log(numEquivDominoPairs(dominoes)); // Output: 1
```

- In this example:
  - `[1, 2]` and `[2, 1]` are equivalent, so we count 1 pair.
  - The other dominoes `[3, 4]` and `[5, 6]` are unique and don't form any pairs.

Thus, the output is `1`.

#### Example 2:

```javascript
const dominoes = [
  [1, 2],
  [1, 2],
  [1, 1],
  [1, 2],
  [2, 2],
];

console.log(numEquivDominoPairs(dominoes)); // Output: 3
```

- In this example:
  - `[1, 2]` appears 3 times, so the number of pairs for this domino is `C(3, 2) = 3`.
  - The other dominoes `[1, 1]` and `[2, 2]` are unique and don't form any pairs.

Thus, the output is `3`.

### Time Complexity:

- **Normalizing each domino** takes `O(1)` because we only need to check the order of two numbers.
- **Building the count map** involves iterating over all dominoes, so it's `O(n)`, where `n` is the number of dominoes.
- **Calculating pairs** involves iterating over the entries of the count map, which at most contains `n` entries, so it's also `O(n)` in the worst case.

Thus, the overall time complexity is **O(n)**.

### Space Complexity:

- The space complexity is determined by the size of the `countMap`. In the worst case, each domino is unique, so the space complexity is **O(n)**.

### Full Example of Usage:

```javascript
import { numEquivDominoPairs } from "./numEquivDominoPairs.js";

const dominoes1 = [
  [1, 2],
  [2, 1],
  [3, 4],
  [5, 6],
];
console.log(numEquivDominoPairs(dominoes1)); // Output: 1

const dominoes2 = [
  [1, 2],
  [1, 2],
  [1, 1],
  [1, 2],
  [2, 2],
];
console.log(numEquivDominoPairs(dominoes2)); // Output: 3
```

This code will correctly calculate the number of equivalent domino pairs for any input array of dominoes.
