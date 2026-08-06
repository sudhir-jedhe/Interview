The function `addDigits` efficiently calculates the digital root of a given number \( \text{num} \) using properties of modular arithmetic. Here's how the function works:

### **What is the Digital Root?**
The digital root of a number is obtained by repeatedly summing its digits until a single-digit number is obtained. For example:
- \( 38 \to 3 + 8 = 11 \to 1 + 1 = 2 \)
- \( 123 \to 1 + 2 + 3 = 6 \)

### **Explanation of the Code**
```javascript
function addDigits(num) {
    if (num === 0) {
      return 0;
    }
    return (num - 1) % 9 + 1;
}
```

1. **Handle Zero Case**:
   - If \( \text{num} \) is 0, the digital root is directly 0, as specified by the line:
     ```javascript
     if (num === 0) return 0;
     ```

2. **Mathematical Formula**:
   - The formula \((\text{num} - 1) \% 9 + 1\) computes the digital root directly without looping or summing digits.
   - This relies on a property of numbers called **congruence modulo 9**:
     - A number \( \text{num} \) is congruent to the sum of its digits modulo 9.
     - For non-zero numbers, the digital root can be derived as:
       \[
       \text{Digital Root} = (\text{num} - 1) \% 9 + 1
       \]

3. **Efficiency**:
   - The formula avoids repeated summing of digits, making it \( O(1) \) in complexity.
   - It directly computes the result for any \( \text{num} \).

### **Example Usage**

#### Input: `num = 38`
1. \( (38 - 1) \% 9 + 1 = 37 \% 9 + 1 = 1 + 1 = 2 \)
2. Output: \( 2 \)

#### Input: `num = 123`
1. \( (123 - 1) \% 9 + 1 = 122 \% 9 + 1 = 5 + 1 = 6 \)
2. Output: \( 6 \)

### **Why Use This Formula?**
- The repeated addition of digits can be tedious for very large numbers.
- Using the modulo operation ensures an instant result, leveraging number theory principles.

This function is both compact and highly efficient for finding the digital root of any non-negative integer.