Here’s a summary and implementation of each percentage formatting approach for various scenarios:

---

### **Using `Intl.NumberFormat` for percentages**
1. **With two decimal places, input as a whole number:**
   ```javascript
   function percentageFormatter(num) {
     return new Intl.NumberFormat('default', {
       style: 'percent',
       minimumFractionDigits: 2,
       maximumFractionDigits: 2,
     }).format(num / 100);
   }

   console.log(percentageFormatter(18.75)); // "18.75%"
   ```

2. **Without decimal places, input as a whole number:**
   ```javascript
   function percentageFormatter(num) {
     return new Intl.NumberFormat('default', {
       style: 'percent',
       minimumFractionDigits: 0,
       maximumFractionDigits: 0,
     }).format(num / 100);
   }

   console.log(percentageFormatter(18.75)); // "19%"
   ```

3. **With two decimal places, input as a decimal:**
   ```javascript
   function percentageFormatter(num) {
     return new Intl.NumberFormat('default', {
       style: 'percent',
       minimumFractionDigits: 2,
       maximumFractionDigits: 2,
     }).format(num);
   }

   console.log(percentageFormatter(0.1875)); // "18.75%"
   ```

---

### **Using `parseFloat` and template literals**
4. **Input as a whole number, format as percent with two decimals:**
   ```javascript
   function percentageFormatter(num) {
     return `${parseFloat(num).toFixed(2)}%`;
   }

   console.log(percentageFormatter(18.75)); // "18.75%"
   console.log(percentageFormatter(18.7));  // "18.70%"
   console.log(percentageFormatter(18));    // "18.00%"
   ```

5. **Input as a decimal, format as percent with two decimals:**
   ```javascript
   function percentageFormatter(num) {
     return `${parseFloat(num * 100).toFixed(2)}%`;
   }

   console.log(percentageFormatter(0.1875)); // "18.75%"
   console.log(percentageFormatter(0.187));  // "18.70%"
   console.log(percentageFormatter(0.18));   // "18.00%"
   ``` 

---

### **Comparison of Methods**

| **Method**                  | **Scenario**                                   | **Input** | **Output Example** |
|-----------------------------|-----------------------------------------------|-----------|---------------------|
| `Intl.NumberFormat` (1)     | Whole number with 2 decimals                 | 18.75     | 18.75%             |
| `Intl.NumberFormat` (2)     | Whole number, rounded (0 decimals)           | 18.75     | 19%                |
| `Intl.NumberFormat` (3)     | Decimal input with 2 decimals                | 0.1875    | 18.75%             |
| `parseFloat` (4)            | Whole number with 2 decimals                 | 18.75     | 18.75%             |
| `parseFloat` and scaling (5)| Decimal input with 2 decimals                | 0.1875    | 18.75%             |

Choose the approach based on your specific input and desired format.