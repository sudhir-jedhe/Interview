Your code correctly defines several functions to calculate the difference between two dates in different units (seconds, minutes, hours, days, weekdays, weeks, months, and years). Here's a breakdown of each function and how they work:

### 1. **Date Difference in Seconds:**

```javascript
const dateDifferenceInSeconds = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 1_000;
  
dateDifferenceInSeconds(
  new Date('2020-12-24 00:00:15'),
  new Date('2020-12-24 00:00:17')
); // 2
```

- **Explanation**: This function calculates the difference between `dateFinal` and `dateInitial` in milliseconds and then divides it by `1,000` to convert it to seconds.
- **Example**: The difference between `00:00:15` and `00:00:17` is 2 seconds.

---

### 2. **Date Difference in Minutes:**

```javascript
const dateDifferenceInMinutes = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 60_000;

dateDifferenceInMinutes(
  new Date('2021-04-24 01:00:15'),
  new Date('2021-04-24 02:00:15')
); // 60
```

- **Explanation**: This function calculates the difference between `dateFinal` and `dateInitial` in milliseconds and divides it by `60,000` (which is the number of milliseconds in one minute) to get the difference in minutes.
- **Example**: The difference between `01:00:15` and `02:00:15` is 60 minutes.

---

### 3. **Date Difference in Hours:**

```javascript
const dateDifferenceInHours = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 3_600_000;
  
dateDifferenceInHours(
  new Date('2021-04-24 10:25:00'),
  new Date('2021-04-25 10:25:00')
); // 24
```

- **Explanation**: The function calculates the difference in hours by dividing the difference in milliseconds by `3,600,000` (number of milliseconds in one hour).
- **Example**: The difference between `10:25:00` on April 24th and `10:25:00` on April 25th is exactly 24 hours.

---

### 4. **Date Difference in Days:**

```javascript
const dateDifferenceInDays = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 86_400_000;
  
dateDifferenceInDays(
  new Date('2017-12-13'),
  new Date('2017-12-22')
); // 9
```

- **Explanation**: This function divides the difference in milliseconds by `86,400,000` (number of milliseconds in one day) to calculate the difference in days.
- **Example**: The difference between December 13th and December 22nd is 9 days.

---

### 5. **Date Difference in Weekdays:**

```javascript
const isWeekday = date => date.getDay() % 6 !== 0;

const addDaysToDate = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const dateDifferenceInWeekdays = (startDate, endDate) =>
  Array
    .from({ length: (endDate - startDate) / 86_400_000 })
    .filter((_, i) => isWeekday(addDaysToDate(startDate, i + 1)))
    .length;

dateDifferenceInWeekdays(
  new Date('Oct 05, 2020'),
  new Date('Oct 06, 2020')
); // 1

dateDifferenceInWeekdays(
  new Date('Oct 05, 2020'),
  new Date('Oct 14, 2020')
); // 7
```

- **Explanation**: 
  - **`isWeekday`** checks if a date is a weekday (Monday to Friday). It returns `true` for weekdays and `false` for weekends (Saturday and Sunday).
  - **`addDaysToDate`** is used to add days to a given date.
  - **`dateDifferenceInWeekdays`** generates a list of days between `startDate` and `endDate`, filters out weekends using the `isWeekday` function, and returns the count of weekdays.

- **Examples**:
  - From `October 5, 2020` to `October 6, 2020`, there is 1 weekday (`October 5, 2020`).
  - From `October 5, 2020` to `October 14, 2020`, there are 7 weekdays.

---

### 6. **Date Difference in Weeks:**

```javascript
const dateDifferenceInWeeks = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 604_800_000;

dateDifferenceInWeeks(
  new Date('2023-01-01'),
  new Date('2023-01-08')
); // 1
```

- **Explanation**: This function calculates the difference in weeks by dividing the difference in milliseconds by `604,800,000` (number of milliseconds in one week).
- **Example**: The difference between `January 1, 2023` and `January 8, 2023` is exactly 1 week.

---

### 7. **Date Difference in Months:**

```javascript
const dateDifferenceInMonths = (dateInitial, dateFinal) =>
  Math.max(
    (dateFinal.getFullYear() - dateInitial.getFullYear()) * 12 +
      dateFinal.getMonth() - dateInitial.getMonth(),
    0
  );

dateDifferenceInMonths(
  new Date('2017-12-13'),
  new Date('2018-04-29')
); // 4
```

- **Explanation**: This function calculates the difference in months by computing the year difference (converted to months) and adding the month difference. It returns a minimum of `0` to prevent negative results.
- **Example**: The difference between `December 13, 2017` and `April 29, 2018` is 4 months.

---

### 8. **Date Difference in Years:**

```javascript
const dateDifferenceInYears = (dateInitial, dateFinal) =>
  dateDifferenceInMonths(dateInitial, dateFinal) / 12;

dateDifferenceInYears(
  new Date('2017-12-13'),
  new Date('2019-12-15')
); // 2
```

- **Explanation**: This function divides the difference in months by 12 to get the difference in years.
- **Example**: The difference between `December 13, 2017` and `December 15, 2019` is approximately 2 years.

---

### Conclusion:

Your functions are well-structured and use straightforward date manipulation techniques in JavaScript. They handle a wide range of date differences, from seconds to years. These kinds of utility functions are quite useful for date calculations, especially in scheduling or time tracking applications.

Let me know if you'd like any additional explanations or improvements!