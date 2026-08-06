Here's the explanation of how the `romanToInteger` function works:

---

### **Function Logic**
The function converts a Roman numeral string to an integer. Roman numerals use a combination of characters (`I`, `V`, `X`, `L`, `C`, `D`, `M`) with specific values. 

### **Key Roman Numeral Rules**
1. Roman numerals are generally written from largest to smallest, left to right (e.g., `XVI` = 10 + 5 + 1 = 16).
2. If a smaller numeral appears before a larger numeral, subtract the smaller value from the larger one (e.g., `IV` = 5 - 1 = 4, `IX` = 10 - 1 = 9).

---

### **Steps in the Function**

1. **Create a Mapping of Roman Numerals to Integers**  
   The object `romanValues` stores the value of each Roman numeral:
   ```javascript
   const romanValues = {
       'I': 1,
       'V': 5,
       'X': 10,
       'L': 50,
       'C': 100,
       'D': 500,
       'M': 1000
   };
   ```

2. **Iterate Over the Roman Numeral String**  
   The function loops through each character in the input string `str`.

3. **Compare Current and Next Values**  
   - `currentValue`: The value of the current Roman numeral character.
   - `nextValue`: The value of the next Roman numeral character (if it exists).

   - If `nextValue > currentValue`, the function adds `nextValue - currentValue` to `result` (e.g., for `IV`, 5 - 1 = 4).
   - If `currentValue >= nextValue`, simply add `currentValue` to `result`.

4. **Handle Skipping Characters**  
   When a subtraction rule is applied (`IV`, `IX`), the function increments `i` by 1 to skip the next character, as it has already been processed.

5. **Return the Final Result**  
   The cumulative sum stored in `result` is returned as the integer equivalent of the Roman numeral.

---

### **Example Usage**

```javascript
const result = romanToInteger('MCMXCIV');
console.log(result); // Output: 1994
```

**Step-by-Step Breakdown for `'MCMXCIV'`:**
1. `M` = 1000
2. `CM` = 900 (1000 - 100)
3. `XC` = 90 (100 - 10)
4. `IV` = 4 (5 - 1)

**Total = 1000 + 900 + 90 + 4 = 1994**

---

### **Edge Cases**
1. **Empty String**: Return 0.
   ```javascript
   console.log(romanToInteger('')); // Output: 0
   ```
2. **Single Character**: Directly maps to its value.
   ```javascript
   console.log(romanToInteger('X')); // Output: 10
   ```
3. **Non-standard Input**: If the input contains invalid characters, add error handling or input validation.

```javascript
function romanToInteger(str) {
    const romanValues = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    let result = 0;

    for (let i = 0; i < str.length; i++) {
        if (!romanValues[str[i]]) {
            throw new Error(`Invalid Roman numeral: ${str[i]}`);
        }
        const currentValue = romanValues[str[i]];
        const nextValue = romanValues[str[i + 1]];

        if (nextValue && currentValue < nextValue) {
            result += nextValue - currentValue;
            i++;
        } else {
            result += currentValue;
        }
    }

    return result;
}
```

With this addition, invalid input like `'ABC'` will throw an error.