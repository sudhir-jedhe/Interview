### Explanation of the Code:

You've provided multiple implementations for calculating the sum of the digits of a number. Let's break them down one by one.

---

### 1. **First Approach (Using `toString()`, `split()`, and `reduce()`)**

```javascript
function sumOfDigit(num) {
    return num.toString().split("")
        .reduce((sum, digit) => sum + parseInt(digit), 0);
}

console.log(sumOfDigit(738));  // Output: 18
```

**How it works**:
- **`num.toString()`** converts the number to a string.
- **`split("")`** splits the string into an array of digits (e.g., `"738"` becomes `["7", "3", "8"]`).
- **`reduce()`** iterates over the array of digits and adds each digit to the sum. The `parseInt(digit)` converts each character back to a number before summing it.

**Example**:
- For `738`:
  - `split("")` gives `["7", "3", "8"]`.
  - `reduce()` sums these digits: `7 + 3 + 8 = 18`.

**Output**: `18`

---

### 2. **Second Approach (Using a `for` loop)**

```javascript
function sumOfDigit(num) {
    let numStr = num.toString();
    let sum = 0;

    for (let digit of numStr) {
        sum += parseInt(digit);
    }

    return sum;
}

console.log(sumOfDigit(738));  // Output: 18
```

**How it works**:
- **`num.toString()`** converts the number to a string.
- A **`for...of` loop** iterates over each character (digit) in the string.
- **`parseInt(digit)`** converts each character to a number and adds it to the sum.

**Example**:
- For `738`:
  - The loop iterates over each digit (`'7'`, `'3'`, `'8'`).
  - Sum: `7 + 3 + 8 = 18`.

**Output**: `18`

---

### 3. **Third Approach (Using `Math.floor()` and `num % 10`)**

```javascript
function sumOfDigits(num) {
    let sum = 0;
    for (; num > 0; num = Math.floor(num / 10)) {
        sum += num % 10;
    }
    return sum;
}

console.log(sumOfDigits(456));  // Output: 15
```

**How it works**:
- **`num % 10`** extracts the last digit of the number.
- **`Math.floor(num / 10)`** removes the last digit from the number.
- The loop continues until all digits have been processed.

**Example**:
- For `456`:
  - `456 % 10 = 6` (last digit), sum becomes `6`.
  - `Math.floor(456 / 10) = 45`, `45 % 10 = 5`, sum becomes `6 + 5 = 11`.
  - `Math.floor(45 / 10) = 4`, `4 % 10 = 4`, sum becomes `11 + 4 = 15`.
  - Loop ends as `num` is now `0`.

**Output**: `15`

---

### 4. **Fourth Approach (Using `forEach()` on Split String)**

```javascript
function sumOfDigit(num) {
    let sum = 0;
    num.toString().split("").forEach(digit => {
        sum += parseInt(digit);
    });
    return sum;
}

console.log(sumOfDigit(123));  // Output: 6
```

**How it works**:
- Similar to the first approach, but instead of `reduce()`, we use **`forEach()`** to iterate over the array of digits and sum them.

**Example**:
- For `123`:
  - `split("")` gives `["1", "2", "3"]`.
  - `forEach()` iterates over each digit, adding `parseInt(digit)` to the sum: `1 + 2 + 3 = 6`.

**Output**: `6`

---

### 5. **Fifth Approach (Using Recursion)**

```javascript
function recursiveSum(num) {
    if (num === 0) {
        return 0;
    }
    return (num % 10) + recursiveSum(Math.floor(num / 10));
}

console.log(recursiveSum(738));  // Output: 18
```

**How it works**:
- **Base Case**: When `num` is `0`, return `0`.
- **Recursive Case**: The function adds the last digit (`num % 10`) to the result of the recursive call with `Math.floor(num / 10)` to remove the last digit.
  
**Example**:
- For `738`:
  - `738 % 10 = 8`, recursive call `recursiveSum(73)`.
  - `73 % 10 = 3`, recursive call `recursiveSum(7)`.
  - `7 % 10 = 7`, recursive call `recursiveSum(0)`.
  - Base case returns `0`.
  - Sum: `8 + 3 + 7 = 18`.

**Output**: `18`

---

### Summary of Results:

- `sumOfDigit(738)` → `18`
- `sumOfDigit(123)` → `6`
- `sumOfDigits(456)` → `15`
- `recursiveSum(738)` → `18`

Each approach is a different way of summing the digits of a number, with the recursive version being more elegant but potentially less efficient for very large numbers.