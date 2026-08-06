### Problem Explanation:

You're tasked with finding a **single number** in a list where:

- Every other element appears **exactly three times** except for **one** element that appears **exactly once**.
- There are multiple solutions and approaches to solving this problem efficiently. Let's explore various solutions.

### **Approach 1: Using XOR Operation (For Problem 1 - Single Number Appears Once)**

The first case you're showing (`[4, 1, 2, 1, 2]`) is a variation of a typical problem where every element appears twice except one, which appears once. This can be solved using **XOR** since XOR has properties that help eliminate pairs:

#### XOR Properties:

1. \( x \oplus x = 0 \) (XOR of a number with itself is 0)
2. \( x \oplus 0 = x \) (XOR of a number with 0 is the number itself)
3. XOR is **commutative** and **associative**, so the order of operations doesn't matter.

With the above properties, if you XOR all the elements in the array, the result will be the element that appears once, because all the pairs will cancel out (XORing a number with itself results in 0).

#### Solution:

```javascript
function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num; // XOR each number
  }
  return result;
}

const nums = [4, 1, 2, 1, 2];
console.log(singleNumber(nums)); // Output: 4
```

### **Approach 2: For the Problem Where Every Element Appears Three Times Except One**

In this case, where every element appears exactly three times except for one, which appears once (e.g., `[2, 2, 3, 2]`), you can **bitwise manipulation** to find the single element.

#### Key Idea:

1. Iterate over each bit (from 0 to 31 for a 32-bit number) and count how many times the bit is set across all numbers.
2. If a bit appears a number of times that is not divisible by 3, it must belong to the unique number that appears only once.

#### Solution:

```javascript
function singleNumber(nums) {
  let ans = 0;
  for (let i = 0; i < 32; i++) {
    const count = nums.reduce((r, v) => r + ((v >> i) & 1), 0); // Count bits at each position
    ans |= (count % 3) << i; // If bit count is not divisible by 3, set that bit in ans
  }

  // Handle negative numbers (if the result is negative, adjust the 32-bit integer sign)
  if (ans >= Math.pow(2, 31)) {
    ans -= Math.pow(2, 32);
  }

  return ans;
}

const nums1 = [2, 2, 3, 2];
console.log(singleNumber(nums1)); // Output: 3

const nums2 = [0, 1, 0, 1, 0, 1, 99];
console.log(singleNumber(nums2)); // Output: 99
```

### **Explanation of the Above Code**:

- **Bit manipulation**: For each bit (from 0 to 31), we count how many times the bit is set across all numbers in the array.
- **Mod 3 operation**: If the count is not divisible by 3, it means that the bit belongs to the unique number, and we include it in the result (`ans`).
- **Handling negative numbers**: After the loop, if the number is too large for a 32-bit signed integer (greater than \( 2^{31} \)), we adjust the result to handle negative numbers.

### **Approach 3: Find Two Single Numbers (Different Scenario)**

If you're given a problem where **two** numbers appear once, and all other numbers appear twice (e.g., `[1, 2, 1, 3, 2, 5]`), you can use a **XOR trick** to find those two numbers efficiently.

#### Explanation:

1. XOR all the elements to get the XOR of the two unique numbers (`a ^ b`).
2. Find a bit that is different in `a` and `b` (this is the lowest set bit in the XOR result).
3. Use this bit to divide the numbers into two groups and XOR within each group to find the two unique numbers.

#### Solution:

```javascript
var singleNumber = function (nums) {
  const xs = nums.reduce((a, b) => a ^ b); // XOR of all elements
  const lb = xs & -xs; // Get the rightmost set bit
  let a = 0;

  for (const x of nums) {
    if (x & lb) {
      a ^= x; // XOR of all numbers with the set bit
    }
  }

  const b = xs ^ a; // The other unique number
  return [a, b]; // Return both numbers
};

console.log(singleNumber([1, 2, 1, 3, 2, 5])); // Output: [3, 5] or [5, 3]
console.log(singleNumber([-1, 0])); // Output: [-1, 0]
console.log(singleNumber([0, 1])); // Output: [1, 0]
```

### **Explanation**:

1. XOR all the numbers. This leaves you with `a ^ b` (XOR of the two unique numbers).
2. Find the lowest set bit (rightmost bit) in `a ^ b` using `xs & -xs`.
3. Partition the numbers into two groups based on whether they have this bit set or not, and XOR each group to find `a` and `b`.

### **Summary of Solutions**:

1. **Single Number (appears once, others appear twice)**: Use XOR to cancel out the duplicate numbers.
2. **Single Number (appears once, others appear three times)**: Use bitwise operations to count the bits modulo 3 and determine the unique number.
3. **Two Single Numbers (appears once, others appear twice)**: Use XOR to find the combined XOR of the two unique numbers, then partition and find the two numbers.

Each approach has its own complexity:

- **XOR-based solutions**: \( O(n) \)
- **Bit manipulation (for the three-time problem)**: \( O(n) \) with constant space.
