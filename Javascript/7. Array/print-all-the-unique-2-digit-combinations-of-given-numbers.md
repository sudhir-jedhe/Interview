To print all unique 2-digit combinations from a given array of numbers, your approach is mostly correct. However, there are a couple of improvements that can be made for clarity and functionality:

1. **Removing duplicates**: You correctly use a `Set` to remove duplicates.
2. **Generating combinations**: The inner loop is used correctly to generate unique pairs of numbers.
3. **Better formatting**: The result can be formatted nicely (e.g., space between the numbers, line break after each pair).

Here is the updated and clean implementation that prints all unique 2-digit combinations:

### Code:

```javascript
let combinations = (arr) => {
    // Remove duplicate numbers by converting to a Set and then back to an array
    let set = new Set(arr);
    arr = [...set];

    // Print all unique 2-digit combinations
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            console.log(arr[i], arr[j]);  // Print the combination
        }
    }
};

// Example usage:
combinations([1, 2, 3]);
// Output:
// 1 2
// 1 3
// 2 3

combinations([1, 2, 3, 4, 5]);
// Output:
// 1 2
// 1 3
// 1 4
// 1 5
// 2 3
// 2 4
// 2 5
// 3 4
// 3 5
// 4 5
```

### Explanation:
1. **Set to remove duplicates**: The `Set` constructor removes duplicate elements from the array automatically.
2. **Nested loops**: The outer loop iterates over the elements of the array, and the inner loop finds the combination pairs by starting from the next element (i.e., `i + 1`) to avoid repeating pairs.
3. **Printing pairs**: The `console.log` statement prints each unique pair of numbers.

### Output:
For input `[1, 2, 3]`, the output will be:

```
1 2
1 3
2 3
```

For input `[1, 2, 3, 4, 5]`, the output will be:

```
1 2
1 3
1 4
1 5
2 3
2 4
2 5
3 4
3 5
4 5
```

This solution guarantees that all unique pairs are printed, without repetitions.