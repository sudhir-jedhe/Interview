### Explanation of the Functions

The two functions you've written are designed to convert between column numbers and Excel-style column titles. Let's break them down:

---

### **1. `convertToTitle(columnNumber: number): string`**

This function converts a given column number into its corresponding Excel column title.

#### **How it works:**

- We start by initializing an empty array `res` that will hold the characters of the title.
- In the `while` loop, we repeatedly:
  - Decrease `columnNumber` by 1 to adjust the range of characters to 0-25 (`A-Z` corresponds to 1-26).
  - Use the modulus operator to get the remainder when dividing by 26, which gives us a number between 0 and 25.
  - The remainder is then converted to a character by adding it to the ASCII value of `'A'` (which is 65), creating the correct letter.
  - The character is prepended to the result array (`res.unshift(...)`).
  - The `columnNumber` is then divided by 26 (integer division) to process the next "digit" of the base-26 number.

#### **Code:**

```typescript
function convertToTitle(columnNumber: number): string {
    let res: string[] = [];
    while (columnNumber > 0) {
        --columnNumber;  // Adjust to zero-indexed
        let num: number = columnNumber % 26;  // Find remainder
        res.unshift(String.fromCharCode(num + 65));  // Convert to char and add to the front of the array
        columnNumber = Math.floor(columnNumber / 26);  // Reduce columnNumber for the next iteration
    }
    return res.join('');  // Join the array of characters to form the final string
}
```

#### **Example Usage:**

```typescript
console.log(convertToTitle(1));    // Output: "A"
console.log(convertToTitle(28));   // Output: "AB"
console.log(convertToTitle(701));  // Output: "ZY"
```

---

### **2. `titleToNumber(columnTitle: string): number`**

This function converts an Excel column title back to the corresponding column number.

#### **How it works:**

- We initialize `res` to 0, which will store the final numeric result.
- We loop through each character of the input string `columnTitle`:
  - For each character, we calculate its numeric value by subtracting `'A'`'s ASCII code (`64`).
  - Multiply the current result (`res`) by 26 to shift its "place value" (like moving from ones to tens in a decimal system).
  - Add the value of the current character to the result.
- This approach treats the column title as a number in base-26, where each character corresponds to a "digit" in the base-26 system.

#### **Code:**

```typescript
function titleToNumber(columnTitle: string): number {
    let res: number = 0;
    for (let char of columnTitle) {
        res = res * 26 + char.charCodeAt(0) - 64;  // Multiply by 26 and add the value of the current character
    }
    return res;  // Return the final result
}
```

#### **Example Usage:**

```typescript
console.log(titleToNumber("A"));    // Output: 1
console.log(titleToNumber("AB"));   // Output: 28
console.log(titleToNumber("ZY"));   // Output: 701
```

---

### **Explanation of Excel Column Mapping (A-Z)**
- **A** maps to 1, **B** to 2, ..., **Z** to 26.
- After Z (26), we have AA (27), AB (28), ..., AZ (52), and so on, in a way similar to a base-26 system.
- The `convertToTitle` function works by continuously dividing the column number by 26 and mapping the remainders to characters.
- The `titleToNumber` function treats the string as a base-26 number, where each letter represents a "digit" in that base.

### **Overall Example**

Let’s walk through an example step-by-step for both functions using column number `701`:

#### **1. `convertToTitle(701)`**

- First, we subtract 1: `700 % 26 = 24`, which corresponds to `'Y'`.
- Then, `700 / 26 = 26`, so we continue with `26`.
- Subtract 1 again: `25 % 26 = 25`, which corresponds to `'Z'`.
- So, `701` becomes `"ZY"`.

#### **2. `titleToNumber("ZY")`**

- We process the first letter `'Z'`: `Z = 26`.
- Then, we process `'Y'`: `Y = 25`.
- The final value is: `26 * 26 + 25 = 701`.

---

### **Edge Cases**

- **Single letter titles**: These are straightforward, like `"A"`, `"B"`, etc.
- **Multiple letter titles**: Titles like `"AA"`, `"AB"`, `"ZY"`, etc., will correctly be handled by both functions.
- **Invalid inputs**: Both functions assume valid inputs (for example, only letters for `titleToNumber` and positive integers for `convertToTitle`).

---

### **Conclusion**

These two functions allow easy conversion between Excel column numbers and column titles. They handle the base-26 nature of Excel column naming effectively.