Here is the implementation and explanation of the `clamp` function:

### Code:
```javascript
function clamp(number, lowerBound, upperBound) {
    // Ensure a valid number
    if (isNaN(number)) {
        return number; // If input is not a valid number, return it as is.
    }

    // Handle cases where lowerBound > upperBound
    if (lowerBound > upperBound) {
        [lowerBound, upperBound] = [upperBound, lowerBound]; // Swap bounds to ensure correctness.
    }

    // Clamp the value within the bounds
    return Math.min(Math.max(number, lowerBound), upperBound); // Clamp number between lowerBound and upperBound.
}

// Test cases
console.log(clamp(10, 5, 15)); // Output: 10 (within bounds)
console.log(clamp(20, 5, 15)); // Output: 15 (clamped to upper bound)
console.log(clamp(3, 10, 5));  // Output: 5 (clamped to lower bound)
console.log(clamp('hello', 1, 2)); // Output: 'hello' (returns input for invalid number)
```

---

### Explanation:
1. **Check if the Input is a Valid Number**:
   - The `isNaN(number)` check ensures that non-numeric values are returned as is. If `number` is not a valid numeric value, the function exits early and returns the input unchanged.

2. **Handle Invalid Boundaries**:
   - If `lowerBound` is greater than `upperBound`, swap their values using destructuring assignment: `[lowerBound, upperBound] = [upperBound, lowerBound]`.

3. **Clamp Logic**:
   - The clamping process uses:
     ```javascript
     Math.min(Math.max(number, lowerBound), upperBound)
     ```
     - `Math.max(number, lowerBound)`: Ensures `number` is at least `lowerBound`.
     - `Math.min(..., upperBound)`: Ensures the result does not exceed `upperBound`.

4. **Test Cases**:
   - Case 1: The input number is within bounds (`10` is between `5` and `15`).
   - Case 2: The input number exceeds the upper bound (`20` clamped to `15`).
   - Case 3: The input number is below the lower bound (`3` clamped to `5`).
   - Case 4: Non-numeric input returns the original value (`'hello'`).

---

### **Edge Cases to Consider**:
- If the `lowerBound` and `upperBound` are the same, the number will be clamped to that value.
- If `number` is `Infinity` or `-Infinity`, the clamping logic still works as expected.
- Non-numeric inputs (like strings or objects) are safely handled by returning them as is.