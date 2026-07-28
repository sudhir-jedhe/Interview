```js
import { smallerNumbersThanCurrent } from "./smallerNumbersThanCurrent.js";

const nums = [8, 1, 2, 2, 3];
console.log(smallerNumbersThanCurrent(nums)); // Output: [4, 0, 1, 1, 3]

export function smallerNumbersThanCurrent(nums) {
  const counts = [];

  for (let i = 0; i < nums.length; i++) {
    let count = 0;
    for (let j = 0; j < nums.length; j++) {
      if (nums[j] < nums[i]) {
        count++;
      }
    }
    counts.push(count);
  }

  return counts;
}
```

// creating a function that, given an array nums, determines how many numbers in
// the array are smaller than each element. For each element nums[i], the
// function must count the number of valid j's such that j != i and nums[j] <
// nums[i]. The final output should be an array of the same length, containing
// the counts of smaller numbers for each element.

Your solution works fine, but it has a time complexity of **O(n²)** because for each element `nums[i]`, you're iterating through the entire array to count how many numbers are smaller. This results in nested loops. While this is acceptable for small arrays, it can be inefficient for large arrays.

We can improve the performance to **O(n log n)** using sorting and a hashmap.

### **Optimized Approach (O(n log n)):**

1. **Sort the array** to determine the order of the elements.
2. **Use a hashmap** to record how many numbers are smaller than each number. Since the sorted array will have the numbers in ascending order, we can assign the index of the first occurrence of each number as the number of elements smaller than it.
3. After sorting, we can efficiently create the result by using the hashmap to look up the number of smaller elements for each number in the original array.

### **Optimized Code:**

```javascript
// smallerNumbersThanCurrent.js
export function smallerNumbersThanCurrent(nums) {
  // Create a sorted copy of the array and store the original indices
  const sortedNums = [...nums];
  sortedNums.sort((a, b) => a - b);

  // Create a hashmap to store the number of smaller numbers for each number
  const smallerCount = {};

  // Loop through the sorted array and record the count of smaller numbers
  for (let i = 0; i < sortedNums.length; i++) {
    // If the number hasn't been seen before, its "smaller count" is its index in the sorted array
    if (smallerCount[sortedNums[i]] === undefined) {
      smallerCount[sortedNums[i]] = i;
    }
  }

  // For each number in the original array, look up the smaller count from the hashmap
  return nums.map((num) => smallerCount[num]);
}

// main.js
import { smallerNumbersThanCurrent } from "./smallerNumbersThanCurrent.js";

const nums = [8, 1, 2, 2, 3];
console.log(smallerNumbersThanCurrent(nums)); // Output: [4, 0, 1, 1, 3]
```

### **Explanation:**

1. **Sorting the array**:
   - We start by creating a sorted copy of `nums` called `sortedNums`. This helps us determine how many elements are smaller than each element in the array.

2. **Storing counts in a hashmap**:
   - As we loop through `sortedNums`, we keep track of the index of the first occurrence of each number. This index tells us how many numbers are smaller than that number (because in a sorted array, all smaller numbers will come before the current number).
   - We store this count in the `smallerCount` object, where the key is the number and the value is its count of smaller numbers.

3. **Generating the result**:
   - Finally, we use `nums.map()` to generate the result array by looking up the smaller number count for each element in the original array using the `smallerCount` hashmap.

### **Time Complexity**:

- Sorting the array takes **O(n log n)** time.
- Building the `smallerCount` hashmap and generating the result both take **O(n)** time.
  So, the overall time complexity is **O(n log n)**.

### **Test Case**:

For the input:

```javascript
const nums = [8, 1, 2, 2, 3];
```

**Expected Output**:

```javascript
[4, 0, 1, 1, 3];
```

This optimized solution should work efficiently even for larger arrays.
