Here's the complete code for generating random integers within a specified range, along with multiple examples:

### Code:

```javascript
// Function to generate a random integer in a given range [min, max)
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Examples:

// Example 1: Random integer between 1 and 10 (exclusive of 10)
const randomInt1 = randomInRange(1, 10);
console.log(`Random integer between 1 and 10: ${randomInt1}`);

// Example 2: Random integer between 50 and 100 (exclusive of 100)
const randomInt2 = randomInRange(50, 100);
console.log(`Random integer between 50 and 100: ${randomInt2}`);

// Example 3: Random integer between -10 and 10 (exclusive of 10)
const randomInt3 = randomInRange(-10, 10);
console.log(`Random integer between -10 and 10: ${randomInt3}`);

// Example 4: Random integer between 0 and 5 (exclusive of 5)
const randomInt4 = randomInRange(0, 5);
console.log(`Random integer between 0 and 5: ${randomInt4}`);

// Example 5: Random integer between 100 and 200 (exclusive of 200)
const randomInt5 = randomInRange(100, 200);
console.log(`Random integer between 100 and 200: ${randomInt5}`);

// Example 6: Random integer between -50 and -20 (exclusive of -20)
const randomInt6 = randomInRange(-50, -20);
console.log(`Random integer between -50 and -20: ${randomInt6}`);

// Example 7: Random integer between 5 and 5.9 (exclusive of 5.9)
const randomInt7 = randomInRange(5, 5.9);
console.log(`Random integer between 5 and 5.9: ${randomInt7}`);
```

---

### Output:
The actual numbers will vary because of randomness, but the output will follow the specified ranges. For example:
```plaintext
Random integer between 1 and 10: 6
Random integer between 50 and 100: 72
Random integer between -10 and 10: -3
Random integer between 0 and 5: 4
Random integer between 100 and 200: 123
Random integer between -50 and -20: -35
Random integer between 5 and 5.9: 5
```

---

### Explanation:
1. **Formula:**
   - `Math.random()` generates a floating-point number between 0 (inclusive) and 1 (exclusive).
   - Multiplying by `(max - min)` scales this to the range size.
   - Adding `min` shifts the range to start at `min`.
   - Using `Math.floor()` truncates the decimal to produce an integer.

2. **Custom Ranges:**
   - You can call `randomInRange(min, max)` with any `min` and `max` to generate integers in the specified range `[min, max)`.

3. **Edge Cases:**
   - For single-value ranges (e.g., `randomInRange(5, 6)`), the result will always be `5`.
   - Ensure that `min < max` to avoid unexpected results.