The function `eggCount` counts the number of "eggs" in the coop represented by the binary digits of a decimal number. It converts the decimal number to binary, and counts how many `1`s (eggs) are present in the binary representation.

### Explanation:
1. **`displayValue.toString(2)`**: This converts the decimal `displayValue` to its binary string representation.
2. **`[...displayValue.toString(2)]`**: This converts the binary string into an array of characters (`'1'` or `'0'`).
3. **`reduce`**: This iterates through the array and increments the accumulator (`acc`) by 1 every time the current character (`curr`) is `'1'`.

### Example Walkthrough:

1. **Example 1:**
   - **Chicken Coop:**  
     ```
     _ _ _ _ _ _ _  
     |E| |E|E| | |E|
     ```
   - **Resulting Binary:** `1011001`
   - **Decimal:** `89`
   - **Actual Eggs:** 4 (because there are four `1`s in the binary representation `1011001`).

2. **Example 2:**
   - **Chicken Coop:**  
     ```
     _ _ _ _ _ _ _ _  
     | | | |E| | | | |
     ```
   - **Resulting Binary:** `00010000`
   - **Decimal:** `16`
   - **Actual Eggs:** 1 (because there is one `1` in the binary representation `00010000`).

### Code:

```javascript
export const eggCount = (displayValue) =>
  [...displayValue.toString(2)].reduce(
    (acc, curr) => (curr === "1" ? (acc += 1) : acc),
    0
  );
```

### Test Cases:

```javascript
console.log(eggCount(89));  // Output: 4 (Binary: 1011001)
console.log(eggCount(16));  // Output: 1 (Binary: 10000)
```

### Output:

- `eggCount(89)` will return `4`.
- `eggCount(16)` will return `1`.

This function works as expected for counting how many "eggs" (represented by `1`s in binary) are present for a given decimal value.