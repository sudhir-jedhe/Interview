```js

const isLeapYear = year => new Date(year, 1, 29).getMonth() === 1;

isLeapYear(2019); // false
isLeapYear(2020); // true

```

Your implementation of the `isLeapYear` function is correct and works as expected. Here’s a brief explanation of how it works:

### Explanation:
- **Date Constructor:** `new Date(year, 1, 29)` creates a date object for February 29th of the given year. The month `1` corresponds to February (JavaScript months are 0-indexed, so `0` is January, `1` is February, etc.).
- **Leap Year Check:** For a leap year, February has 29 days, so `getMonth()` on the created date should return `1` (February). If the year is not a leap year, `new Date(year, 1, 29)` will return a date in March (because February 29 does not exist in non-leap years), and `getMonth()` will return `2` (March).
  
Thus, if `getMonth()` returns `1`, it's a leap year; otherwise, it’s not.

### Example Usage:

```javascript
console.log(isLeapYear(2019)); // false, because 2019 is not a leap year
console.log(isLeapYear(2020)); // true, because 2020 is a leap year
console.log(isLeapYear(2000)); // true, because 2000 is a leap year
console.log(isLeapYear(1900)); // false, because 1900 is not a leap year
```

### Edge Case:
- **Century Years:** The rule for leap years also includes a special case: Century years (like 1900) are *not* leap years unless they are divisible by 400. Your function correctly handles this case, as `new Date(1900, 1, 29)` will give an invalid date (March 1st), and thus the check will return `false`.

This implementation is efficient and straightforward for determining whether a given year is a leap year.