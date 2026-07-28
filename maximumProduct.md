```js
import { maximumProduct } from "./maximumProduct.js";

// maximumProduct.js
export function maximumProduct(nums) {
nums.sort((a, b) => a - b);
const n = nums.length;

// Case 1: Product of the three largest numbers
const maxProduct1 = nums[n - 1] _ nums[n - 2] _ nums[n - 3];

// Case 2: Product of the two smallest numbers and the largest number
const maxProduct2 = nums[0] _ nums[1] _ nums[n - 1];

// Return the maximum of the two cases
return Math.max(maxProduct1, maxProduct2);
}

// main.js

const nums = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
console.log(maximumProduct(nums)); // Output: 48

/********************\*\********************* \*/

function maxProduct(nums) {
if (nums.length === 0) return 0;

let maxProduct = nums[0];
let minProduct = nums[0];
let result = nums[0];

for (let i = 1; i < nums.length; i++) {
if (nums[i] < 0) {
// Swap max and min when the current number is negative
[maxProduct, minProduct] = [minProduct, maxProduct];
}

      maxProduct = Math.max(nums[i], maxProduct * nums[i]);
      minProduct = Math.min(nums[i], minProduct * nums[i]);

      result = Math.max(result, maxProduct);

}

return result;
}

// Example usage:
const arr = [2, 3, -2, 4];
console.log(maxProduct(arr)); // Output: 6 (the subarray [2, 3])
```

The **Maximum Product Subarray** problem (LeetCode #152) asks you to find a contiguous non-empty subarray within an array of numbers that has the **largest product**, and return that product.

Unlike maximum sum subarray (Kadane's Algorithm), **negative numbers and zeros** make this tricky:

- A negative number multiplied by another negative number becomes a **large positive number**.
- A zero resets the product to zero.

Because of this, we must maintain **both the maximum and minimum product** up to the current element.

---

## Optimal Solution (Dynamic Programming / Modified Kadane's)

### Algorithm Logic

At each element `num`:

1. If `num` is negative, multiplying by `num` flips the maximum product into the minimum product and vice versa. So we **swap `currentMax` and `currentMin**`.
2. We then update:

- `currentMax = max(num, currentMax * num)`
- `currentMin = min(num, currentMin * num)`

3. Update `globalMax = max(globalMax, currentMax)`.

### Complexity

- **Time Complexity:** $\mathcal{O}(n)$ — Single pass through the array.
- **Space Complexity:** $\mathcal{O}(1)$ — Constant extra space.

---

## JavaScript / TypeScript Implementation

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
function maxProduct(nums) {
  if (nums.length === 0) return 0;

  let currentMax = nums[0];
  let currentMin = nums[0];
  let globalMax = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];

    // If negative, currentMax and currentMin swap roles
    if (num < 0) {
      const temp = currentMax;
      currentMax = currentMin;
      currentMin = temp;
    }

    // Choose either current number alone or extended product
    currentMax = Math.max(num, currentMax * num);
    currentMin = Math.min(num, currentMin * num);

    // Track highest product seen so far
    globalMax = Math.max(globalMax, currentMax);
  }

  return globalMax;
}

// Example 1:
console.log(maxProduct([2, 3, -2, 4]));
// Output: 6 (Subarray: [2, 3])

// Example 2:
console.log(maxProduct([-2, 0, -1]));
// Output: 0 (Subarray: [0])

// Example 3: Negative numbers cancel out
console.log(maxProduct([2, 3, -2, 4, -1, -3]));
// Output: 144 (Subarray: [2, 3, -2, 4, -1])
```

---

## Alternative Prefix/Suffix Sweep ($\mathcal{O}(n)$ Time, $\mathcal{O}(1)$ Space)

Another clean intuition relies on the observation that the maximum product must be either a **prefix product** or a **suffix product** (resetting to 1 whenever encountering a 0).

```javascript
function maxProductPrefixSuffix(nums) {
  let maxProd = -Infinity;
  let prefix = 1;
  let suffix = 1;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    prefix = (prefix === 0 ? 1 : prefix) * nums[i];
    suffix = (suffix === 0 ? 1 : suffix) * nums[n - 1 - i];

    maxProd = Math.max(maxProd, prefix, suffix);
  }

  return maxProd;
}
```

---

## Comparison: Max Sum vs Max Product Subarray

| Problem                         | Key Challenge          | Maintained Variables                    |
| ------------------------------- | ---------------------- | --------------------------------------- |
| **Max Subarray Sum** (Kadane's) | Negatives decrease sum | `currentSum`, `maxSum`                  |
| **Max Subarray Product**        | Negatives flip min/max | `currentMax`, `currentMin`, `globalMax` |

To find the **Maximum Product of Three Numbers** (LeetCode #628) in $\mathcal{O}(n)$ time and $\mathcal{O}(1)$ space, you need to account for both positive and negative numbers.

---

### Key Intuition

When you multiply three numbers from an array, the maximum product can only come from **one of two scenarios**:

1. **The 3 largest numbers**: All three are positive (e.g., $5 \times 6 \times 7 = 210$).
2. **The 2 smallest (most negative) numbers $\times$ the 1 largest number**: Two negative numbers multiplied together become a large positive number (e.g., $(-10) \times (-10) \times 7 = 700$).

Therefore, the answer is always:

$$\max(\text{max1} \times \text{max2} \times \text{max3}, \ \text{min1} \times \text{min2} \times \text{max1})$$

To solve this in $\mathcal{O}(n)$ time, we don't need to sort the array ($\mathcal{O}(n \log n)$). We just do a **single pass** through the array to keep track of the **3 largest** and **2 smallest** numbers.

---

### JavaScript Implementation ($\mathcal{O}(n)$ Time, $\mathcal{O}(1)$ Space)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
function maximumProduct(nums) {
  // Track 3 largest numbers
  let max1 = -Infinity; // Largest
  let max2 = -Infinity; // 2nd Largest
  let max3 = -Infinity; // 3rd Largest

  // Track 2 smallest numbers (most negative)
  let min1 = Infinity; // Smallest
  let min2 = Infinity; // 2nd Smallest

  for (const num of nums) {
    // Update top 3 largest
    if (num > max1) {
      max3 = max2;
      max2 = max1;
      max1 = num;
    } else if (num > max2) {
      max3 = max2;
      max2 = num;
    } else if (num > max3) {
      max3 = num;
    }

    // Update top 2 smallest
    if (num < min1) {
      min2 = min1;
      min1 = num;
    } else if (num < min2) {
      min2 = num;
    }
  }

  // Option 1: 3 largest positive numbers
  const option1 = max1 * max2 * max3;

  // Option 2: 2 smallest negative numbers * 1 largest positive number
  const option2 = min1 * min2 * max1;

  return Math.max(option1, option2);
}

// Example 1: Standard positive numbers
console.log(maximumProduct([1, 2, 3, 4]));
// Output: 24 (3 * 4 * 2)

// Example 2: Negative numbers present
console.log(maximumProduct([-10, -10, 1, 3, 2]));
// Output: 300 (min1=-10, min2=-10, max1=3 => -10 * -10 * 3)

// Example 3: All negative numbers
console.log(maximumProduct([-1, -2, -3, -4]));
// Output: -6 (-1 * -2 * -3)
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n)$ — Single iteration through the array.
- **Space Complexity:** $\mathcal{O}(1)$ — Constant extra space used for tracking 5 variables (`max1`, `max2`, `max3`, `min1`, `min2`).

---

### Comparison Matrix

| Approach                  | Time Complexity         | Space Complexity                     | Notes                                                       |
| ------------------------- | ----------------------- | ------------------------------------ | ----------------------------------------------------------- |
| **Sorting**               | $\mathcal{O}(n \log n)$ | $\mathcal{O}(1)$ or $\mathcal{O}(n)$ | Easy to write (`nums.sort()`), but slower for large inputs. |
| **Single Pass (Optimal)** | $\mathcal{O}(n)$        | $\mathcal{O}(1)$                     | Optimal performance without modifying the input array.      |

Generalizing the **Maximum Product of $K$ Numbers** (i.e., choosing a subsequence of size $K$ from an array to maximize its product) requires expanding the logic of paired negative numbers.

When $K = 3$, we compare $(3 \text{ positive})$ vs $(2 \text{ negative} + 1 \text{ positive})$. When extended to any arbitrary $K$, negative numbers must still be picked in **pairs** (0, 2, 4, 6... negative numbers) to maintain a positive product.

---

### Key Observations & Edge Cases

If the array is sorted in ascending order (e.g., `nums = [-10, -8, -1, 0, 2, 5, 9]`):

1. **All Positives or $K$ Even**: We can greedily pair either the **two most negative numbers** from the left (e.g., $nums[0] \times nums[1]$) or the **two largest positive numbers** from the right (e.g., $nums[N-1] \times nums[N-2]$).
2. **If $K$ is Odd**: To guarantee a positive result (if possible), we must pick the **single largest positive number** ($nums[N-1]$) first. This leaves $K - 1$ elements to choose, which is an **even number**, bringing us back to picking optimal pairs!
3. **All Numbers Are Negative & $K$ is Odd**: If every number is negative and $K$ is odd, any product of $K$ elements will be negative. To maximize a negative product, we must pick the $K$ numbers with the **smallest absolute values** (the $K$ largest elements in the sorted array).

---

### Optimal Algorithm: Sorting + Two-Pointer Greedy

Sorting the array allows us to pick pairs from the left (smallest/most negative) and right (largest/most positive) in $\mathcal{O}(N \log N)$ time.

#### JavaScript Implementation

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function maxProductOfK(nums, k) {
  const n = nums.length;
  if (k > n) return 0;

  // Step 1: Sort the array in ascending order
  nums.sort((a, b) => a - b);

  let product = 1;
  let left = 0;
  let right = n - 1;

  // Step 2: Handle edge case where all numbers are negative and K is odd
  if (nums[right] < 0 && k % 2 !== 0) {
    // Product will be negative, so pick the K largest numbers (closest to 0)
    for (let i = n - 1; i >= n - k; i--) {
      product *= nums[i];
    }
    return product;
  }

  // Step 3: Handle odd K by picking the largest element first
  if (k % 2 !== 0) {
    product *= nums[right];
    right--;
    k--; // K is now even!
  }

  // Step 4: Greedy Two-Pointer strategy for remaining even pairs
  while (k > 0) {
    const leftPair = nums[left] * nums[left + 1];
    const rightPair = nums[right] * nums[right - 1];

    if (leftPair > rightPair) {
      product *= leftPair;
      left += 2;
    } else {
      product *= rightPair;
      right -= 2;
    }

    k -= 2; // We process elements in pairs of 2
  }

  return product;
}

// Example 1: Standard case with negatives
console.log(maxProductOfK([-10, -9, -1, 2, 3, 5], 4));
// Output: 1350 ( -10 * -9 * 5 * 3 )

// Example 2: K is odd, taking 2 negatives + 1 positive
console.log(maxProductOfK([-10, -10, 1, 2, 3, 4], 3));
// Output: 400 ( -10 * -10 * 4 )

// Example 3: All negative numbers with odd K
console.log(maxProductOfK([-5, -4, -3, -2, -1], 3));
// Output: -6 ( -3 * -2 * -1 )
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(N \log N)$ due to array sorting. The two-pointer greedy loop takes $\mathcal{O}(K)$ time.
- **Space Complexity:** $\mathcal{O}(1)$ or $\mathcal{O}(N)$ depending on JS engine sorting implementation (`Array.prototype.sort`).

---

### Can We Do It In $\mathcal{O}(N)$ Time?

Yes! Instead of sorting the whole array, you can use **Quickselect** or two **Min/Max Heaps** (Priority Queues) to extract:

- The $K$ largest elements
- The $K$ smallest elements

Since you only need at most $2K$ boundary elements to make all pairing decisions, finding the top $K$ maximums and top $K$ minimums via Quickselect takes **$\mathcal{O}(N)$ average time**, lowering overall complexity when $K \ll N$.
