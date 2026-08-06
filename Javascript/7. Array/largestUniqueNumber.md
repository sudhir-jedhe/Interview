### Problem Explanation:
The task is to find the **largest unique number** from a given array of numbers. A unique number is one that appears exactly once in the array. If no unique numbers exist, the function should return `-1`.

### Approach:

1. **Use a frequency map**: First, we iterate through the array to build a frequency map, where each key is a number and its value is how many times that number appears in the array.
   
2. **Iterate through the frequency map**: Once we have the frequency map, we check for numbers that have a frequency of `1`. We then compare them to find the largest one.

3. **Edge case**: If no unique numbers are found (i.e., all numbers have a frequency greater than 1), return `-1`.

### Steps:
1. Traverse the input array and populate a `Map` where each key is a number, and the value is its frequency.
2. Iterate through the `Map` and find the largest number that appears exactly once.
3. If no unique number is found, return `-1`.

### Code Implementation:

```javascript
function largestUniqueNumber(nums) {
    const frequencyMap = new Map();
    
    // Step 1: Populate frequency map
    for (let num of nums) {
        if (frequencyMap.has(num)) {
            frequencyMap.set(num, frequencyMap.get(num) + 1);
        } else {
            frequencyMap.set(num, 1);
        }
    }
    
    let maxUnique = -1;
    
    // Step 2: Find the largest unique number
    for (let [num, count] of frequencyMap) {
        if (count === 1 && num > maxUnique) {
            maxUnique = num;
        }
    }
    
    return maxUnique;
}

// Example usage:
console.log(largestUniqueNumber([5, 7, 3, 9, 4, 9, 8, 3, 3])); // Output: 8
console.log(largestUniqueNumber([9, 9, 8, 8])); // Output: -1
console.log(largestUniqueNumber([1, 2, 3, 4, 5])); // Output: 5
```

### Explanation:

1. **Step 1 - Populate the frequency map**:
   - We loop through the input array `nums`. For each number, we check if it exists in `frequencyMap`:
     - If it exists, we increment its count.
     - If it doesn't exist, we set its count to `1`.
   - This gives us a map of each number and its frequency.

2. **Step 2 - Find the largest unique number**:
   - We then loop through the `frequencyMap`. For each entry (`[num, count]`), if the number `num` has a `count` of `1` (i.e., it is unique), we check if it is greater than the current `maxUnique`. If it is, we update `maxUnique`.
   - If no unique number is found, `maxUnique` remains `-1`.

3. **Edge case**:
   - If the array contains no unique numbers, the result will be `-1`.

### Time Complexity:
- **O(n)**: We traverse the array once to build the frequency map and once more to find the largest unique number. Thus, the time complexity is linear with respect to the number of elements in the input array.

### Space Complexity:
- **O(n)**: We store the frequency of each number in a `Map`, where `n` is the number of unique numbers in the array.

### Example Walkthrough:

1. **Example 1: [5, 7, 3, 9, 4, 9, 8, 3, 3]**
   - Frequency map: `{5: 1, 7: 1, 3: 3, 9: 2, 4: 1, 8: 1}`
   - The unique numbers are `5`, `7`, `4`, `8`. The largest unique number is `8`.
   - Output: `8`.

2. **Example 2: [9, 9, 8, 8]**
   - Frequency map: `{9: 2, 8: 2}`
   - There are no unique numbers.
   - Output: `-1`.

3. **Example 3: [1, 2, 3, 4, 5]**
   - Frequency map: `{1: 1, 2: 1, 3: 1, 4: 1, 5: 1}`
   - All numbers are unique, and the largest one is `5`.
   - Output: `5`.

This approach efficiently handles the task of finding the largest unique number in an array.