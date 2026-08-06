Your code logic for determining whether a date is a weekday or a weekend is almost correct, but there is a slight issue with the `isWeekend` function. Specifically, the `getDay()` method returns:

- `0` for Sunday,
- `1` for Monday,
- `2` for Tuesday,
- `3` for Wednesday,
- `4` for Thursday,
- `5` for Friday,
- `6` for Saturday.

So, to check for weekends (i.e., Sunday and Saturday), the `isWeekend` function should check if the `getDay()` value is either `0` (Sunday) or `6` (Saturday). Your current `isWeekend` logic only checks if `date.getDay() % 6 === 0`, which will return `true` for Sundays but not for Saturdays.

### Corrected version:

```javascript
const isWeekday = date => date.getDay() !== 0 && date.getDay() !== 6; // Monday to Friday
const isWeekend = date => date.getDay() === 0 || date.getDay() === 6; // Saturday and Sunday
```

### Explanation:

- **`isWeekday`**: A weekday is any day that is not Sunday (0) or Saturday (6). So, the condition `date.getDay() !== 0 && date.getDay() !== 6` checks for any day other than Sunday and Saturday.
  
- **`isWeekend`**: The weekend includes only Sunday (0) and Saturday (6). So, `date.getDay() === 0 || date.getDay() === 6` will check for these days.

### Example:

```javascript
console.log(isWeekday(new Date('2024-01-05'))); // true (Friday)
console.log(isWeekend(new Date('2024-01-05'))); // false (Friday)

console.log(isWeekday(new Date('2024-01-06'))); // false (Saturday)
console.log(isWeekend(new Date('2024-01-06'))); // true (Saturday)

console.log(isWeekday(new Date('2024-01-07'))); // false (Sunday)
console.log(isWeekend(new Date('2024-01-07'))); // true (Sunday)
```

### Output:
```
true   // 2024-01-05 is a weekday (Friday)
false  // 2024-01-05 is not a weekend

false  // 2024-01-06 is a weekend (Saturday)
true   // 2024-01-06 is a weekend

false  // 2024-01-07 is a weekend (Sunday)
true   // 2024-01-07 is a weekend
```

This approach correctly handles weekdays and weekends as intended.