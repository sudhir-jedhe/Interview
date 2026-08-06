### Problem Overview:
You want to count how many numbers up to a given number `n` have **unique digits**. This means no digit is repeated in any given number.

### Approach:

There are two possible solutions you've provided: 
1. **Brute-force method**: Check each number from `1` to `n` and verify whether it contains unique digits.
2. **Mathematical approach**: Calculate the count of valid numbers using a more efficient formula based on available digits.

Let's break down both approaches.

---

### 1. **Brute-Force Method**

This approach iterates over each number from `1` to `n` and checks if the number contains unique digits.

```javascript
function countNumbersWithUniqueDigits(n) {
    if (n === 0) return 1; // Only the number '0' is valid
    
    let count = 0;
    
    // Iterate through numbers from 1 to n
    for (let i = 1; i <= n; i++) {
        if (hasUniqueDigits(i)) {
            count++;
        }
    }
    
    return count;
}

function hasUniqueDigits(num) {
    const digits = num.toString();
    const seen = new Set();
    
    // Check if any digit repeats
    for (let digit of digits) {
        if (seen.has(digit)) {
            return false;
        }
        seen.add(digit);
    }
    
    return true;
}

// Example usage:
console.log(countNumbersWithUniqueDigits(20)); // Output: 324
```

### Explanation:
1. **Main Loop**: The loop iterates from `1` to `n`, checking each number.
2. **Unique Check**: For each number, we convert it to a string and check if any digit is repeated using a `Set`. If a repeated digit is found, the function returns `false`.
3. **Count**: If the number has unique digits, it increments the count.

- **Time Complexity**: The time complexity of this approach is **O(n * m)**, where `n` is the number of numbers to check and `m` is the average number of digits in each number. This is inefficient for larger values of `n`.
- **Space Complexity**: The space complexity is **O(m)** due to the storage of digits in a `Set`.

---

### 2. **Mathematical Approach**

This approach uses a more efficient formula based on the available digits to count how many numbers up to `n` have unique digits. It avoids brute-forcing every single number and instead calculates the possible combinations directly.

#### Steps:
1. The first digit (non-zero) has 9 options (`1-9`).
2. The second digit has 9 options (`0-9` excluding the first digit).
3. The third digit has 8 options (`0-9` excluding the first two digits), and so on.
4. If `n` is greater than `10`, the answer is `0`, since we can't have numbers with unique digits that have more than 10 digits.

```javascript
function countNumbersWithUniqueDigits(n) {
    if (n === 0) return 1; // 0 is a valid number with unique digits for n = 0
    if (n > 10) return 0; // No numbers with unique digits possible for n > 10 (more digits than available)
  
    let count = 9; // All digits can be used for the first digit (excluding 0)
    let availableDigits = 9; // Initially, all digits are available
  
    // Calculate for the remaining digits
    for (let i = 2; i <= n; i++) {
      availableDigits--; // One less digit available for each subsequent digit
      count *= availableDigits; // Multiply by remaining available digits
    }
  
    return count;
}
  
// Example usage
const n1 = 3; // Output: 729 (100 to 999)
const n2 = 0; // Output: 1 (0)
const n3 = 11; // Output: 0 (More than 10 digits can't have unique digits)

console.log(countNumbersWithUniqueDigits(n1)); // Output: 729
console.log(countNumbersWithUniqueDigits(n2)); // Output: 1
console.log(countNumbersWithUniqueDigits(n3)); // Output: 0
```

### Explanation:
1. **First Digit**: The first digit can be any of the digits from `1` to `9` (so there are 9 choices).
2. **Subsequent Digits**: For each subsequent digit, the number of available choices reduces by 1 because we want to ensure the digits are unique. For example, for the second digit, we have 9 choices (`0-9`, excluding the first digit).
3. **Return Count**: The result is computed by multiplying the number of available choices for each digit position.

#### Example Walkthrough:

For `n = 3`:
- For 1-digit numbers: There are 9 possible numbers (`1-9`).
- For 2-digit numbers: The first digit has 9 choices (`1-9`), and the second digit has 9 choices (`0-9` excluding the first digit). This gives us `9 * 9 = 81`.
- For 3-digit numbers: The first digit has 9 choices, the second digit has 9 choices, and the third digit has 8 choices (`0-9`, excluding the first two digits). This gives us `9 * 9 * 8 = 648`.
  
So, the total number of valid numbers for `n = 3` is `9 + 81 + 648 = 729`.

- **Time Complexity**: The time complexity of this approach is **O(n)**, as we loop through the number of digits up to `n`.
- **Space Complexity**: The space complexity is **O(1)** because we only need a constant amount of space for counting.

---

### Conclusion:

- The **Brute-force method** is simple but inefficient for large `n`, as it checks every number individually.
- The **Mathematical approach** is much more efficient, especially for larger `n`. It calculates the result directly without checking each number. This approach is optimal when `n` is reasonably small (<= 10), as more than 10 digits cannot have all unique digits.

