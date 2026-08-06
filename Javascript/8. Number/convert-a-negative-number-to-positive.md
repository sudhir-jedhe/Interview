### Explanation of Methods to Convert Negative Numbers to Positive

#### 1. **Using Multiplication by -1**
```javascript
function convert_positive(a) {
  if (a < 0) {
    a = a * -1;
  }
  return a;
}
```
- **Logic**: If the number is negative, multiply it by `-1` to make it positive.
- **Example**:
  - Input: `-10`
  - Output: `10`

---

#### 2. **Using `Math.abs()`**
```javascript
n = Math.abs(n);
```
- **Logic**: The `Math.abs()` function returns the absolute value of a number, effectively converting negatives to positives.
- **Example**:
  - Input: `-30`
  - Output: `30`

---

#### 3. **Using a Ternary Operator**
```javascript
function convert_positive(a) {
  return a < 0 ? -a : a;
}
```
- **Logic**: The ternary operator checks if the number is negative. If so, it multiplies by `-1`, otherwise returns the original number.
- **Example**:
  - Input: `-10`
  - Output: `10`

---

#### 4. **Using Bitwise NOT (`~`)**
```javascript
function convert_positive(a) {
  return a < 0 ? ~a + 1 : a;
}
```
- **Logic**: 
  - For negative numbers, the bitwise NOT operator (`~`) inverts the bits, which gives the two's complement minus one. Adding `1` produces the absolute value.
  - For positive numbers, it simply returns the original number.
- **Example**:
  - Input: `-10`
  - Output: `10`

---

#### 5. **Using `Math.sqrt()` and `Math.pow()`**
```javascript
function convertToPositive(number) {
  return Math.sqrt(Math.pow(number, 2));
}
```
- **Logic**:
  - Square the number using `Math.pow()`, which makes any number non-negative.
  - Take the square root using `Math.sqrt()` to revert to the original magnitude.
- **Example**:
  - Input: `-5`
  - Output: `5`

---

### Key Differences:
| **Method**               | **Code Simplicity** | **Performance** | **Notes**                            |
|--------------------------|---------------------|----------------|--------------------------------------|
| Multiplication by `-1`   | Simple              | Fast           | Direct and effective for negatives. |
| `Math.abs()`             | Simplest            | Fast           | Built-in and recommended for clarity. |
| Ternary Operator         | Moderate            | Fast           | Customizable for additional logic.  |
| Bitwise NOT              | Complex             | Fast           | Advanced usage; less readable.       |
| `Math.sqrt()` & `Math.pow()` | Complex             | Slower         | Fun approach but overkill.           |

### Recommended Approach:
- For simplicity and clarity, **use `Math.abs()`** whenever possible.