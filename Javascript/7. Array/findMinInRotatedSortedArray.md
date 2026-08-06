```js

function findMinInRotatedSortedArray(nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        // Check if the mid element is greater than the rightmost element
        if (nums[mid] > nums[right]) {
            // Minimum is in the right half
            left = mid + 1;
        } else {
            // Minimum is in the left half (including mid)
            right = mid;
        }
    }

    // When left == right, we've found the minimum
    return nums[left];
}

// Example usage:
const arr = [4, 5, 6, 7, 0, 1, 2];
console.log(findMinInRotatedSortedArray(arr)); // Output: 0
```

Your implementation of the `findMinInRotatedSortedArray` function is correct! It uses a binary search approach to efficiently find the minimum element in a rotated sorted array. Here's a breakdown of how it works:

### Explanation:

1. **Input**: A rotated sorted array (e.g., `[4, 5, 6, 7, 0, 1, 2]`).

2. **Binary Search**:
   - The algorithm uses two pointers, `left` and `right`, to search the array.
   - `mid` is calculated as the middle index between `left` and `right`.
   - If `nums[mid]` is greater than `nums[right]`, this indicates that the minimum element lies in the right half of the array (since the smallest value must be at the point of rotation, which is after the larger values).
   - Otherwise, the minimum element lies in the left half (or could be `mid` itself).

3. **When the loop exits**, `left` and `right` will converge to the index of the minimum element.

### Example Walkthrough:

For the input array `[4, 5, 6, 7, 0, 1, 2]`:

1. **First iteration**:
   - `left = 0`, `right = 6`, `mid = 3` (value `nums[3] = 7`)
   - Since `nums[mid] > nums[right]` (`7 > 2`), the minimum is in the right half, so `left = mid + 1 = 4`.

2. **Second iteration**:
   - `left = 4`, `right = 6`, `mid = 5` (value `nums[5] = 1`)
   - Since `nums[mid] <= nums[right]` (`1 <= 2`), the minimum is in the left half, so `right = mid = 5`.

3. **Third iteration**:
   - `left = 4`, `right = 5`, `mid = 4` (value `nums[4] = 0`)
   - Since `nums[mid] <= nums[right]` (`0 <= 1`), the minimum is in the left half, so `right = mid = 4`.

At this point, `left == right`, so the loop terminates and returns `nums[left]`, which is `0`, the smallest value in the rotated sorted array.

### Time Complexity:
- **Time complexity**: \(O(\log n)\), where \(n\) is the length of the array. The algorithm reduces the search space by half in each iteration, making it efficient.
- **Space complexity**: \(O(1)\), as only a few variables (`left`, `right`, `mid`) are used for the binary search, and no additional space is required.

### Final Output:

```javascript
const arr = [4, 5, 6, 7, 0, 1, 2];
console.log(findMinInRotatedSortedArray(arr)); // Output: 0
```

The function works as expected, returning `0`, the minimum value in the rotated sorted array.