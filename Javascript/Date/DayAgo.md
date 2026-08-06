Your code for the functions `daysAgo` and `daysFromToday` looks good. Let's walk through both functions and their behavior.

### 1. `daysAgo(n)`

This function returns a date `n` days ago from the current date.

- **Implementation**: 
  - You create a new `Date` object (representing the current date and time).
  - Then, you adjust the day by subtracting `n` (the absolute value of `n` ensures that the function works with both positive and negative inputs).
  
```javascript
const daysAgo = n => {
    let d = new Date();
    d.setDate(d.getDate() - Math.abs(n));  // Subtract 'n' days
    return d;
};
```

- **Example**:

```javascript
daysAgo(20); // Returns a date 20 days ago from the current date
```

For instance, if the current date is **2024-01-06**, `daysAgo(20)` will return **2023-12-17**.

### 2. `daysFromToday(n)`

This function returns a date `n` days in the future from the current date.

- **Implementation**:
  - Similarly to `daysAgo`, you create a new `Date` object and adjust the day by adding `n` (again using the absolute value of `n`).
  
```javascript
const daysFromToday = n => {
    let d = new Date();
    d.setDate(d.getDate() + Math.abs(n));  // Add 'n' days
    return d;
};
```

- **Example**:

```javascript
daysFromToday(20); // Returns a date 20 days in the future from the current date
```

For example, if the current date is **2024-01-06**, `daysFromToday(20)` will return **2024-01-26**.

### Edge Cases to Consider:

1. **`daysAgo` with a Negative Input**: 
   Since you're using `Math.abs(n)`, the function will work even if a negative number is passed (e.g., `daysAgo(-5)` will work the same as `daysAgo(5)`).
   
2. **Leap Year & Month Variability**:
   Both functions are aware of month boundaries and leap years because they rely on JavaScript's built-in `Date` object, which handles these variations automatically. For instance:
   - `daysAgo(30)` will correctly account for months that have fewer than 30 days.
   - `daysFromToday(365)` will correctly account for leap years if the range crosses over February 29th.

3. **Edge Date Boundary (e.g., Year Change)**:
   The functions will correctly adjust the year when you go back to the previous year or forward into the next year.

---

### Example Results:

Assuming the current date is **2024-01-06**, here are the expected results:

- **`daysAgo(20)`**:
  - **Expected**: `2023-12-17` (20 days ago from January 6, 2024).
  - **Result**: A `Date` object representing `2023-12-17`.

- **`daysFromToday(20)`**:
  - **Expected**: `2024-01-26` (20 days after January 6, 2024).
  - **Result**: A `Date` object representing `2024-01-26`.

### Final Code:

```javascript
const daysAgo = n => {
    let d = new Date();
    d.setDate(d.getDate() - Math.abs(n));  // Subtract 'n' days
    return d;
};

const daysFromToday = n => {
    let d = new Date();
    d.setDate(d.getDate() + Math.abs(n));  // Add 'n' days
    return d;
};

console.log(daysAgo(20)); // Example output: 2023-12-17
console.log(daysFromToday(20)); // Example output: 2024-01-26
```

These functions are concise, work as expected, and are flexible for a wide range of use cases.

Feel free to let me know if you have any further questions!