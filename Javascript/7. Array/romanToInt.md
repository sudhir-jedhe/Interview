Your implementation of the **Roman to Integer** conversion is efficient and works correctly in both versions you've provided.

### Detailed Walkthrough:

1. **Basic Approach**:
   - The idea behind converting Roman numerals to integers involves iterating through the string, checking each Roman numeral character and its value, and then deciding whether to add or subtract based on its relation to the next character.
   
2. **Roman Numeral Subtraction Rules**:
   - Roman numerals like **IV** (4) or **IX** (9) have a subtractive notation. For example:
     - If the current numeral is smaller than the next numeral (e.g., `I < V`), then it should be subtracted (`IV = 5 - 1 = 4`).
     - In all other cases, we add the value of the current numeral.

---

### Code Explanation (First Version):

```javascript
function romanToInt(s) {
    const romanToIntMap = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };
    
    let result = 0;
    
    for (let i = 0; i < s.length; i++) {
        // Current and next character values
        let currentVal = romanToIntMap[s[i]];
        let nextVal = romanToIntMap[s[i + 1]];  // next character
        
        // If current value is less than next value, subtract it (e.g., IV, IX)
        if (nextVal && currentVal < nextVal) {
            result -= currentVal;
        } else {
            result += currentVal;
        }
    }
    
    return result;
}
```

#### Key Points:
- **Map Initialization**: A map (`romanToIntMap`) is created to map Roman numerals to their corresponding integer values.
- **Loop through Characters**: The loop goes through each character of the Roman numeral string.
- **Subtraction Condition**: If the current character is less than the next character (i.e., in subtractive notation), it subtracts the current character's value.
- **Result Calculation**: In all other cases, it adds the current character's value to the result.

This approach works well and is quite clean, but the line `let nextVal = romanToIntMap[s[i + 1]];` accesses the next character, which can be `undefined` when `i + 1` is out of bounds (at the last character of the string). This doesn't cause a problem since `nextVal` is checked in the condition (`if (nextVal && currentVal < nextVal)`), so no error occurs.

---

### Code Explanation (Second Version):

```javascript
function romanToInt(str) {
    const romanMap = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
  
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const current = romanMap[str[i]];
      const next = romanMap[str[i + 1]];
  
      // Handle subtractive notation (IV, IX, XL, XC, CD, CM)
      if (current < next && i < str.length - 1) {
        result += next - current;
        i++; // Skip the next character as it's already considered
      } else {
        result += current;
      }
    }
  
    return result;
}
```

#### Key Differences:
- **Increased Readability**: The second version has a more readable naming convention for variables (`current` and `next`), which makes it easier to follow the logic.
- **Skipping the Next Character**: After processing a pair (like `IV`), the index `i` is incremented by 1 (`i++`), so the next character is skipped because it's already handled as part of the subtraction. This approach avoids having to access `s[i + 1]` in the loop.

---

### Example Output:

```javascript
console.log(romanToInt("III"));       // Output: 3
console.log(romanToInt("LVIII"));     // Output: 58
console.log(romanToInt("MCMXCIV"));   // Output: 1994
```

This will output the expected integer values for the corresponding Roman numerals.

---

### Edge Case Handling:
Both implementations will handle common Roman numeral combinations, including subtractive notations (`IV`, `IX`, etc.). However, if you expect to handle invalid Roman numerals (e.g., improperly formed strings), you may want to add validation or error checking to ensure the input string follows valid Roman numeral conventions.

---

### Performance Considerations:
Both implementations run in **O(n)** time complexity, where `n` is the length of the input string. This is optimal, as we must inspect each character in the Roman numeral string at least once.

---

Let me know if you'd like additional refinements or have further questions!