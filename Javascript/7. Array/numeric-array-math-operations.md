These functions are great for performing various numerical operations on arrays. Below, I'll provide a more structured explanation of each function, its purpose, and how it's implemented, including a few improvements and additional comments for clarity.

---

### 1. **Sum of an Array**

The sum of an array is the result of adding all the numbers together. 

- **How it works**: 
  - The `reduce()` method is used to accumulate the sum of the elements in the array.
  - The accumulator (`acc`) is initialized to 0, and each value (`val`) is added to it.

```javascript
const sum = (...arr) =>
  [...arr].reduce((acc, val) => acc + val, 0);

console.log(sum(1, 2, 3, 4)); // Output: 10
console.log(sum(...[1, 2, 3, 4])); // Output: 10
```

---

### 2. **Average of an Array**

The average of an array is the sum of all elements divided by the number of elements.

- **How it works**:
  - We use `reduce()` to calculate the sum of the array and then divide it by the array's length to get the average.

```javascript
const average = (...arr) =>
  [...arr].reduce((acc, val) => acc + val, 0) / arr.length;

console.log(average(...[1, 2, 3])); // Output: 2
console.log(average(1, 2, 3)); // Output: 2
```

---

### 3. **Product of an Array**

The product of an array is the result of multiplying all the numbers together.

- **How it works**:
  - Again, `reduce()` is used, but this time the accumulator is initialized to `1` (since multiplying by 1 doesn’t affect the result), and each value is multiplied with the accumulator.

```javascript
const prod = (...arr) =>
  [...arr].reduce((acc, val) => acc * val, 1);

console.log(prod(1, 2, 3, 4)); // Output: 24
console.log(prod(...[1, 2, 3, 4])); // Output: 24
```

---

### 4. **Median of an Array**

The median is the middle element when the array is sorted. If the array has an odd length, the middle element is the median. If the array has an even length, the median is the average of the two middle elements.

- **How it works**:
  - First, the array is sorted in ascending order using `sort()`.
  - Then, if the array has an odd length, the middle element is selected. If it has an even length, the average of the two middle elements is returned.

```javascript
const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

console.log(median([5, 6, 50, 1, -5])); // Output: 5
```

---

### 5. **Weighted Average of an Array**

The weighted average takes into account the relative importance of each number in the array by multiplying each number by a corresponding weight, summing the results, and then dividing by the sum of the weights.

- **How it works**:
  - We use `reduce()` to accumulate the sum of each number multiplied by its corresponding weight, and also accumulate the sum of the weights. The weighted average is the ratio of these two sums.

```javascript
const weightedAverage = (nums, weights) => {
  const [sum, weightSum] = weights.reduce(
    (acc, w, i) => {
      acc[0] = acc[0] + nums[i] * w;
      acc[1] = acc[1] + w;
      return acc;
    },
    [0, 0]
  );
  return sum / weightSum;
};

console.log(weightedAverage([1, 2, 3], [0.6, 0.2, 0.3])); // Output: 1.72727
```

---

### 6. **Standard Deviation of an Array**

The standard deviation is a measure of how spread out the values in the array are from the mean. To calculate it:
  1. Find the mean of the array.
  2. Calculate the variance (average of squared differences from the mean).
  3. Take the square root of the variance to get the standard deviation.

- **How it works**:
  - First, we calculate the mean of the array using `reduce()`.
  - Then, we calculate the squared differences between each value and the mean.
  - Finally, the variance is calculated and the square root of it gives the standard deviation.

  You can also calculate the **population standard deviation** by adjusting the formula for variance, i.e., using the length of the array rather than `length - 1`.

```javascript
const standardDeviation = (arr, usePopulation = false) => {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(
    arr
      .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
      .reduce((acc, val) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1))
  );
};

console.log(standardDeviation([10, 2, 38, 23, 38, 23, 21])); // Output: 13.28 (sample)
console.log(standardDeviation([10, 2, 38, 23, 38, 23, 21], true)); // Output: 12.30 (population)
```

---

### **Improvement Ideas**:
- **Edge Cases**: Handle arrays with no elements (empty arrays) or arrays with one element.
  - **Empty arrays**: The mean, standard deviation, etc., for an empty array should throw an error or return `NaN`.
  - **Single-element arrays**: The median is the element itself; for the standard deviation, it should be `0` because there’s no variation.

- **Input Validation**: It’s a good practice to validate the inputs (e.g., ensure that the arrays contain only numbers).

---

### **Summary**:
These functions cover common operations like summing, averaging, and calculating the standard deviation of an array. Using JavaScript's `reduce()` method, you can easily iterate over arrays and accumulate the results. By taking advantage of the spread operator (`...`), these functions also allow variadic input, making them flexible for various types of input, including both individual numbers and arrays.

Let me know if you need further clarification or additional examples!