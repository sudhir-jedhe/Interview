Your functions for calculating the **day of the year**, **week of the year**, **month of the year**, and **quarter of the year** are correctly implemented. Here's an explanation of each one and some examples:

### 1. **Day of the Year**

The **day of the year** is the number of days that have passed since January 1st. You correctly calculate this by subtracting the given date (`date`) from the first day of the year (`new Date(date.getFullYear(), 0, 0)`) and dividing by the number of milliseconds in a day (`86_400_000`).

```javascript
const dayOfYear = (date) =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86_400_000);

dayOfYear(new Date("2024-09-28")); // 272
```

- **Explanation**: For the date `2024-09-28`, September 28th is the 272nd day of the year.
  
### 2. **Week of the Year**

To calculate the **week of the year**, you need to find the first day of the year (January 1st) and adjust it to the first full week. You then calculate the difference in time between the given date and the first week, dividing by the number of milliseconds in a week (`604_800_000`).

```javascript
const weekOfYear = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  startOfYear.setDate(startOfYear.getDate() + (startOfYear.getDay() % 7)); // Adjust to first full week
  return Math.round((date - startOfYear) / 604_800_000); // Divide by milliseconds in a week
};

weekOfYear(new Date("2021-06-18")); // 23
```

- **Explanation**: For `2021-06-18`, the date falls in the 23rd week of the year.

### 3. **Month of the Year**

The **month of the year** is simply the month index of the given date. JavaScript's `getMonth()` method returns a 0-based month index, so you need to add 1 to convert it to a 1-based month number.

```javascript
const monthOfYear = (date) => date.getMonth() + 1;

monthOfYear(new Date("2024-09-28")); // 9
```

- **Explanation**: For `2024-09-28`, the month is September, which is the 9th month of the year.

### 4. **Quarter of the Year**

The **quarter of the year** is calculated by dividing the month number by 3 and using `Math.ceil()` to round it up to the next whole number. This works because there are 3 months per quarter.

```javascript
const quarterOfYear = (date) => Math.ceil((date.getMonth() + 1) / 3);

quarterOfYear(new Date("2024-09-28")); // 3
```

- **Explanation**: For `2024-09-28`, September falls in the 3rd quarter of the year.

---

### Summary of Results:

- **Day of the Year**: `272` (for `2024-09-28`)
- **Week of the Year**: `23` (for `2021-06-18`)
- **Month of the Year**: `9` (for `2024-09-28`)
- **Quarter of the Year**: `3` (for `2024-09-28`)

### Edge Case Considerations:
1. **Day of the Year**: The function works well even for leap years. For example, in a leap year, the 366th day would be December 31st.
   
2. **Week of the Year**: Your method works well, but make sure that when calculating the first full week, you’re considering the regional variations of how the week is determined. Some locales consider the first week of the year to be the one with the first Thursday (ISO week date system).

3. **Month and Quarter**: Both of these calculations are straightforward and do not require additional logic for edge cases.

If you have more questions or need further improvements, feel free to ask!