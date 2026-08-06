```js
function splitArray(nums) {
    const freq = new Map();
    for (let num of nums) {
        if (!freq.has(num)) {
            freq.set(num, 0);
        }
        freq.set(num, freq.get(num) + 1);
    }
    
    // Check if any element appears more than twice
    for (let count of freq.values()) {
        if (count > 2) {
            return false;
        }
    }
    
    const set1 = new Set();
    const set2 = new Set();
    
    for (let num of nums) {
        if (!set1.has(num)) {
            set1.add(num);
        } else if (!set2.has(num)) {
            set2.add(num);
        }
    }
    
    return set1.size === nums.length / 2 && set2.size === nums.length / 2;
}

// Example usage:
console.log(splitArray([1, 1, 2, 2, 3, 4])); // Output: true
console.log(splitArray([1, 1, 1, 1])); // Output: false

```
```js

function canSplit(nums) {
    if (nums.length % 2 !== 0) {
      return false; // Array length must be even
    }
  
    const set = new Set(nums);
    return set.size === nums.length; // All elements must be distinct
  }
  
  // Example usage
  const nums1 = [1, 1, 2, 2, 3, 4];
  const nums2 = [1, 1, 1, 1];
  console.log(canSplit(nums1)); // Output: true
  console.log(canSplit(nums2)); // Output: false
  

```

### 1. **`splitArray(nums)`**:  
This function checks if the given array `nums` can be split into two sets such that:
- The elements of both sets are distinct.
- Each set contains exactly half of the elements in the array.

Additionally, no element in the array should appear more than twice.

### **Explanation of `splitArray(nums)`**:
1. **Step 1: Frequency Count**
   - We first create a `Map` called `freq` to store the frequency of each number in the array.
   - For each number in `nums`, if the number hasn't been encountered before, we initialize its count to 0.
   - We then increment the count of each number.
   
2. **Step 2: Check Frequency**
   - We loop through the values in the `freq` map. If any number appears more than twice, we return `false` because it's impossible to split that number into two distinct sets.
   
3. **Step 3: Create Two Sets**
   - We then attempt to split the array into two sets, `set1` and `set2`. If a number is not present in `set1`, we add it there.
   - If a number is already in `set1`, we try to add it to `set2`. This ensures that each number appears at most once in each set.
   
4. **Step 4: Check Set Sizes**
   - Finally, we check if both sets have the same size and if each set contains half of the total elements in the array. If both conditions are met, we return `true`.

### **Example Usage**:
```javascript
console.log(splitArray([1, 1, 2, 2, 3, 4])); // Output: true
console.log(splitArray([1, 1, 1, 1])); // Output: false
```

- **Test Case 1**: `[1, 1, 2, 2, 3, 4]`
  - The elements can be split into two sets: `{1, 2, 3}` and `{1, 2, 4}`. Both sets have the same size and all elements are distinct in each set.
  - **Output**: `true`
  
- **Test Case 2**: `[1, 1, 1, 1]`
  - This array has more than two occurrences of `1`, so it cannot be split into two sets with distinct elements.
  - **Output**: `false`

### 2. **`canSplit(nums)`**:
This function checks if the given array `nums` can be split into two equal parts, where each part contains distinct elements. The array must have an even length for it to be split into two equal parts.

### **Explanation of `canSplit(nums)`**:
1. **Step 1: Check Array Length**
   - If the array length is odd, it can't be split into two equal parts, so we immediately return `false`.
   
2. **Step 2: Check for Distinct Elements**
   - We use a `Set` to store all unique elements from the array. A `Set` only keeps distinct values, so if the size of the `Set` is equal to the length of the array, all elements are distinct.
   
3. **Step 3: Final Check**
   - If the size of the `Set` is equal to the length of the array, it means all elements are distinct. We return `true`; otherwise, we return `false`.

### **Example Usage**:
```javascript
const nums1 = [1, 1, 2, 2, 3, 4];
const nums2 = [1, 1, 1, 1];
console.log(canSplit(nums1)); // Output: true
console.log(canSplit(nums2)); // Output: false
```

- **Test Case 1**: `[1, 1, 2, 2, 3, 4]`
  - The array has 6 elements, and all elements are distinct (after removing duplicates). It can be split into two sets: `{1, 2, 3}` and `{4}`.
  - **Output**: `true`
  
- **Test Case 2**: `[1, 1, 1, 1]`
  - This array has repeated elements, so it can't be split into two distinct sets.
  - **Output**: `false`

---

### **Summary of the Differences**:

- **`splitArray(nums)`** checks for the possibility of splitting the array into two sets with distinct elements, where no element appears more than twice.
  
- **`canSplit(nums)`** checks if the array can be split into two equal parts, where all elements in the array are distinct, and the length of the array is even.

