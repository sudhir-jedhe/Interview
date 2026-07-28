The provided code contains multiple variations of the same task, which is to move all zeros in an array to the end while maintaining the order of the non-zero elements. Let’s go through each version, explain how they work, and analyze their performance.

### **1. First Approach: Two-pointer approach (in-place)**

```javascript
function moveZeroes(nums) {
  let nonZeroPointer = 0;

  // Move non-zero elements to the beginning of the array
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[nonZeroPointer] = nums[i];
      nonZeroPointer++;
    }
  }

  // Fill the remaining elements with zeroes
  for (let i = nonZeroPointer; i < nums.length; i++) {
    nums[i] = 0;
  }

  return nums;
}

// Test cases
console.log(moveZeroes([0, 1, 0, 3, 12])); // Output: [1,3,12,0,0]
console.log(moveZeroes([1, 0, 0, 4, 5])); // Output: [1,4,5,0,0]
console.log(moveZeroes([0])); // Output: [0]
```

#### **Explanation**:

- This approach uses two loops to move non-zero elements to the front of the array and then fills the remaining elements with zeros.
  1. The first loop moves non-zero elements to the front by tracking the position of the last non-zero element (`nonZeroPointer`).
  2. The second loop fills the rest of the array with zeros, starting from `nonZeroPointer`.
- **Time Complexity**: O(n) — The array is iterated twice.
- **Space Complexity**: O(1) — This approach modifies the input array in place.

---

### **2. Second Approach: Two-pointer approach (with a different variable name)**

```javascript
function moveZeroesToEnd(arr) {
  let lastNonZeroIndex = 0; // Pointer for the position of the last non-zero element

  // Move non-zero elements to the front of the array
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[lastNonZeroIndex] = arr[i];
      lastNonZeroIndex++;
    }
  }

  // Fill the remaining positions with zeros
  for (let i = lastNonZeroIndex; i < arr.length; i++) {
    arr[i] = 0;
  }

  return arr;
}

// Example usage:
const input = [0, 1, 0, 3, 12];
const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]
```

#### **Explanation**:

- This approach is functionally identical to the first approach but uses the variable `lastNonZeroIndex` instead of `nonZeroPointer`.
- The logic is the same: it first moves non-zero elements to the front and then fills the rest with zeros.
- **Time Complexity**: O(n) — The array is iterated twice.
- **Space Complexity**: O(1) — This approach also modifies the input array in place.

---

### **3. Third Approach: Using `filter()` and `concat()`**

```javascript
function moveZeroesToEnd(arr) {
  // Filter out all non-zero elements
  const nonZeroes = arr.filter((num) => num !== 0);

  // Calculate the number of zeros to add
  const zeroCount = arr.length - nonZeroes.length;

  // Create a new array with non-zero elements followed by the zeros
  return [...nonZeroes, ...Array(zeroCount).fill(0)];
}

// Example usage:
const input = [0, 1, 0, 3, 12];

const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]
```

#### **Explanation**:

- This approach uses the `filter()` method to extract non-zero elements and stores them in the `nonZeroes` array.
- It calculates how many zeros need to be added and constructs a new array that combines the non-zero elements with the zeros.
- **Time Complexity**: O(n) — `filter()` iterates through the array, and `concat()` also requires linear time to join the arrays.
- **Space Complexity**: O(n) — A new array is created to hold the result, so the space complexity is linear.

---

### **4. Fourth Approach: Using `reduce()`**

```javascript
function moveZeroesToEnd(arr) {
  return arr
    .reduce((acc, num) => {
      // If the number is not zero, push it to the accumulator
      if (num !== 0) {
        acc.push(num);
      }
      return acc;
    }, [])
    .concat(Array(arr.length - arr.filter((num) => num !== 0).length).fill(0));
}

// Example usage:
const input = [0, 1, 0, 3, 12];
const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]
```

#### **Explanation**:

- This approach uses `reduce()` to accumulate non-zero elements in the `acc` array.
- It then calculates the number of zeros needed by subtracting the length of the filtered array (non-zero elements) from the original array length.
- Finally, it concatenates the zeros to the non-zero elements array using `concat()`.
- **Time Complexity**: O(n) — Both `reduce()` and `filter()` iterate over the array.
- **Space Complexity**: O(n) — A new array is created to hold the non-zero elements and another array for the zeros.

---

### **5. Fifth Approach: Using `reduce()` with manual zero count calculation**

```javascript
function moveZeroesToEnd(arr) {
  const result = arr.reduce((acc, num) => {
    if (num !== 0) {
      acc.push(num); // Push non-zero numbers to the accumulator
    }
    return acc; // Return the accumulator
  }, []);

  // Calculate the number of zeros to add
  const zeroCount = arr.length - result.length;

  // Combine the non-zero elements with the zeros
  return [...result, ...Array(zeroCount).fill(0)];
}

// Example usage:
const input = [0, 1, 0, 3, 12];
const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]
```

#### **Explanation**:

- This approach is similar to the previous one but stores the non-zero elements in `result` using `reduce()`.
- Afterward, it calculates the number of zeros and concatenates them to the result array.
- **Time Complexity**: O(n) — Both `reduce()` and `concat()` iterate over the array.
- **Space Complexity**: O(n) — A new array is created to store the result.

---

### **Comparison and Conclusion**

- **Optimal Approach**:
  - **Time Complexity**: O(n) for all approaches.
  - **Space Complexity**: The **first and second** approaches (in-place with two pointers) are the most space-efficient with **O(1)** space complexity.
  - **Space Complexity of the other approaches**: O(n), because new arrays are created in the process.

- **Recommendation**:
  - If you want to minimize space usage and avoid creating new arrays, go with the **first or second approach** (two-pointer approach).
  - If you prioritize readability and simplicity, the **third (using `filter()` and `concat()`)** or **fourth (using `reduce()`)** approaches are great choices but come with an additional space cost of O(n).

**Move Zeroes** (LeetCode 283) is a classic array manipulation problem. The objective is to move all `0`s in an array to the end while maintaining the relative order of the non-zero elements—**in-place** without making a copy of the array.

---

### Optimal Strategy: Two-Pointer Approach

Instead of shifting elements repeatedly or using an extra array, we use a **two-pointer technique**:

1. **`writeIndex` (Slow Pointer):** Tracks the position where the next non-zero element should be placed.
2. **`i` (Fast Pointer):** Iterates through the array to find non-zero elements.

As we iterate, whenever we find a non-zero element, we swap it with the element at `writeIndex` and increment `writeIndex`.

#### Time & Space Complexity

- **Time Complexity:** $O(n)$ — Single pass through the array.
- **Space Complexity:** $O(1)$ — In-place modification with zero extra memory allocation.

---

### JavaScript Solution

```javascript
/**
 * Modifies nums in-place to move all 0's to the end.
 * @param {number[]} nums
 * @return {void}
 */
function moveZeroes(nums) {
  let writeIndex = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      // Swap non-zero element with writeIndex position
      if (i !== writeIndex) {
        [nums[writeIndex], nums[i]] = [nums[i], nums[writeIndex]];
      }
      writeIndex++;
    }
  }
}

// --- Example Walkthrough ---
const numbers = [0, 1, 0, 3, 12];
moveZeroes(numbers);
console.log(numbers); // Output: [1, 3, 12, 0, 0]
```

---

### Python Solution

```python
def moveZeroes(nums: list[int]) -> None:
    write_index = 0

    for i in range(len(nums)):
        if nums[i] != 0:
            # Swap non-zero element to the front
            nums[write_index], nums[i] = nums[i], nums[write_index]
            write_index += 1

# --- Example Walkthrough ---
numbers = [0, 1, 0, 3, 12]
moveZeroes(numbers)
print(numbers) # Output: [1, 3, 12, 0, 0]

```

---

### Step-by-Step Execution Trace

Given input `[0, 1, 0, 3, 12]`:

| Step      | `i` | `nums[i]` | Action                                     | Array State        | `writeIndex` |
| --------- | --- | --------- | ------------------------------------------ | ------------------ | ------------ |
| **Start** | -   | -         | Initial state                              | `[0, 1, 0, 3, 12]` | `0`          |
| 1         | `0` | `0`       | Is `0` $\rightarrow$ Skip                  | `[0, 1, 0, 3, 12]` | `0`          |
| 2         | `1` | `1`       | Non-zero $\rightarrow$ Swap with `nums[0]` | `[1, 0, 0, 3, 12]` | `1`          |
| 3         | `2` | `0`       | Is `0` $\rightarrow$ Skip                  | `[1, 0, 0, 3, 12]` | `1`          |
| 4         | `3` | `3`       | Non-zero $\rightarrow$ Swap with `nums[1]` | `[1, 3, 0, 0, 12]` | `2`          |
| 5         | `4` | `12`      | Non-zero $\rightarrow$ Swap with `nums[2]` | `[1, 3, 12, 0, 0]` | `3`          |
