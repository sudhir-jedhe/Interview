Here’s the complete and formatted code with comments for clarity:

```javascript
class Solution {
  // Method to check if a number is a perfect number
  checkPerfectNumber(num) {
    // Edge case: 1 is not a perfect number
    if (num === 1) {
      return false;
    }

    let s = 1; // Start with 1, as it is a divisor of all positive integers

    // Iterate from 2 to √num to find divisors
    for (let i = 2; i * i <= num; ++i) {
      // Check if 'i' is a divisor of 'num'
      if (num % i === 0) {
        s += i; // Add the divisor to the sum
        // Add the paired divisor if it is different
        if (i !== num / i) {
          s += num / i;
        }
      }
    }

    // If the sum of divisors equals the number, it's a perfect number
    return s === num;
  }
}

// Create an instance of the Solution class
let sol = new Solution();

// Test cases
console.log(sol.checkPerfectNumber(28)); // true, because 28 = 1 + 2 + 4 + 7 + 14
console.log(sol.checkPerfectNumber(6));  // true, because 6 = 1 + 2 + 3
console.log(sol.checkPerfectNumber(12)); // false, because 12 != 1 + 2 + 3 + 4 + 6
```

---

### Explanation:

1. **Initialization:**
   - \( s = 1 \): Start with \( 1 \) because \( 1 \) is a divisor of all positive integers.

2. **Iterate for Divisors:**
   - The loop runs from \( 2 \) to \( \sqrt{\text{num}} \). Divisors come in pairs (e.g., for \( 28 \), divisors are \( 2 \) and \( 14 \)), so this optimization reduces redundant calculations.
   - If \( i \) divides \( \text{num} \), add both \( i \) and \( \text{num} / i \) to the sum \( s \).

3. **Check for Equality:**
   - After summing all proper divisors, if \( s \) equals \( \text{num} \), the number is a perfect number.

4. **Edge Case:**
   - \( 1 \) is not considered a perfect number as it has no proper divisors.

5. **Time Complexity:**
   - \( O(\sqrt{n}) \), as the loop only runs up to \( \sqrt{\text{num}} \).

6. **Space Complexity:**
   - \( O(1) \), as no additional space is used.

### Output:
The code checks for perfect numbers and prints:
```plaintext
true
true
false
```