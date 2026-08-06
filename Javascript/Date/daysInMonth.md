Your function `daysInMonth` correctly returns the number of days in a given month of a given year. Let's break it down:

### Explanation:

The `new Date(year, month, 0)` trick is used to get the number of days in a specific month. Here's why it works:

- The `Date` constructor takes the year, month, and day as parameters. 
- In JavaScript, months are **zero-indexed** (January is `0`, February is `1`, etc.), so passing `month` as an argument gives you the correct month.
- By setting the day argument to `0`, the `Date` object is set to the last day of the **previous month**.
- The `getDate()` method then returns the day of that last date, which is equivalent to the total number of days in the month you are interested in.

### Code:

```javascript
const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
```

### Examples:

1. **For December 2020**:
   ```javascript
   daysInMonth(2020, 12);  // 31
   ```
   - In this case, December is the 12th month (but the function uses `0` to get the last day of November).
   - `new Date(2020, 12, 0)` gives us `November 30, 2020`.
   - `getDate()` returns `31`, the number of days in December 2020.

2. **For February 2024** (a leap year):
   ```javascript
   daysInMonth(2024, 2);  // 29
   ```
   - February is the 2nd month, but `0` is used to get the last day of January.
   - `new Date(2024, 2, 0)` gives us `January 31, 2024`.
   - `getDate()` returns `29`, the number of days in February 2024 (since 2024 is a leap year).

### Other Example Outputs:

```javascript
console.log(daysInMonth(2023, 1)); // 31 (January)
console.log(daysInMonth(2023, 2)); // 28 (February, non-leap year)
console.log(daysInMonth(2023, 4)); // 30 (April)
console.log(daysInMonth(2023, 7)); // 31 (July)
console.log(daysInMonth(2024, 2)); // 29 (February, leap year)
```

### Benefits:
- **Simple and clean**: The function is very concise and utilizes JavaScript's `Date` object in a clever way.
- **Automatically handles leap years**: The function correctly adjusts for leap years (e.g., February in 2024 has 29 days, while February in 2023 has 28 days).
- **No external libraries needed**: This solution does not require any additional libraries, making it lightweight.

This implementation is correct and covers all cases.