Your solution to find duplicates in an array is using three different approaches, each with varying time and space complexity. Let's break each of them down.

### 1. **Floyd's Tortoise and Hare (Cycle Detection)**

This approach uses the **Tortoise and Hare** algorithm to detect a cycle in the array. It treats the array elements as a linked list, where each element points to the next element, and uses the **fast** and **slow pointers** to find the duplicate. This is efficient because it operates in **O(n)** time and **O(1)** space.

#### Code:

```javascript
function findDuplicate(nums) {
    let slow = nums[0];
    let fast = nums[nums[0]];

    // Phase 1: Find the intersection point in the cycle
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }

    // Phase 2: Find the entrance to the cycle
    slow = 0;
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }

    return slow;
}

// Example usage:
console.log(findDuplicate([1, 3, 4, 2, 2])); // Output: 2
console.log(findDuplicate([3, 1, 3, 4, 2])); // Output: 3
console.log(findDuplicate([3, 3, 3, 3, 3])); // Output: 3
```

#### Explanation:
- **Phase 1**: Move `slow` by one step and `fast` by two steps to find an intersection point in the cycle. If there’s a cycle, `slow` and `fast` will eventually meet.
- **Phase 2**: To find the entrance to the cycle, we reset `slow` to `0` and move both `slow` and `fast` one step at a time. The point at which they meet again is the duplicate number.

- **Time Complexity**: O(n) (linear time to detect the cycle).
- **Space Complexity**: O(1) (constant space).

---

### 2. **Sorting Approach**

In this method, you first **sort** the array and then **scan** it for duplicates by comparing adjacent elements. This approach works well but has higher time complexity due to the sorting step.

#### Code:

```javascript
function findDuplicate(nums) {
    nums.sort((a, b) => a - b); // Sort the array
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) { // Check for adjacent duplicates
            return nums[i];
        }
    }

    return -1; // In case no duplicate is found (not expected by problem statement)
}

// Example usage:
console.log(findDuplicate([1, 3, 4, 2, 2])); // Output: 2
console.log(findDuplicate([3, 1, 3, 4, 2])); // Output: 3
console.log(findDuplicate([3, 3, 3, 3, 3])); // Output: 3
```

#### Explanation:
- **Sorting**: The array is first sorted, which brings duplicate numbers together.
- **Scanning**: We then scan through the sorted array and check if two adjacent elements are the same.

- **Time Complexity**: O(n log n) (due to sorting).
- **Space Complexity**: O(1) if the sorting is done in-place; otherwise, O(n) if not.

---

### 3. **Using a Set to Track Seen Elements**

This approach uses a `Set` to keep track of elements that have been encountered during the iteration. When we encounter a duplicate, we return it immediately.

#### Code:

```javascript
function findDuplicate(nums) {
    const seen = new Set();
    
    for (let num of nums) {
        if (seen.has(num)) {
            return num; // Return the duplicate
        }
        seen.add(num); // Add the number to the set
    }
    
    return -1; // In case no duplicate is found (not expected by problem statement)
}

// Example usage:
console.log(findDuplicate([1, 3, 4, 2, 2])); // Output: 2
console.log(findDuplicate([3, 1, 3, 4, 2])); // Output: 3
console.log(findDuplicate([3, 3, 3, 3, 3])); // Output: 3
```

#### Explanation:
- **Set**: We use a `Set` to store each number we encounter while iterating. If we encounter a number that is already in the `Set`, it’s a duplicate.
- **Efficiency**: This approach uses the set to ensure each element is checked only once.

- **Time Complexity**: O(n) (linear time to check each element).
- **Space Complexity**: O(n) (space for the `Set`).

---

### **Comparison of Approaches**

| Approach                         | Time Complexity | Space Complexity | Explanation |
|-----------------------------------|-----------------|------------------|-------------|
| **Floyd's Cycle Detection**       | O(n)            | O(1)             | Fast, uses constant space. |
| **Sorting**                       | O(n log n)      | O(1) or O(n)     | Simple but slower due to sorting. |
| **Set-based approach**            | O(n)            | O(n)             | Uses extra space but is intuitive and fast. |

---

### **Conclusion**

- **Best approach for time and space efficiency**: The **Floyd's Tortoise and Hare** cycle detection method is optimal for both time and space, making it ideal for this problem if you need the best performance.
- **Best approach for simplicity**: The **Set-based approach** is simple and easy to understand, but it uses extra space proportional to the input size.
- **Sorting**: If you don't mind the overhead of sorting, this is another viable approach, but it's slower than the other two in most cases due to the O(n log n) time complexity.

Feel free to choose the one that best fits your use case!