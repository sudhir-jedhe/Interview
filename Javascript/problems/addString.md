```js
var addStrings = function (num1, num2) {
  let i = num1.length - 1;
  let j = num2.length - 1;
  const ans = [];
  for (let c = 0; i >= 0 || j >= 0 || c; --i, --j) {
    c += i < 0 ? 0 : +num1[i];
    c += j < 0 ? 0 : +num2[j];
    ans.push(c % 10);
    c = Math.floor(c / 10);
  }
  return ans.reverse().join("");
};

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var subStrings = function (num1, num2) {
  const m = num1.length;
  const n = num2.length;
  const neg = m < n || (m == n && num1 < num2);
  if (neg) {
    const t = num1;
    num1 = num2;
    num2 = t;
  }
  let i = num1.length - 1;
  let j = num2.length - 1;
  const ans = [];
  for (let c = 0; i >= 0; --i, --j) {
    c = +num1[i] - c;
    if (j >= 0) {
      c -= +num2[j];
    }
    ans.push((c + 10) % 10);
    c = c < 0 ? 1 : 0;
  }
  while (ans.length > 1 && ans.at(-1) === 0) {
    ans.pop();
  }
  return (neg ? "-" : "") + ans.reverse().join("");
};
```

```
Given two non-negative integers, num1 and num2 represented as string, return the sum of num1 and num2 as a string.

You must solve the problem without using any built-in library for handling large integers (such as BigInteger). You must also not convert the inputs to integers directly.



Example 1:

Input: num1 = "11", num2 = "123"
Output: "134"
Example 2:

Input: num1 = "456", num2 = "77"
Output: "533"
Example 3:

Input: num1 = "0", num2 = "0"
Output: "0"


Constraints:

1 <= num1.length, num2.length <= 104
num1 and num2 consist of only digits.
num1 and num2 don't have any leading zeros except for the zero itself.

```

Your code provides two functions: `addStrings` and `subStrings`, both of which perform arithmetic operations on numbers represented as strings without directly converting them to integers. This is useful when the numbers are too large to fit in standard data types.

I'll walk through the logic and then provide an optimized and cleaned-up version of the `addStrings` function, as it's likely the one you need for your problem statement.

### **1. Add Strings Function (`addStrings`)**

The `addStrings` function handles the addition of two numbers represented as strings. Here's how it works:

- **Initialization:**
  - `i` and `j` are used to iterate through the strings from the last character (rightmost) to the first.
  - `ans` is an array that will store the digits of the sum in reverse order.

- **Loop through each digit:**
  - Start by adding digits of `num1` and `num2` from right to left.
  - If we go beyond the length of either string, treat the missing digits as `0`.
  - The `c` variable keeps track of the carry, which gets added to the sum.
- **Carry handling:**
  - The `c % 10` gives the current digit of the result, and `Math.floor(c / 10)` gives the carry to be added to the next digit.

- **Final result:**
  - The result array is reversed and joined to return the sum as a string.

### **2. Sub Strings Function (`subStrings`)**

This function seems to handle subtraction of two large numbers represented as strings. The logic is similar to `addStrings` with some additional complexity for handling negative results:

- **Comparison for Negative Result:**
  - If `num1` is smaller than `num2`, the result is negative, so the function swaps the numbers and adds a `-` sign.

- **Subtraction Logic:**
  - Subtract corresponding digits from `num1` and `num2`. If a digit in `num1` is smaller than the corresponding digit in `num2`, borrow from the higher place value (like in manual subtraction).

- **Trimming Leading Zeros:**
  - After performing the subtraction, leading zeros are removed, and the result is returned as a string.

---

### **Optimized and Corrected `addStrings` Function**

Let's start by cleaning up and optimizing the `addStrings` function, ensuring it works as expected.

```javascript
var addStrings = function (num1, num2) {
  let i = num1.length - 1; // Start from the last character of num1
  let j = num2.length - 1; // Start from the last character of num2
  let carry = 0; // This will store the carry value
  const result = []; // To store the result in reverse order

  // Continue looping as long as there are digits left in either num1 or num2 or there's a carry left
  while (i >= 0 || j >= 0 || carry) {
    let sum = carry; // Start with carry
    if (i >= 0) {
      sum += +num1[i]; // Add digit from num1 if available
      i--;
    }
    if (j >= 0) {
      sum += +num2[j]; // Add digit from num2 if available
      j--;
    }
    result.push(sum % 10); // Get the digit (mod 10)
    carry = Math.floor(sum / 10); // Update the carry for the next iteration
  }

  // Reverse the result array to get the correct order and join it into a string
  return result.reverse().join("");
};
```

### **Explanation of the Changes:**

1. **Carry Handling:**
   - Instead of adding the carry to `c`, I directly initialize `sum` with the carry and add the digits of `num1` and `num2` to it.

2. **Iterate While Any Digits or Carry Exist:**
   - We continue the loop as long as there are digits left in either `num1` or `num2`, or there's a carry to propagate.

3. **Push the Result Digit and Update Carry:**
   - After adding the digits, we calculate the result's digit (`sum % 10`) and update the carry for the next digit (`Math.floor(sum / 10)`).

4. **Reversing the Result:**
   - Since we are adding digits starting from the least significant one (rightmost), we need to reverse the result array to get the correct order of digits.

### **Test Cases:**

```javascript
console.log(addStrings("11", "123")); // Output: "134"
console.log(addStrings("456", "77")); // Output: "533"
console.log(addStrings("0", "0")); // Output: "0"
console.log(addStrings("999", "1")); // Output: "1000"
```

### **Performance Consideration:**

- **Time Complexity:**
  - O(max(m, n)) where `m` and `n` are the lengths of `num1` and `num2`, respectively. The loop runs once for each digit of both numbers.
- **Space Complexity:**
  - O(max(m, n)) due to the space used to store the result.

### **Conclusion:**

This solution efficiently handles the addition of large numbers represented as strings, adhering to the problem's constraints without converting the strings to integers directly. The `subStrings` function can be similarly optimized, but it seems your focus here is on the `addStrings` function. Let me know if you need further clarification or additional optimizations!
