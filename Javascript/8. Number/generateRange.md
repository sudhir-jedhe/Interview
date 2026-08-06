Here's a complete implementation of the `generateRange` function with enhanced error handling and usage examples:

### Code

```javascript
/**********************************************
 * Generate a range of numbers
 **********************************************/
function generateRange(start, end, step = 1) {
    // Ensure all parameters are numbers
    if (typeof start !== 'number' || typeof end !== 'number' || typeof step !== 'number') {
        throw new Error('All parameters must be numbers.');
    }

    // Step cannot be zero
    if (step === 0) {
        throw new Error('Step cannot be zero.');
    }

    // Validate range and step combination
    if ((start < end && step < 0) || (start > end && step > 0)) {
        throw new Error('Invalid range and step combination.');
    }

    // Initialize result array
    const result = [];

    // Generate range
    for (let i = start; (step > 0 ? i <= end : i >= end); i += step) {
        result.push(i);
    }

    return result;
}

// Example usage:

try {
    const range1 = generateRange(1, 10, 2);
    console.log('Range 1:', range1);
    // Output: [1, 3, 5, 7, 9]

    const range2 = generateRange(10, 1, -2);
    console.log('Range 2:', range2);
    // Output: [10, 8, 6, 4, 2]

    const range3 = generateRange(5, 5);
    console.log('Range 3:', range3);
    // Output: [5]

    const range4 = generateRange(5, 15, 0); // Example of an error case
    console.log('Range 4:', range4);
} catch (error) {
    console.error('Error:', error.message);
}
```

### Explanation

1. **Input Validation**:
   - Ensures `start`, `end`, and `step` are numbers.
   - Throws an error if `step` is zero, as it would create an infinite loop.
   - Checks if the combination of `start`, `end`, and `step` makes logical sense.

2. **Logic**:
   - Uses a `for` loop to iterate from `start` to `end`, adjusting by `step` each iteration.
   - Adds the current value of `i` to the result array.

3. **Error Handling**:
   - Detects invalid inputs and conditions like incompatible `start`, `end`, and `step` combinations.

4. **Examples**:
   - Positive step: `generateRange(1, 10, 2)` -> `[1, 3, 5, 7, 9]`
   - Negative step: `generateRange(10, 1, -2)` -> `[10, 8, 6, 4, 2]`
   - Same start and end: `generateRange(5, 5)` -> `[5]`
   - Invalid case: Throws an error for `generateRange(5, 15, 0)`.

### Output
```plaintext
Range 1: [ 1, 3, 5, 7, 9 ]
Range 2: [ 10, 8, 6, 4, 2 ]
Range 3: [ 5 ]
Error: Step cannot be zero.
```