The problem you're trying to solve is finding the **single number** in an array where every other number appears twice, and one number appears only once. You need to find the number that appears once with **linear runtime complexity** (`O(n)`) and **constant extra space** (`O(1)`).

The solution that you've implemented using the **bitwise XOR operator (`^`)** is perfect for this problem. Let's walk through how it works and why it meets the requirements.

### XOR Approach Explanation

The XOR operator has a few important properties that are useful for this problem:

1. **Identity Property**:  
   `x ^ x = 0` (XOR of a number with itself is 0).

2. **Commutative and Associative**:  
   `a ^ b ^ c = c ^ a ^ b` (Order doesn't matter).

3. **Identity with Zero**:  
   `x ^ 0 = x` (XOR of a number with zero is the number itself).

Given these properties, you can iterate through the list and **XOR all the elements** together. Here's how:

- If you XOR two identical numbers, they will cancel each other out (i.e., turn into `0`).
- The only number that doesn't get cancelled out is the one that appears once because XORing it with `0` will leave it unchanged.

### Algorithm:

1. Start with a variable `result` initialized to `0`.
2. Iterate over each element `num` in the array.
3. For each element, XOR `num` with `result`.
   - If `num` appears twice, it cancels out (because `num ^ num = 0`).
   - The number that appears once will remain because XORing it with `0` has no effect.
4. After the loop, `result` will hold the single number that appears once.

### Code:

```javascript
function singleNumber(nums) {
  let result = 0;
  for (const num of nums) {
    result ^= num;  // XOR all elements
  }
  return result;
}

// Examples
console.log(singleNumber([2, 2, 1])); // Output: 1
console.log(singleNumber([4, 1, 2, 1, 2])); // Output: 4
console.log(singleNumber([1])); // Output: 1
```

### Time and Space Complexity:

- **Time Complexity**:  
  The algorithm loops through the array once, making the time complexity **O(n)**, where `n` is the length of the array.

- **Space Complexity**:  
  The space complexity is **O(1)** because we're only using a constant amount of extra space (`result`), regardless of the input size.

### Example Walkthrough:

#### Example 1:
```javascript
singleNumber([2, 2, 1]); // Output: 1
```
- Initial `result = 0`
- XOR 2 with result: `result = 0 ^ 2 = 2`
- XOR 2 with result: `result = 2 ^ 2 = 0`
- XOR 1 with result: `result = 0 ^ 1 = 1`
- Final `result = 1`, which is the single number.

#### Example 2:
```javascript
singleNumber([4, 1, 2, 1, 2]); // Output: 4
```
- Initial `result = 0`
- XOR 4 with result: `result = 0 ^ 4 = 4`
- XOR 1 with result: `result = 4 ^ 1 = 5`
- XOR 2 with result: `result = 5 ^ 2 = 7`
- XOR 1 with result: `result = 7 ^ 1 = 6`
- XOR 2 with result: `result = 6 ^ 2 = 4`
- Final `result = 4`, which is the single number.

#### Example 3:
```javascript
singleNumber([1]); // Output: 1
```
- Initial `result = 0`
- XOR 1 with result: `result = 0 ^ 1 = 1`
- Final `result = 1`, which is the single number.

### Conclusion:
The bitwise XOR approach is optimal for this problem, as it meets the constraints of **linear time complexity** and **constant space complexity**. By leveraging the properties of XOR, we can efficiently find the single non-repeating element in an array.