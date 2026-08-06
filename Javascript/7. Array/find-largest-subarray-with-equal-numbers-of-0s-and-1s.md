Your solution to the problem is about finding the longest contiguous subarray where the number of 0s and 1s are equal. You have provided two different implementations for this. Let's break them down.

### First Implementation: Brute-force Approach
This approach uses two loops to count 0s and 1s in every subarray and checks if they are equal.

#### Code:
```javascript
const solution = (arr) => {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        // To track the count
        let count = {
            0: 0,
            1: 0
        };
        
        for (let j = i; j < arr.length; j++) {
            // Increase the count of the respective number
            count[arr[j]]++;
            
            // If count[0] equals count[1], then check for the maximum length
            if (count[0] === count[1]) {
                max = Math.max(max, count[0] * 2);
            }
        }
    }
    return max;
};
```

#### How it works:
1. The outer loop starts from index `i` and the inner loop goes from `i` to the end of the array.
2. For each subarray from index `i` to `j`, we count the number of 0s and 1s.
3. If the counts of 0s and 1s are equal, we update `max` to be the maximum of the current `max` and the length of the current subarray, which is `count[0] * 2`.
4. Finally, we return the maximum length found.

#### Time Complexity:
- The outer loop runs `n` times, and the inner loop runs at most `n` times for each iteration of the outer loop.
- Therefore, the time complexity of this approach is O(n²).

---

### Second Implementation: Optimized Approach using HashMap
The second approach optimizes the brute-force solution using a **hash map** to store the cumulative sum and uses this to find the longest subarray with equal 0s and 1s.

#### Code:
```javascript
const solution = (arr) => {
    let hM = new Map();
    let sum = 0;
    let max_len = 0;
    let end_index = -1;
    let n = arr.length;

    // Change all 0's to -1
    for (let i = 0; i < n; i++) {
        arr[i] = arr[i] === 0 ? -1 : 1;
    }

    for (let i = 0; i < n; i++) {
        // Cumulate the sum
        sum += arr[i];

        // If sum is 0, then there are equal numbers of -1 and 1 so store the length
        if (sum === 0) {
            max_len = i + 1;
            end_index = i;
        }

        // If sum has already been seen before, calculate the length of subarray
        if (hM.has(sum + n)) {
            if (max_len < i - hM.get(sum + n)) {
                max_len = i - hM.get(sum + n);
                end_index = i;
            }
        } else {
            // Store the sum and its index
            hM.set(sum + n, i);
        }
    }

    return max_len;
};
```

#### How it works:
1. **Transforming the Array**: The array is modified so that all `0`s are converted to `-1`s. This helps us simplify the logic since now we are looking for a subarray whose sum is zero (equal number of `1`s and `-1`s).
   
2. **Cumulative Sum**: We maintain a `sum` variable that accumulates the values as we go through the array:
    - If the sum becomes zero at any point, it means from the start to this index, we have equal numbers of `1`s and `-1`s (or `0`s and `1`s in the original array).
   
3. **HashMap to Store Cumulative Sums**: We use a hash map (`hM`) to store the first occurrence of each cumulative sum. The key is `sum + n` (to handle negative indices), and the value is the index at which that sum first occurred.
   
4. If the same cumulative sum has been seen before, it means there exists a subarray between the previous index and the current index with an equal number of `0`s and `1`s. We calculate the length of the subarray and update `max_len` if this subarray is longer than the current longest.

5. The hash map helps us to efficiently find the subarray with a zero sum in constant time, making this solution much faster.

#### Time Complexity:
- The time complexity of this approach is O(n), as we only iterate through the array once and perform constant time operations (hash map lookups and updates) for each element.

---

### Testing the Solution:
Let's test the optimized solution with the given input:

```javascript
console.log(solution([0, 0, 1, 0, 0, 0, 1, 1]));  // Output: 6
console.log(solution([0, 1, 1, 0, 1, 1, 1, 0]));  // Output: 4
```

### Expected Output:

```
6  // Longest subarray is [1, 0, 0, 0, 1, 1] (Length 6)
4  // Longest subarray is [1, 0, 1, 0] (Length 4)
```

### Conclusion:
- The **first implementation** is correct but has a time complexity of O(n²) due to the nested loops.
- The **second implementation** is much more efficient with a time complexity of O(n) using a hash map to track the cumulative sum.

The second approach is the preferred solution for large arrays due to its linear time complexity.