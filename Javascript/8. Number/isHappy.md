Here is the complete implementation of the happy number checker in TypeScript:

```typescript
function isHappy(n: number): boolean {
    // Helper function to calculate the sum of squares of digits
    const getNext = (n: number) => {
        let res = 0;
        while (n !== 0) {
            const digit = n % 10;   // Extract the last digit
            res += digit ** 2;      // Add the square of the digit to the result
            n = Math.floor(n / 10); // Remove the last digit
        }
        return res;
    };

    let slow = n;              // Slow pointer starts at n
    let fast = getNext(n);     // Fast pointer starts at the next number in the sequence

    // Loop until the slow and fast pointers meet
    while (slow !== fast) {
        slow = getNext(slow);           // Move the slow pointer by one step
        fast = getNext(getNext(fast));  // Move the fast pointer by two steps
    }

    // If the fast pointer reaches 1, n is a happy number
    return fast === 1;
}

// Example usage:
console.log(isHappy(19)); // true (19 is a happy number)
console.log(isHappy(2));  // false (2 is not a happy number)
console.log(isHappy(7));  // true (7 is a happy number)
```

### How the Code Works:
1. **Helper Function (`getNext`)**:
   - Computes the sum of the squares of the digits of a number.
2. **Cycle Detection**:
   - Uses the two-pointer technique to detect if the sequence of numbers enters a cycle.
3. **Return Value**:
   - Returns `true` if the number eventually reaches `1` (happy number).
   - Returns `false` if the sequence forms a loop that doesn’t include `1`.

---

### Example Outputs
#### Input: `19`
- Sequence: \(19 \rightarrow 82 \rightarrow 68 \rightarrow 100 \rightarrow 1\)
- Output: `true`

#### Input: `2`
- Sequence: \(2 \rightarrow 4 \rightarrow 16 \rightarrow 37 \rightarrow 58 \rightarrow 89 \rightarrow 145 \rightarrow 42 \rightarrow 20 \rightarrow 4\) (forms a loop)
- Output: `false`

This code is robust and handles all edge cases for determining happy numbers.