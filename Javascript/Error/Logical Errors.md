Occur when the code runs completely fine without throwing any explicit JavaScript exception, but produces unexpected or incorrect output due to faulty logic.

```javascript
// Example 1: Off-by-one error in a loop (skips the last item)
const list = [10, 20, 30];
for (let i = 0; i < list.length - 1; i++) {
  console.log(list[i]); // Misses printing 30
}

// Example 2: Operator precedence mistake (intended: (a + b) / 2)
const avg = 10 + 20 / 2; // Returns 20 instead of 15

// Example 3: Assignment (`=`) instead of equality comparison (`===`)
let isLoggedIn = false;
if (isLoggedIn = true) { // Always evaluates to true and reassigns variable
  console.log("Welcome!");
}

// Example 4: Floating point arithmetic precision issue
const isPointThree = (0.1 + 0.2 === 0.3); // Evaluates to false (0.1 + 0.2 = 0.30000000000000004)

// Example 5: Array mutability bug (mutating original array instead of copying)
const original = [1, 2, 3];
const modified = original.reverse(); // Mutates 'original' in place unintentionally

```
