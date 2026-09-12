***productExceptSelf.md***

```js
function productExceptSelf(nums) {
    const length = nums.length;
    const output = new Array(length).fill(1);

    // Calculate the prefix products
    let prefixProduct = 1;
    for (let i = 0; i < length; i++) {
        output[i] = prefixProduct; // Set the prefix product
        prefixProduct *= nums[i];   // Update the prefix product
    }

    // Calculate the suffix products and multiply with prefix products
    let suffixProduct = 1;
    for (let i = length - 1; i >= 0; i--) {
        output[i] *= suffixProduct; // Multiply with the suffix product
        suffixProduct *= nums[i];    // Update the suffix product
    }

    return output;
}

// Example usage:
const arr = [1, 2, 3, 4];
console.log(productExceptSelf(arr)); // Output: [24, 12, 8, 6]



To solve the **Product of Array Except Self** problem in **$O(n)$ time** without using the division operator, calculate the prefix (left) products and suffix (right) products for each position.

---

### Optimal Solution: $O(n)$ Time, $O(1)$ Extra Space

Instead of creating separate prefix and suffix arrays, use the output array to store the prefix products, then use a single variable to multiply the suffix products in reverse.

```javascript
function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);

  // Step 1: Compute prefix products directly into result array
  // result[i] will contain the product of all elements to the left of i
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }

  // Step 2: Compute suffix products on the fly from right to left
  // Multiply result[i] with the product of all elements to the right of i
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] = result[i] * rightProduct;
    rightProduct *= nums[i];
  }

  return result;
}

// Examples:
console.log(productExceptSelf([1, 2, 3, 4]));
// Output: [24, 12, 8, 6]

console.log(productExceptSelf([-1, 1, 0, -3, 3]));
// Output: [0, 0, 9, 0, 0]

```

---

### Step-by-Step Dry Run for `[1, 2, 3, 4]`

1. **Left Pass (Prefix Products):**

* Index 0: `result[0] = 1`
* Index 1: `result[1] = 1 * nums[0] = 1`
* Index 2: `result[2] = 1 * nums[1] = 2`
* Index 3: `result[3] = 2 * nums[2] = 6`
* Intermediate `result`: `[1, 1, 2, 6]`

1. **Right Pass (Suffix Products):**

* `rightProduct = 1`
* Index 3: `result[3] = 6 * 1 = 6`, then `rightProduct = 1 * 4 = 4`
* Index 2: `result[2] = 2 * 4 = 8`, then `rightProduct = 4 * 3 = 12`
* Index 1: `result[1] = 1 * 12 = 12`, then `rightProduct = 12 * 2 = 24`
* Index 0: `result[0] = 1 * 24 = 24`, then `rightProduct = 24 * 1 = 24`
* Final `result`: `[24, 12, 8, 6]`

---

### Complexity Analysis

* **Time Complexity:** $O(n)$ — Two separate passes through the array of length $n$.
* **Auxiliary Space Complexity:** $O(1)$ — Only a single variable (`rightProduct`) is used; the output array does not count toward auxiliary space complexity.
* **Handles Zeroes Automatically:** Works without crashing or branching logic even if the array contains one or multiple zeroes.
