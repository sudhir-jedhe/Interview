The provided code contains multiple implementations of the **Greatest Common Divisor (GCD)**, also known as **Euclidean algorithm**. Let's go through each version and explain how they work, along with the correct output.

### 1. Subtraction-based Euclidean Algorithm (First Implementation)

This method repeatedly subtracts the smaller number from the larger number until both numbers become equal. When they become equal, that number is the GCD.

```javascript
let gcd = (num1, num2) => {
  // Loop till both numbers are not equal
  while (num1 != num2) {
    // Check if num1 > num2
    if (num1 > num2) {
      // Subtract num2 from num1
      num1 = num1 - num2;
    } else {
      // Subtract num1 from num2
      num2 = num2 - num1;
    }
  }

  return num2;
};
```

#### Example:

```javascript
console.log(gcd(60, 15)); // Output: 15
console.log(gcd(36, 60)); // Output: 12
```

**Explanation**:

- `gcd(60, 15)`: This will repeatedly subtract 15 from 60, eventually leading to 15 as the GCD.
- `gcd(36, 60)`: This will repeatedly subtract 36 from 60, eventually leading to 12 as the GCD.

While the subtraction method works, it is less efficient than the division-based method.

### 2. Repeated Subtraction (Second Implementation)

This version is identical to the first one, so the explanation and output remain the same. It also uses repeated subtraction to reduce both numbers to the GCD.

### 3. Division-based Euclidean Algorithm (Third Implementation)

This is the most optimized and standard method to compute the GCD. The idea is to keep replacing the larger number with the remainder of the larger number divided by the smaller number, until one of the numbers becomes zero. The non-zero number is the GCD.

```javascript
let gcd = (num1, num2) => {
  // If num2 is 0, return num1
  if (num2 === 0) {
    return num1;
  }

  // Call the same function recursively
  return gcd(num2, num1 % num2);
};
```

#### Example:

```javascript
console.log(gcd(60, 15)); // Output: 15
console.log(gcd(36, 60)); // Output: 12
```

**Explanation**:

- `gcd(60, 15)`: This will calculate `gcd(15, 60 % 15)` → `gcd(15, 0)` → 15.
- `gcd(36, 60)`: This will calculate `gcd(60 % 36, 36)` → `gcd(24, 36)` → `gcd(36 % 24, 24)` → `gcd(12, 24)` → `gcd(24 % 12, 12)` → `gcd(0, 12)` → 12.

This method is the most efficient, as it reduces the problem size quickly.

### Output:

```javascript
console.log(gcd(60, 15)); // Output: 15
console.log(gcd(36, 60)); // Output: 12
```

### Summary of Outputs:

- `gcd(60, 15)` returns **15**.
- `gcd(36, 60)` returns **12**.

### Performance Consideration:

- **Subtraction method**: This is inefficient and can take a lot of iterations, especially for large numbers.
- **Division method**: This is the most efficient and commonly used method to calculate GCD. It runs in logarithmic time \(O(\log(\min(a, b)))\).

### Conclusion:

While all three methods work, the **third implementation** (division-based approach) is the most efficient and should be preferred for computing GCD, especially when dealing with large numbers.
