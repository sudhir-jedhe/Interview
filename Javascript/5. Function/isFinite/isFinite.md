// The isFinite() function is used to determine whether a number is a finite, legal number. It returns false if the value is +infinity, -infinity, or NaN (Not-a-Number), otherwise it returns true.

The `isFinite()` function is a global JavaScript function that checks whether a given value is a finite number. Here’s a detailed explanation:

---

### **Behavior of `isFinite()`**

1. **Finite Numbers:**  
   - If the value is a number and within the range of finite numbers, it returns `true`.  
   Example:
   ```javascript
   isFinite(100); // true
   isFinite(-9999); // true
   isFinite(0); // true
   ```

2. **Infinity:**  
   - Returns `false` for positive or negative infinity.  
   Example:
   ```javascript
   isFinite(Infinity); // false
   isFinite(-Infinity); // false
   ```

3. **NaN (Not-a-Number):**  
   - Returns `false` for `NaN`.  
   Example:
   ```javascript
   isFinite(NaN); // false
   ```

4. **Non-Numeric Strings and Non-Numeric Values:**  
   - Non-numeric strings or other non-number values are first coerced to numbers. If the result is not finite, it returns `false`.  
   Example:
   ```javascript
   isFinite("hello"); // false
   isFinite("100"); // true (string is coerced to a number)
   isFinite(""); // true (empty string is coerced to 0)
   isFinite(null); // true (null is coerced to 0)
   isFinite(undefined); // false
   ```

---

### **Difference Between `isFinite()` and `Number.isFinite()`**
- **`isFinite()`:** Coerces the value to a number before checking.  
- **`Number.isFinite()`:** Does not coerce the value; it only returns `true` for finite numbers.  

Examples:
```javascript
isFinite("100"); // true
Number.isFinite("100"); // false (strictly checks without coercion)

isFinite(null); // true
Number.isFinite(null); // false
```

---

### **Examples of Usage**

1. **Filter Finite Numbers in an Array:**
   ```javascript
   const values = [100, "200", NaN, Infinity, -Infinity, 0];
   const finiteValues = values.filter(value => isFinite(value));
   console.log(finiteValues); // [100, "200", 0]
   ```

2. **Check Valid Inputs:**
   ```javascript
   const input = prompt("Enter a number:");
   if (isFinite(input)) {
     console.log("Valid number!");
   } else {
     console.log("Invalid number!");
   }
   ```

---

### **Limitations**
- Be cautious with `isFinite()` as it coerces values, which might not always be desirable. For strict checks, prefer `Number.isFinite()`.