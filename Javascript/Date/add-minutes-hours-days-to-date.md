Your code implements a series of functions to manipulate dates by adding or subtracting hours, minutes, seconds, days, and weekdays. The code looks well-structured and functional, but I'll provide some improvements, explanations, and details to ensure it's fully clear and optimized.

### 1. **Add Hours to a Date**

```javascript
const addHoursToDate = (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 3_600_000); // 3,600,000 milliseconds = 1 hour
    return d;
};
```

This function adds or subtracts hours (`n`) to a given `date`. The `setTime` method is used to update the date by adding `n` hours (converted to milliseconds).

- **Example**: Adding 10 hours to `2020-10-19 12:00:00` results in `2020-10-19 22:00:00`.

### 2. **Add Minutes to a Date**

```javascript
const addMinutesToDate = (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 60_000); // 60,000 milliseconds = 1 minute
    return d;
};
```

This function adds or subtracts minutes (`n`) to a given `date`. Again, it uses the `setTime` method, but with `n` minutes converted to milliseconds.

- **Example**: Adding 10 minutes to `2020-10-19 12:00:00` results in `2020-10-19 12:10:00`.

### 3. **Add Seconds to a Date**

```javascript
const addSecondsToDate = (date, n) => {
    const d = new Date(date);
    d.setTime(d.getTime() + n * 1000); // 1000 milliseconds = 1 second
    return d;
};
```

This function works similarly to the previous ones, adding or subtracting seconds to a given `date`. The `n` seconds are converted into milliseconds.

- **Example**: Adding 10 seconds to `2020-10-19 12:00:00` results in `2020-10-19 12:00:10`.

### 4. **Add Days to a Date**

```javascript
const addDaysToDate = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n); // Adds or subtracts days
    return d;
};
```

This function adds or subtracts days (`n`) to a given date. The `setDate` method is used to modify the date directly by adding or subtracting `n` days.

- **Example**: Adding 10 days to `2020-10-15` results in `2020-10-25`.

### 5. **Check if a Day is a Weekday**

```javascript
const isWeekday = date => date.getDay() % 6 !== 0;
```

This helper function checks if the provided `date` is a weekday (i.e., not a Saturday or Sunday). The `getDay` method returns the day of the week (0 = Sunday, 6 = Saturday), and the modulus operator ensures that the result is `false` for weekends.

- **Example**: `isWeekday(new Date('2020-10-05'))` returns `true` (Monday).

### 6. **Add Weekdays to a Date**

```javascript
const addWeekDays = (date, n) => {
  const s = Math.sign(n); // Store whether we're adding or subtracting
  const d = new Date(date);
  
  return Array.from({ length: Math.abs(n) }).reduce((currentDate) => {
    currentDate = addDaysToDate(currentDate, s); // Add/subtract 1 day
    while (!isWeekday(currentDate)) // Skip weekends
      currentDate = addDaysToDate(currentDate, s); // Add/subtract another day if weekend
    return currentDate;
  }, d);
};
```

This function adds or subtracts weekdays (`n`) to a given `date`. Here's how it works:

1. **Sign of `n`**: The `Math.sign(n)` is used to determine if you're adding or subtracting weekdays. `Math.sign(n)` will return `1` for positive numbers and `-1` for negative numbers.
   
2. **Loop over days**: It uses `Array.from({ length: Math.abs(n) })` to create an array of length `|n|` (the absolute value of `n`). Then, it iterates over the array and uses `addDaysToDate` to add or subtract a day at a time.
   
3. **Skip Weekends**: After each day is added/subtracted, the code checks whether the resulting date is a weekend (Saturday or Sunday). If it is, it skips that day and adds/subtracts another day to find the next weekday.

### 7. **Examples**

```javascript
addWeekDays('2020-10-05', 5); 
// Output: 2020-10-12 (because weekends are skipped)

addWeekDays('2020-10-05', -5); 
// Output: 2020-09-28 (because weekends are skipped)
```

### Notes & Improvements:
- **Edge Case for Weekends**: The current implementation uses `addDaysToDate` to jump through weekends, which works fine. But you may want to handle edge cases like crossing months or years more explicitly, especially when dealing with negative numbers.
  
- **Date Validation**: Consider adding some validation for input dates to ensure that the input is a valid date string or object. This would help catch potential bugs if an invalid date is passed in.

- **Timezone Considerations**: Depending on how you're using these functions, you may need to consider timezone offsets when dealing with date manipulations. However, for most basic use cases, the `Date` object in JavaScript works fine as long as you keep the date format consistent.

### Conclusion:

Your implementation is solid and functional. These date manipulation utilities should work well for adding or subtracting time (in hours, minutes, seconds, days, or weekdays) from a given date. The `addWeekDays` function, in particular, is a nice touch for handling business days and skipping weekends.