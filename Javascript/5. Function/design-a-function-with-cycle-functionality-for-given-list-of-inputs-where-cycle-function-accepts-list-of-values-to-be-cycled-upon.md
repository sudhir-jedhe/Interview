Your `Calculator` function is almost perfect! However, there are a couple of small improvements that can be made to make it more robust, especially for handling cases where division by zero might occur. Additionally, I'll provide an explanation of how it works and how you can extend or modify it.

### Complete Implementation with Improvements

```javascript
function Calculator(num1, num2) {
  // Private functions for the operations
  function sum() {
    return num1 + num2;
  }

  function difference() {
    return num1 - num2;
  }

  function product() {
    return num1 * num2;
  }

  function dividend() {
    // Check for division by zero
    if (num2 === 0) {
      return "Cannot divide by zero";
    }
    return num1 / num2;
  }

  // Return an object with methods accessible publicly
  return { sum, difference, product, dividend };
}

// Example usage:

const calc12And5 = Calculator(12, 5);

console.log(calc12And5.sum());        // 17
console.log(calc12And5.difference()); // 7
console.log(calc12And5.product());    // 60
console.log(calc12And5.dividend());   // 2

// Division by zero case:
const calc10And0 = Calculator(10, 0);
console.log(calc10And0.dividend());   // "Cannot divide by zero"
```

### Explanation:

1. **The `Calculator` function**:
   - It accepts two numbers (`num1` and `num2`).
   - Inside it, we define four functions: `sum`, `difference`, `product`, and `dividend`, which perform the respective arithmetic operations on `num1` and `num2`.
   
2. **The returned object**:
   - The `Calculator` function returns an object that exposes four methods (`sum`, `difference`, `product`, and `dividend`). These methods can be called on the returned object to perform the respective operations.

3. **Division by Zero**:
   - I've added a safeguard inside the `dividend` function to check if `num2` is `0`. If `num2` is zero, it returns a message `"Cannot divide by zero"` instead of attempting the division and causing an error.

4. **Modular design**:
   - This uses the **Revealing Module Pattern**, where the internal functions are kept private and only the ones that are returned are publicly accessible.

### Example Usage:
```javascript
const calc12And5 = Calculator(12, 5);

console.log(calc12And5.sum());        // 17
console.log(calc12And5.difference()); // 7
console.log(calc12And5.product());    // 60
console.log(calc12And5.dividend());   // 2
```

For the case where `num2` is `0`, it will return the following:
```javascript
const calc10And0 = Calculator(10, 0);
console.log(calc10And0.dividend());   // "Cannot divide by zero"
```

### Enhancements and Variations:
1. **Handling Floating Point Precision**:
   - If you want more control over the precision in the `dividend` function, you could use `toFixed` or `Math.round` to limit decimal places (e.g., `return (num1 / num2).toFixed(2)` for 2 decimal precision).
   
2. **Multiple Calculator Instances**:
   - The `Calculator` function creates independent instances, so you can create multiple calculators with different values.
   
3. **Add More Operations**:
   - You can easily add more functions to handle additional operations, such as exponentiation (`pow`) or modulus (`mod`).

Let me know if you'd like any further modifications or additional features!