The solution depends on whether you need the **maximum product of any pair (two numbers)** or the **maximum product of a contiguous subarray**.

---

### Problem 1: Maximum Product of Two Numbers (Pair)

The maximum product of two numbers comes from either:

1. The **two largest positive numbers**, or
2. The **two smallest (most negative) numbers** (since negative $\times$ negative = positive).

#### Single-Pass Solution ($O(n)$ Time, $O(1)$ Space)

```javascript
function maxProductPair(nums) {
  if (nums.length < 2) return null;

  let max1 = -Infinity, max2 = -Infinity;
  let min1 = Infinity, min2 = Infinity;

  for (const num of nums) {
    // Track two largest numbers
    if (num > max1) {
      max2 = max1;
      max1 = num;
    } else if (num > max2) {
      max2 = num;
    }

    // Track two smallest numbers (for negative * negative)
    if (num < min1) {
      min2 = min1;
      min1 = num;
    } else if (num < min2) {
      min2 = num;
    }
  }

  return Math.max(max1 * max2, min1 * min2);
}

// Examples:
console.log(maxProductPair([1, 10, -5, 1, -100])); // 500  (-5 * -100)
console.log(maxProductPair([5, 20, 2, 4, 30]));     // 600  (20 * 30)
console.log(maxProductPair([-1, -2, -3, -4]));     // 12   (-3 * -4)

```

---

### Problem 2: Maximum Product Subarray (Contiguous)

For a contiguous slice of an array, a negative number can flip a small minimum into a large maximum. We maintain both the **running maximum** and **running minimum** at each position.

#### Dynamic Programming Solution ($O(n)$ Time, $O(1)$ Space)

```javascript
function maxProductSubarray(nums) {
  if (nums.length === 0) return 0;

  let maxSoFar = nums[0];
  let minSoFar = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const current = nums[i];

    // If negative, multiplying by it swaps max and min
    if (current < 0) {
      const temp = maxSoFar;
      maxSoFar = minSoFar;
      minSoFar = temp;
    }

    maxSoFar = Math.max(current, maxSoFar * current);
    minSoFar = Math.min(current, minSoFar * current);

    result = Math.max(result, maxSoFar);
  }

  return result;
}

// Examples:
console.log(maxProductSubarray([2, 3, -2, 4]));       // 6   ([2, 3])
console.log(maxProductSubarray([-2, 0, -1]));         // 0   ([0])
console.log(maxProductSubarray([-2, 3, -4]));         // 24  ([-2, 3, -4])
console.log(maxProductSubarray([-1, -2, -3, 0]));     // 6   ([-2, -3])

```

---

### Complexity Summary

| Variation                | Time Complexity | Space Complexity |
| ------------------------ | --------------- | ---------------- |
| **Max Pair Product**     | $O(n)$          | $O(1)$           |
| **Max Subarray Product** | $O(n)$          | $O(1)$           |
