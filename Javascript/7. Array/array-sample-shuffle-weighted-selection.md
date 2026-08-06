### Sampling, Shuffling, and Weighted Selection in JavaScript Arrays

When working with arrays in JavaScript, there are common tasks such as randomly selecting elements, shuffling the order of elements, or selecting based on weighted probabilities. These operations are essential for tasks like random sampling, games, simulations, and algorithms that need stochastic behavior. Below are solutions for these tasks using different methods.

---

### 1. **Shuffle an Array**

Shuffling an array is a way to reorder the elements randomly. The **Fisher-Yates Shuffle** (also known as the **Knuth Shuffle**) is the most efficient and unbiased way to achieve this.

**Fisher-Yates Shuffle Algorithm**:
- This algorithm loops through the array from the last element to the first, and for each element, swaps it with a randomly chosen element that comes before it (including itself).

Here's the implementation:

```javascript
const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);  // Random index within the current range
    [arr[m], arr[i]] = [arr[i], arr[m]];       // Swap elements at indices m and i
  }
  return arr;
};

const foo = [1, 2, 3];
shuffle(foo);  // [2, 3, 1], the array is shuffled in place
console.log(foo); // Original array remains unchanged
```

- **Why Fisher-Yates?**: This method is unbiased because every permutation of the array is equally likely, and it has an **O(n)** time complexity, making it very efficient for large arrays.

---

### 2. **Sample a Random Element from an Array**

To sample a random element from an array, we can generate a random index between `0` and the array's length, and return the element at that index.

```javascript
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

console.log(sample([3, 7, 9, 11]));  // Random element, e.g., 9
```

- `Math.random()` generates a number between `0` and `1`.
- `Math.floor(Math.random() * arr.length)` scales that number to be a valid array index (between `0` and `arr.length - 1`).

---

### 3. **Sample Multiple Random Elements from an Array**

To sample multiple elements, we can shuffle the array and then take the first `n` elements. If no `n` is provided, it defaults to 1.

```javascript
const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

const sampleSize = ([...arr], n = 1) => shuffle(arr).slice(0, n);

console.log(sampleSize([1, 2, 3], 2));  // Sample 2 elements: [3, 1]
console.log(sampleSize([1, 2, 3], 4));  // Sample all elements: [2, 3, 1]
```

- **How it works**:
  - `shuffle(arr)` randomizes the array.
  - `.slice(0, n)` then returns the first `n` elements from the shuffled array.

---

### 4. **Weighted Sample from an Array**

In some cases, you may want to sample elements based on different weights or probabilities. For example, an item with a higher weight should have a higher chance of being selected.

To implement this:
1. Use the `weights` array to create cumulative sums (partial sums).
2. Generate a random number between `0` and `1` (like a roll of a die).
3. Use `findIndex` to find the index corresponding to the random number, based on the cumulative weights.

Here's how you can implement **weighted sampling**:

```javascript
const weightedSample = (arr, weights) => {
  let roll = Math.random();  // Generate a random number between 0 and 1
  return arr[
    weights
      .reduce((acc, w, i) => (i === 0 ? [w] : [...acc, acc[acc.length - 1] + w]), [])
      .findIndex((v, i, s) => roll >= (i === 0 ? 0 : s[i - 1]) && roll < v)
  ];
};

console.log(weightedSample([3, 7, 9, 11], [0.1, 0.2, 0.6, 0.1]));  // Randomly returns 3, 7, 9, or 11 based on weights
```

### Explanation:

- `weights.reduce()` computes cumulative sums, so each value is compared against the running total.
- `findIndex()` locates the element whose cumulative sum covers the random number (`roll`).
- **The `weights` array** defines the probability distribution for the elements in `arr`. For example, if `arr = [3, 7, 9, 11]` and `weights = [0.1, 0.2, 0.6, 0.1]`, the probability of selecting `9` is 60%, and the probability of selecting `7` is 20%, and so on.

### Key Notes:
- **Why cumulative sums?**: By converting the weights to cumulative sums, we create intervals that correspond to the relative probability of each element being selected.
- **Efficiency**: This method has a time complexity of **O(n)** for the `reduce` and `findIndex`, making it efficient enough for moderate-sized arrays and weighted selections.

---

### Summary

1. **Shuffle**: Use the Fisher-Yates algorithm for an unbiased and efficient array shuffle.
2. **Random Element Selection**: Use `Math.random()` to sample a single random element from the array.
3. **Multiple Random Elements**: Shuffle the array and slice the first `n` elements.
4. **Weighted Sampling**: Generate cumulative sums from weights and use a random number to select an element based on the weight distribution.

Each of these techniques is simple to implement and useful for a wide range of problems, from random sampling to implementing weighted lotteries.