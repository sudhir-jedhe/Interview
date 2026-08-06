The function `leastFrequent` works by identifying the element with the least frequency in an array. Here's an explanation of how it works and the expected behavior for your inputs.

### Explanation:
1. **Counting Occurrences**:
   - The `reduce()` function is used to build an object `count`, where the keys are the numbers in the array and the values are their respective frequencies. For example, given `[1, 1, 1, 2, 2, 2, 3, 3, 4]`, the `count` object will look like:
     ```javascript
     {
       1: 3,
       2: 3,
       3: 2,
       4: 1
     }
     ```
   
2. **Finding the Least Frequent**:
   - The `for...of` loop iterates over the entries of the `count` object. It compares the current frequency (`value`) to the minimum frequency (`minCount`). If the current frequency is smaller, it updates `minCount` and `numberWithLeastCount` (which stores the number corresponding to that frequency).

3. **Return Result**:
   - The function returns the number that has the least frequency in the array.

### Code:

```javascript
const leastFrequent = (arr) => {
    // Store the number counts in object
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

    // Find the number with least count
    for (const [key, value] of Object.entries(count)) {
        if (value < minCount) {
            minCount = value;
            numberWithLeastCount = key;
        }
    }

    return numberWithLeastCount;
};
```

### Input/Output Examples:

#### Example 1:
```javascript
console.log(leastFrequent([1, 1, 1, 2, 2, 2, 3, 3, 4])); 
// Output: 4
```
- The frequency count for each number is:
  ```javascript
  {
    1: 3,
    2: 3,
    3: 2,
    4: 1
  }
  ```
- The least frequent number is `4`, as it appears only once.

#### Example 2:
```javascript
console.log(leastFrequent([2, 2, 2, 3, 3, 3, 4, 4, 4, 2, 5, 5, 5, 6, 6]));
// Output: 6
```
- The frequency count for each number is:
  ```javascript
  {
    2: 4,
    3: 3,
    4: 3,
    5: 3,
    6: 2
  }
  ```
- The least frequent number is `6`, as it appears twice.

### Key Points:
- The function correctly finds the least frequent number in the array.
- In the case of multiple numbers with the same least frequency, it returns the **first** one encountered. For instance, in the second example, since `6` appears the least number of times compared to others (like `2`, `3`, etc.), it's selected.
- The solution uses the `reduce()` method to tally the counts, which is an elegant and efficient way to process the array.

### Edge Cases:
1. **Empty Array**:
   - If the input array is empty, the function will return `0` because `numberWithLeastCount` is initialized to `0`, and no numbers are counted. You might want to handle this edge case explicitly depending on your needs (e.g., returning `null` or `undefined` for an empty array).
   
2. **Single Element Array**:
   - If the array contains only one element, that element is trivially the least frequent.

---

### Improvements:

To handle cases like an empty array gracefully, you could add a simple check at the start of the function:

```javascript
const leastFrequent = (arr) => {
    if (arr.length === 0) return null;  // Or any value you prefer

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

    for (const [key, value] of Object.entries(count)) {
        if (value < minCount) {
            minCount = value;
            numberWithLeastCount = key;
        }
    }

    return numberWithLeastCount;
};
```

This ensures that if the array is empty, the function returns `null` or another appropriate value.