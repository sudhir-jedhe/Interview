The function `convertToTitle()` is designed to convert a given column number (like in Excel) to its corresponding column title (letters). For example, 1 maps to "A", 28 maps to "AB", and 701 maps to "ZY".

Let's break down both versions of the function:

### **1. First Version of `convertToTitle()`**

```javascript
function convertToTitle(columnNumber) {
    let result = '';
    
    while (columnNumber > 0) {
        let remainder = (columnNumber - 1) % 26;  // Adjusted to handle 'A' starting from 1
        result = String.fromCharCode('A'.charCodeAt(0) + remainder) + result;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    
    return result;
}

// Examples
console.log(convertToTitle(1));   // Output: "A"
console.log(convertToTitle(28));  // Output: "AB"
console.log(convertToTitle(701)); // Output: "ZY"
```

### **Explanation**:
- The function works in a loop where it takes the current column number, calculates the remainder when divided by 26 (`(columnNumber - 1) % 26`), and maps this to a letter using `String.fromCharCode()`.
- The reason for subtracting 1 (`columnNumber - 1`) is to adjust the indexing, as Excel columns start from 1 (for "A") but the `charCodeAt` method operates on ASCII characters, where "A" starts at 65.
- It then appends the corresponding character to the result and reduces the `columnNumber` for the next iteration using integer division by 26.
- This process continues until `columnNumber` becomes 0.

### **2. Second Version of `convertToTitle()`**

```javascript
function convertToTitle(columnNumber) {
    let result = "";
    while (columnNumber > 0) {
      const remainder = columnNumber % 26;
      const charCode = remainder === 0 ? 'Z'.charCodeAt(0) : remainder + 'A'.charCodeAt(0) - 1;
      result = String.fromCharCode(charCode) + result;
      columnNumber = Math.floor(columnNumber / 26) - (remainder === 0 ? 1 : 0);
    }
    return result;
}

// Example usage
const colNum1 = 1;
const colNum2 = 28;
const colNum3 = 701;

console.log(convertToTitle(colNum1)); // Output: "A"
console.log(convertToTitle(colNum2)); // Output: "AB"
console.log(convertToTitle(colNum3)); // Output: "ZY"
```

### **Explanation**:
- The second version handles the same problem but uses a slightly different approach for calculating the character code and adjusting the `columnNumber`.
- The key difference in this version is handling the case when the remainder is `0` (meaning the column corresponds to 'Z'). In this case, the column number is reduced by 1 before continuing the process, effectively treating 'Z' as a special case (i.e., after 25, the next letter is 'A' again, but for this particular step, we manually adjust the division).
- The formula `(remainder === 0 ? 'Z'.charCodeAt(0) : remainder + 'A'.charCodeAt(0) - 1)` ensures that 'Z' maps correctly when the remainder is zero.
- The condition `columnNumber = Math.floor(columnNumber / 26) - (remainder === 0 ? 1 : 0);` ensures that the column number is adjusted when the remainder is zero.

### **Output for Both Versions**:
```javascript
console.log(convertToTitle(1));   // Output: "A"
console.log(convertToTitle(28));  // Output: "AB"
console.log(convertToTitle(701)); // Output: "ZY"
```

### **Key Differences**:
- Both versions function in the same way and ultimately provide the correct results.
- The main difference lies in how they handle the calculation when the column number is exactly divisible by 26, ensuring that 'Z' is properly mapped.

Both approaches will give you the correct output, so you can use whichever fits your preferences for clarity and readability. The logic in both handles the conversion from column numbers to Excel-like column titles.