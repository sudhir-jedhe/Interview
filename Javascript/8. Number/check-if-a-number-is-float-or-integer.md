### Code Explanation

The examples demonstrate various techniques for determining whether a number is an integer or a float using JavaScript. Here's a breakdown:

---

### **1. Check if a Number is an Integer (Using `Number.isInteger`)**
```javascript
const inputNumber = 42;
const isInteger = Number.isInteger(inputNumber);
console.log(`Is ${inputNumber} an integer? ${isInteger}`);
```

- **Explanation**:
  - The `Number.isInteger()` method checks if the given value is a number and an integer.
  - `42` is an integer, so the result is `true`.

- **Output**:
  ```
  Is 42 an integer? true
  ```

---

### **2. Check if a Number is an Integer (Using Modulo Operation)**
```javascript
const inputNumber = 3.14;
const isInteger = inputNumber % 1 === 0;
console.log(`Is ${inputNumber} an integer? ${isInteger}`);
```

- **Explanation**:
  - A number is an integer if it is divisible by 1 without a remainder.
  - For `3.14`, `3.14 % 1` evaluates to `0.14`, which means it is not an integer.

- **Output**:
  ```
  Is 3.14 an integer? false
  ```

---

### **3. Check if a Number is a Float (Using Regular Expressions)**
```javascript
const inputNumber = 123.456;
const numberString = inputNumber.toString();
const isFloat = /\d+\.\d+/.test(numberString);
console.log(`Is ${inputNumber} a float? ${isFloat}`);
```

- **Explanation**:
  - Converts the number to a string using `toString()` and checks for a decimal point using a regular expression `\d+\.\d+`.
  - For `123.456`, the regex matches `123.456` since it has digits before and after the decimal point.

- **Output**:
  ```
  Is 123.456 a float? true
  ```

---

### **4. Generalized Function to Check if a Number is a Float**
```javascript
const isFloat = (num) => {
    if (typeof num == 'number' && !isNaN(num)) {
        if (!Number.isInteger(num)) {
            return true;
        }
    }
    return false;
};

console.log(isFloat(100)); // false
console.log(isFloat(100.1)); // true
console.log(isFloat(null)); // false
```

- **Explanation**:
  - The function checks:
    1. If the input is a number using `typeof num === 'number'`.
    2. If it is not `NaN`.
    3. If it is not an integer using `!Number.isInteger(num)`.
  - Returns `true` for floats and `false` for integers or invalid inputs.

- **Outputs**:
  ```
  isFloat(100); // false (100 is an integer)
  isFloat(100.1); // true (100.1 is a float)
  isFloat(null); // false (null is not a number)
  ```

---

### **Key Takeaways**
1. **`Number.isInteger()`** is the cleanest way to check for integers.
2. **Modulo Operation (`%`)** can also verify integers by checking if the remainder is `0`.
3. **Regular Expressions** can be used to detect floats from the string representation of a number.
4. A generalized function like `isFloat()` combines all checks for robustness.