Date-related questions are **very common in JavaScript/React interviews** because they test:

```text
✅ Date Object
✅ Date Math
✅ Timezones
✅ Difference Between Dates
✅ Formatting
✅ Real-world Scenarios
```

***

# 1. Find Difference Between Two Dates

### Interview Question

```text
Calculate number of days between two dates
```

### Solution

```javascript
function getDaysDifference(
  startDate,
  endDate
) {

  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  const diff =
    end - start;

  return Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );
}

console.log(
  getDaysDifference(
    "2026-07-01",
    "2026-07-10"
  )
);
```

Output:

```text
9
```

***

# 2. Calculate Age from DOB

### Interview Question

```text
Find age from birth date
```

```javascript
function calculateAge(dob) {

  const birthDate =
    new Date(dob);

  const today =
    new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDiff =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 &&
      today.getDate() <
      birthDate.getDate())
  ) {

    age--;
  }

  return age;
}

console.log(
  calculateAge(
    "1990-01-15"
  )
);
```

***

# 3. Check Leap Year

```javascript
function isLeapYear(year) {

  return (
    (year % 4 === 0 &&
      year % 100 !== 0) ||
    year % 400 === 0
  );
}

console.log(
  isLeapYear(2024)
);
```

Output:

```text
true
```

***

# 4. Add N Days to Date

```javascript
function addDays(
  date,
  days
) {

  const result =
    new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;
}

console.log(
  addDays(
    "2026-07-03",
    30
  )
);
```

***

# 5. Find Last Day of Month

```javascript
function lastDayOfMonth(
  year,
  month
) {

  return new Date(
    year,
    month,
    0
  ).getDate();
}

console.log(
  lastDayOfMonth(
    2026,
    2
  )
);
```

Output:

```text
28
```

***

# 6. Business Days Calculation

### Real Scenario

```text
Leave Management System
```

Calculate weekdays only.

```javascript
function businessDays(
  start,
  end
) {

  let count = 0;

  let current =
    new Date(start);

  while (current <= new Date(end)) {

    const day =
      current.getDay();

    if (
      day !== 0 &&
      day !== 6
    ) {

      count++;
    }

    current.setDate(
      current.getDate() + 1
    );
  }

  return count;
}

console.log(
  businessDays(
    "2026-07-01",
    "2026-07-10"
  )
);
```

***

# 7. Countdown Timer

```javascript
function getRemainingDays(
  targetDate
) {

  const today =
    new Date();

  const target =
    new Date(targetDate);

  const diff =
    target - today;

  return Math.ceil(
    diff /
      (1000 * 60 * 60 * 24)
  );
}
```

Use Cases:

```text
Offer Expiry
Event Registration
Subscription Renewal
```

***

# 8. Sort Dates

```javascript
const dates = [
  "2026-01-10",
  "2026-07-03",
  "2025-12-25"
];

dates.sort(
  (a, b) =>
    new Date(a) -
    new Date(b)
);

console.log(dates);
```

***

# 9. Check if Date is Weekend

```javascript
function isWeekend(date) {

  const day =
    new Date(date).getDay();

  return (
    day === 0 ||
    day === 6
  );
}

console.log(
  isWeekend(
    "2026-07-04"
  )
);
```

Output:

```text
true
```

***

# 10. Meeting Duration

### Real Enterprise Scenario

```javascript
function getDuration(
  start,
  end
) {

  const diff =
    new Date(end) -
    new Date(start);

  return diff /
    (1000 * 60);

}

console.log(
  getDuration(
    "2026-07-03T10:00:00",
    "2026-07-03T11:30:00"
  )
);
```

Output:

```text
90
```

***

# 11. Group Records by Month

```javascript
const transactions = [
  {
    amount: 100,
    date: "2026-01-10"
  },
  {
    amount: 200,
    date: "2026-01-25"
  },
  {
    amount: 300,
    date: "2026-02-15"
  }
];

const grouped =
  transactions.reduce(
    (acc, item) => {

      const month =
        new Date(
          item.date
        ).getMonth() + 1;

      acc[month] =
        acc[month] || [];

      acc[month].push(item);

      return acc;

    },
    {}
  );

console.log(grouped);
```

***

# 12. Calculate Subscription Expiry

### Real Interview Scenario

```javascript
function getExpiryDate(
  startDate,
  months
) {

  const expiry =
    new Date(startDate);

  expiry.setMonth(
    expiry.getMonth() + months
  );

  return expiry;
}

console.log(
  getExpiryDate(
    "2026-07-03",
    6
  )
);
```

***

# Senior Frontend Interview Scenarios

### Employee Experience

```text
Calculate Years of Experience
```

```javascript
function yearsOfExperience(
  joiningDate
) {

  return (
    new Date().getFullYear() -
    new Date(joiningDate).getFullYear()
  );
}
```

***

### Remaining Leave Days

```javascript
Total Leaves
-
Used Leaves
=
Remaining Leaves
```

***

### Timesheet

```text
Total Working Hours
```

```javascript
endTime - startTime
```

***

### Invoice Due Date

```text
Invoice Date + 30 Days
```

***

### SLA Breach

```text
Ticket Creation Date
+
Expected Resolution Time
```

***

# Must-Know Date APIs

```javascript
new Date()

getDate()
getDay()
getMonth()
getFullYear()

setDate()
setMonth()
setFullYear()

Date.now()

toISOString()

toLocaleDateString()
```

***

# Senior React Interview Answer

Most frequently asked date-related coding questions:

```text
✅ Age Calculation

✅ Days Between Dates

✅ Add/Subtract Days

✅ Business Days

✅ Meeting Duration

✅ Countdown Timer

✅ Sort Dates

✅ Group by Month

✅ Subscription Expiry

✅ SLA/Ticket Due Date

✅ Weekend Detection

✅ Leap Year Check
```

These are commonly used in HR systems, leave portals, payroll, booking systems, subscription platforms, ticketing tools, and enterprise dashboard applications.
