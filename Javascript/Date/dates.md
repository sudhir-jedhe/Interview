# JavaScript Date Object – Complete Interview Guide

Date questions are extremely common in JavaScript interviews:

✅ Age Calculator  
✅ Difference Between Dates  
✅ Add/Subtract Days  
✅ Countdown Timer  
✅ Format Dates  
✅ Time Zone Handling  
✅ Business Days Calculation

***

# Creating Dates

```javascript
const now = new Date();

console.log(now);
```

***

## Specific Date

```javascript
const birthday = new Date(
  "1990-05-15"
);

console.log(birthday);
```

***

## Using Constructor

```javascript
const date = new Date(
  2026,
  6,
  3,
  10,
  30,
  20
);
```

Output:

```text
03 July 2026 10:30:20
```

***

# Important Date Methods

## Get Full Year

```javascript
const date = new Date();

console.log(
  date.getFullYear()
);
```

Output:

```javascript
2026
```

***

## Get Month

```javascript
date.getMonth();
```

Output:

```javascript
6
```

### Note

```javascript
0 = January
11 = December
```

***

## Get Date

```javascript
date.getDate();
```

Output:

```javascript
3
```

***

## Get Day

```javascript
date.getDay();
```

Output:

```javascript
5
```

Meaning:

```text
0 Sunday
1 Monday
...
6 Saturday
```

***

## Hours

```javascript
date.getHours();
```

***

## Minutes

```javascript
date.getMinutes();
```

***

## Seconds

```javascript
date.getSeconds();
```

***

## Milliseconds

```javascript
date.getMilliseconds();
```

***

# Set Methods

## Add Days

```javascript
const date = new Date();

date.setDate(
  date.getDate() + 7
);
```

***

## Add Month

```javascript
date.setMonth(
  date.getMonth() + 1
);
```

***

## Add Year

```javascript
date.setFullYear(
  date.getFullYear() + 1
);
```

***

## Add Hours

```javascript
date.setHours(
  date.getHours() + 5
);
```

***

# Age Calculator (Most Popular Interview Question)

## Calculate Exact Age

```javascript
function calculateAge(
  birthDate
) {
  const today =
    new Date();

  const dob =
    new Date(
      birthDate
    );

  let age =
    today.getFullYear() -
    dob.getFullYear();

  const monthDiff =
    today.getMonth() -
    dob.getMonth();

  if (
    monthDiff < 0 ||
    (
      monthDiff === 0 &&
      today.getDate() <
        dob.getDate()
    )
  ) {
    age--;
  }

  return age;
}

console.log(
  calculateAge(
    "1990-05-15"
  )
);
```

Output:

```javascript
36
```

***

# Exact Age (Years, Months, Days)

```javascript
function getAge(
  dob
) {
  const birth =
    new Date(dob);

  const today =
    new Date();

  let years =
    today.getFullYear() -
    birth.getFullYear();

  let months =
    today.getMonth() -
    birth.getMonth();

  let days =
    today.getDate() -
    birth.getDate();

  if (days < 0) {
    months--;

    days += 30;
  }

  if (months < 0) {
    years--;

    months += 12;
  }

  return {
    years,
    months,
    days
  };
}

console.log(
  getAge(
    "1990-05-15"
  )
);
```

Output:

```javascript
{
  years: 36,
  months: 1,
  days: 18
}
```

***

# Difference Between Two Dates

```javascript
const start =
  new Date(
    "2025-01-01"
  );

const end =
  new Date(
    "2025-01-10"
  );

const diff =
  end - start;

const days =
  diff /
  (
    1000 *
    60 *
    60 *
    24
  );

console.log(days);
```

Output:

```javascript
9
```

***

# Date to Timestamp

```javascript
const date =
  new Date();

console.log(
  date.getTime()
);
```

Output:

```javascript
1751520000000
```

***

# Current Timestamp

```javascript
Date.now();
```

***

# Countdown Timer Interview

```javascript
const target =
  new Date(
    "2027-01-01"
  );

setInterval(
  () => {
    const now =
      new Date();

    const diff =
      target - now;

    const days =
      Math.floor(
        diff /
        (
          1000 *
          60 *
          60 *
          24
        )
      );

    console.log(days);
  },
  1000
);
```

***

# Format Date

## DD/MM/YYYY

```javascript
const date =
  new Date();

const formatted =
  `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

console.log(
  formatted
);
```

***

# Using Intl API

```javascript
const date =
  new Date();

console.log(
  new Intl.DateTimeFormat(
    "en-GB"
  ).format(date)
);
```

Output:

```text
03/07/2026
```

***

# Last Day of Month

```javascript
const lastDay =
  new Date(
    2026,
    7,
    0
  );

console.log(
  lastDay.getDate()
);
```

Output:

```javascript
31
```

***

# First Day of Month

```javascript
const firstDay =
  new Date(
    2026,
    6,
    1
  );
```

***

# Check Leap Year

```javascript
function isLeapYear(
  year
) {
  return (
    (
      year % 4 === 0 &&
      year % 100 !== 0
    ) ||
    year % 400 === 0
  );
}

console.log(
  isLeapYear(
    2024
  )
);
```

Output:

```javascript
true
```

***

# Convert Seconds → HH:MM:SS

```javascript
function formatTime(
  totalSeconds
) {
  const hours =
    Math.floor(
      totalSeconds /
      3600
    );

  const minutes =
    Math.floor(
      (
        totalSeconds %
        3600
      ) / 60
    );

  const seconds =
    totalSeconds %
    60;

  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

console.log(
  formatTime(3665)
);
```

Output:

```text
01:01:05
```

***

# Business Days Calculation

```javascript
function workingDays(
  start,
  end
) {
  let count = 0;

  const current =
    new Date(start);

  while (
    current <= end
  ) {
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
```

***

# Frequently Asked Interview Questions

### Get Current Year

```javascript
new Date().getFullYear();
```

### Current Month

```javascript
new Date().getMonth();
```

### Add 30 Days

```javascript
date.setDate(
  date.getDate() + 30
);
```

### Difference Between Dates

```javascript
date2 - date1
```

### Current Timestamp

```javascript
Date.now();
```

### Age Calculator

```javascript
today.getFullYear() -
dob.getFullYear()
```

(with birthday validation)

***

# Senior Frontend Interview Answer

The most important Date APIs to know are:

```javascript
new Date()

getFullYear()
getMonth()
getDate()
getDay()

getHours()
getMinutes()
getSeconds()

setDate()
setMonth()
setFullYear()

Date.now()
getTime()
```

Common interview scenarios include:

✅ Age Calculator  
✅ Date Difference  
✅ Countdown Timer  
✅ Add/Subtract Days  
✅ Leap Year Detection  
✅ Business Days Calculation  
✅ Date Formatting  
✅ Timestamp Conversion  
✅ Relative Time (hours/minutes/seconds) calculations

These cover nearly all JavaScript Date questions asked in frontend interviews.


# Formatting Dates in Different Locales (JavaScript)

The best modern way is using **`Intl.DateTimeFormat`**.

```javascript
const date = new Date("2026-07-03T10:30:00");
```

***

# 1. UK Format (`en-GB`)

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-GB"
  ).format(date)
);
```

Output:

```text
03/07/2026
```

Format:

```text
DD/MM/YYYY
```

***

# 2. US Format (`en-US`)

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-US"
  ).format(date)
);
```

Output:

```text
7/3/2026
```

Format:

```text
MM/DD/YYYY
```

***

# 3. India Format (`en-IN`)

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-IN"
  ).format(date)
);
```

Output:

```text
03/07/2026
```

***

# 4. German Format (`de-DE`)

```javascript
console.log(
  new Intl.DateTimeFormat(
    "de-DE"
  ).format(date)
);
```

Output:

```text
03.07.2026
```

***

# 5. French Format (`fr-FR`)

```javascript
console.log(
  new Intl.DateTimeFormat(
    "fr-FR"
  ).format(date)
);
```

Output:

```text
03/07/2026
```

***

# 6. Japanese Format (`ja-JP`)

```javascript
console.log(
  new Intl.DateTimeFormat(
    "ja-JP"
  ).format(date)
);
```

Output:

```text
2026/07/03
```

***

# 7. Arabic Format (`ar-SA`)

```javascript
console.log(
  new Intl.DateTimeFormat(
    "ar-SA"
  ).format(date)
);
```

Output:

```text
١٢/٠١/١٤٤٨ هـ
```

May use the Islamic calendar depending on locale.

***

# Long Date Format

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "full"
    }
  ).format(date)
);
```

Output:

```text
Friday, 3 July 2026
```

***

# Short / Medium / Long Styles

```javascript
const options = {
  dateStyle: "short"
};
```

Output:

```text
03/07/26
```

***

```javascript
const options = {
  dateStyle: "medium"
};
```

Output:

```text
3 Jul 2026
```

***

```javascript
const options = {
  dateStyle: "long"
};
```

Output:

```text
3 July 2026
```

***

```javascript
const options = {
  dateStyle: "full"
};
```

Output:

```text
Friday, 3 July 2026
```

***

# Date and Time Together

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "full",
      timeStyle: "medium"
    }
  ).format(date)
);
```

Output:

```text
Friday, 3 July 2026 at 10:30:00
```

***

# Timezone Formatting

## India

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-IN",
    {
      timeZone:
        "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short"
    }
  ).format(date)
);
```

***

## London

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/London",
      dateStyle: "full",
      timeStyle: "short"
    }
  ).format(date)
);
```

***

## New York

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",
      dateStyle: "full",
      timeStyle: "short"
    }
  ).format(date)
);
```

***

# Format Currency + Date (Common React Dashboard Scenario)

```javascript
const orderDate =
  new Date();

const formattedDate =
  new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium"
    }
  ).format(orderDate);

console.log(formattedDate);
```

Output:

```text
3 Jul 2026
```

***

# React Example

```jsx
function UserProfile() {
  const today =
    new Date();

  const formattedDate =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        dateStyle: "full"
      }
    ).format(today);

  return (
    <h2>
      {formattedDate}
    </h2>
  );
}
```

Output:

```text
Friday, 3 July 2026
```

***

# Relative Time ("5 minutes ago")

```javascript
const rtf =
  new Intl.RelativeTimeFormat(
    "en",
    {
      numeric: "auto"
    }
  );

console.log(
  rtf.format(
    -5,
    "minute"
  )
);
```

Output:

```text
5 minutes ago
```

***

# Most Common Date Interview Formats

```javascript
DD/MM/YYYY
```

```javascript
new Intl.DateTimeFormat("en-GB")
```

***

```javascript
MM/DD/YYYY
```

```javascript
new Intl.DateTimeFormat("en-US")
```

***

```javascript
YYYY-MM-DD
```

```javascript
date.toISOString()
  .split("T")[0];
```

***

# Senior Interview Answer

For modern applications, always prefer:

```javascript
Intl.DateTimeFormat()
```

because it:

✅ Supports all locales

✅ Handles time zones

✅ Supports internationalisation (i18n)

✅ Avoids manual formatting bugs

✅ Works perfectly in React dashboards, enterprise apps, and global products

```javascript
new Intl.DateTimeFormat(
  "en-GB",
  {
    dateStyle: "full",
    timeStyle: "short"
  }
).format(new Date());
```

This is the preferred production-grade solution over manually concatenating `getDate()`, `getMonth()`, and `getFullYear()`.


# Date Formatting with Time Zones in JavaScript

One of the most important interview topics is:

```text
Store Time → UTC
Display Time → User's Time Zone
```

Modern JavaScript uses:

```javascript
Intl.DateTimeFormat()
```

***

# Sample Date

```javascript
const date = new Date(
  "2026-07-03T12:00:00Z"
);
```

The `Z` means:

```text
UTC Time
```

***

# 1. Format for India (IST)

```javascript
const formatted =
  new Intl.DateTimeFormat(
    "en-IN",
    {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(date);

console.log(formatted);
```

Output:

```text
Friday, 3 July 2026 at 5:30:00 pm IST
```

***

# 2. Format for London

```javascript
const formatted =
  new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Europe/London",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(date);

console.log(formatted);
```

Output:

```text
Friday, 3 July 2026 at 13:00:00 BST
```

***

# 3. Format for New York

```javascript
const formatted =
  new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(date);

console.log(formatted);
```

Output:

```text
Friday, July 3, 2026 at 8:00:00 AM EDT
```

***

# 4. Format for Tokyo

```javascript
const formatted =
  new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(date);

console.log(formatted);
```

Output:

```text
2026年7月3日金曜日 21:00:00 JST
```

***

# 5. Show Timezone Name

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",
      timeZoneName: "long"
    }
  ).format(date)
);
```

Output:

```text
Eastern Daylight Time
```

***

# 6. Show Only Time

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-IN",
    {
      timeZone:
        "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  ).format(date)
);
```

Output:

```text
05:30:00 PM
```

***

# 7. Show Only Date

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/London",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  ).format(date)
);
```

Output:

```text
3 July 2026
```

***

# 8. User's Local Time Zone

Get current browser timezone.

```javascript
const timezone =
  Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone;

console.log(timezone);
```

Output:

```text
Asia/Kolkata
```

***

# React Example

```jsx
function MeetingTime() {
  const date = new Date(
    "2026-07-03T12:00:00Z"
  );

  const localTime =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        timeZone:
          Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone,
        dateStyle: "full",
        timeStyle: "short"
      }
    ).format(date);

  return (
    <h3>
      {localTime}
    </h3>
  );
}
```

***

# Real Interview Scenario

### Meeting Stored in UTC

```javascript
"2026-07-03T12:00:00Z"
```

Display for different users:

| User     | Timezone          | Display |
| -------- | ----------------- | ------- |
| Pune     | Asia/Kolkata      | 5:30 PM |
| London   | Europe/London     | 1:00 PM |
| New York | America/New\_York | 8:00 AM |
| Tokyo    | Asia/Tokyo        | 9:00 PM |

No manual calculations required.

***

# Convert Date to Another Time Zone

```javascript
function formatDate(
  date,
  timezone
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: timezone,
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(date);
}

console.log(
  formatDate(
    new Date(),
    "Asia/Kolkata"
  )
);

console.log(
  formatDate(
    new Date(),
    "Europe/London"
  )
);

console.log(
  formatDate(
    new Date(),
    "America/New_York"
  )
);
```

***

# Common Time Zones

```javascript
Asia/Kolkata
Europe/London
America/New_York
America/Chicago
America/Los_Angeles
Asia/Tokyo
Asia/Singapore
Australia/Sydney
UTC
```

***

# Senior Frontend Interview Answer

```javascript
new Intl.DateTimeFormat(
  locale,
  {
    timeZone,
    dateStyle: "full",
    timeStyle: "short"
  }
).format(date);
```

Use `Intl.DateTimeFormat` with the `timeZone` option rather than manually adding or subtracting hours. This automatically handles:

✅ Daylight Saving Time (DST)

✅ Locale-specific formats

✅ Timezone abbreviations

✅ Internationalisation (i18n)

✅ UTC ↔ Local conversions

This is the production-grade approach used in React dashboards, booking systems, calendar applications, and global enterprise products.


# How to Convert Dates Between Time Zones in JavaScript

A common interview question is:

> "I have a UTC date. How do I show it in IST, EST, London time, etc.?"

***

# Important Concept

JavaScript `Date` internally stores time as a **UTC timestamp**.

```javascript
const date = new Date(
  "2026-07-03T12:00:00Z"
);
```

This represents:

```text
3 July 2026
12:00 PM UTC
```

The timestamp never changes.

What changes is **how it's displayed**.

***

# 1. UTC → IST (India)

```javascript
const utcDate = new Date(
  "2026-07-03T12:00:00Z"
);

const indiaTime =
  new Intl.DateTimeFormat(
    "en-IN",
    {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(utcDate);

console.log(indiaTime);
```

Output:

```text
Friday, 3 July 2026 at 5:30:00 pm IST
```

***

# 2. UTC → New York

```javascript
const newYorkTime =
  new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(utcDate);

console.log(newYorkTime);
```

Output:

```text
Friday, July 3, 2026 at 8:00:00 AM EDT
```

***

# 3. UTC → London

```javascript
const londonTime =
  new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/London",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(utcDate);

console.log(londonTime);
```

Output:

```text
Friday, 3 July 2026 at 1:00:00 BST
```

***

# Generic Utility Function

```javascript
function convertTimeZone(
  date,
  locale,
  timeZone
) {
  return new Intl.DateTimeFormat(
    locale,
    {
      timeZone,
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(date);
}

const utcDate = new Date(
  "2026-07-03T12:00:00Z"
);

console.log(
  convertTimeZone(
    utcDate,
    "en-IN",
    "Asia/Kolkata"
  )
);

console.log(
  convertTimeZone(
    utcDate,
    "en-US",
    "America/New_York"
  )
);

console.log(
  convertTimeZone(
    utcDate,
    "en-GB",
    "Europe/London"
  )
);
```

***

# Interview Scenario: Meeting Scheduler

### Stored in Database

```javascript
"2026-07-03T12:00:00Z"
```

### Display per User

| User Location | Time Zone         | Display Time |
| ------------- | ----------------- | ------------ |
| Pune          | Asia/Kolkata      | 5:30 PM      |
| London        | Europe/London     | 1:00 PM      |
| New York      | America/New\_York | 8:00 AM      |
| Tokyo         | Asia/Tokyo        | 9:00 PM      |

Same UTC time, different display.

***

# Get User's Current Time Zone

```javascript
const userTimeZone =
  Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone;

console.log(userTimeZone);
```

Output:

```text
Asia/Kolkata
```

***

# Convert Local Time to UTC

### Example

User enters:

```text
3 Jul 2026
5:30 PM IST
```

Create date:

```javascript
const localDate =
  new Date(
    "2026-07-03T17:30:00"
  );
```

Convert to UTC:

```javascript
console.log(
  localDate.toISOString()
);
```

Output:

```text
2026-07-03T12:00:00.000Z
```

***

# UTC ↔ Local Conversion Cheatsheet

### UTC String

```javascript
date.toISOString()
```

Output:

```text
2026-07-03T12:00:00.000Z
```

***

### Local String

```javascript
date.toLocaleString()
```

***

### Specific Timezone

```javascript
date.toLocaleString(
  "en-US",
  {
    timeZone:
      "America/New_York"
  }
);
```

***

# React Example

```jsx
function MeetingTime({
  meetingDate
}) {
  const userTime =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        timeZone:
          Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone,
        dateStyle: "full",
        timeStyle: "short"
      }
    ).format(
      new Date(meetingDate)
    );

  return (
    <h3>
      {userTime}
    </h3>
  );
}

export default function App() {
  return (
    <MeetingTime
      meetingDate="2026-07-03T12:00:00Z"
    />
  );
}
```

***

# Common Interview Questions

### Current UTC Time

```javascript
new Date().toISOString();
```

***

### User Time Zone

```javascript
Intl.DateTimeFormat()
  .resolvedOptions()
  .timeZone;
```

***

### Format Date for Time Zone

```javascript
new Intl.DateTimeFormat(
  "en-US",
  {
    timeZone:
      "America/New_York"
  }
).format(date);
```

***

### UTC → IST

```javascript
new Intl.DateTimeFormat(
  "en-IN",
  {
    timeZone:
      "Asia/Kolkata"
  }
).format(date);
```

***

# Senior Interview Answer

> Never manually add or subtract hours to convert time zones. Store dates in UTC (typically via `toISOString()`), then use `Intl.DateTimeFormat` with the `timeZone` option to display dates in the user's locale. This automatically handles daylight saving time (DST), time-zone offsets, internationalisation, and regional formatting, making it the production-ready approach used in React applications, booking systems, dashboards, and calendar products.


# Handling Daylight Saving Time (DST) Correctly in JavaScript

This is a favourite **Senior Frontend / React interview question**.

## ❌ Wrong Approach

Many developers manually add hours:

```javascript
// WRONG
const date = new Date("2026-06-01T12:00:00Z");

const newYorkTime = new Date(
  date.getTime() - (4 * 60 * 60 * 1000)
);
```

Problem:

```text
New York is NOT always UTC-4

Summer  -> UTC-4 (EDT)
Winter  -> UTC-5 (EST)
```

Your code breaks when DST changes.

***

# What is DST?

Some countries move clocks:

## Summer

```text
New York

UTC - 4
(EDT)
```

## Winter

```text
New York

UTC - 5
(EST)
```

Example:

```text
March
Clock moves forward

November
Clock moves backward
```

***

# Correct Approach

Always use:

```javascript
Intl.DateTimeFormat
```

with:

```javascript
timeZone
```

***

# Example

UTC Time:

```javascript
const meeting =
  new Date(
    "2026-06-01T12:00:00Z"
  );
```

Show in New York:

```javascript
console.log(
  new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",
      dateStyle: "full",
      timeStyle: "long"
    }
  ).format(meeting)
);
```

Output:

```text
Monday, June 1, 2026 at 8:00:00 AM EDT
```

***

# Winter Example

```javascript
const meeting =
  new Date(
    "2026-12-01T12:00:00Z"
  );
```

Output:

```text
Tuesday, December 1, 2026 at 7:00:00 AM EST
```

Notice:

```text
June     → EDT → UTC-4

December → EST → UTC-5
```

JavaScript handles it automatically.

***

# Common Interview Question

## Meeting Scheduler

Store:

```javascript
2026-07-03T12:00:00Z
```

Database always stores:

```text
UTC
```

Then display:

```javascript
new Intl.DateTimeFormat(
  "en-US",
  {
    timeZone:
      "America/New_York"
  }
)
```

or

```javascript
new Intl.DateTimeFormat(
  "en-GB",
  {
    timeZone:
      "Europe/London"
  }
)
```

or

```javascript
new Intl.DateTimeFormat(
  "en-IN",
  {
    timeZone:
      "Asia/Kolkata"
  }
)
```

***

# DST Edge Case

Suppose DST starts.

```text
2:00 AM
↓
3:00 AM
```

Time:

```text
2:30 AM
```

never exists on that day.

If you manually subtract hours:

```javascript
date - 4 hours
```

you can create invalid business logic.

Using:

```javascript
Intl.DateTimeFormat
```

avoids this problem.

***

# React Example

```jsx
function MeetingTime({
  utcDate
}) {
  const localTime =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "America/New_York",
        dateStyle: "full",
        timeStyle: "short"
      }
    ).format(
      new Date(utcDate)
    );

  return (
    <div>
      {localTime}
    </div>
  );
}

export default function App() {
  return (
    <MeetingTime
      utcDate="2026-06-01T12:00:00Z"
    />
  );
}
```

***

# Detect User Time Zone

```javascript
const timezone =
  Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone;

console.log(timezone);
```

Example:

```text
Asia/Kolkata

America/New_York

Europe/London
```

***

# Production Pattern

### Store

```javascript
date.toISOString()
```

Example:

```text
2026-07-03T12:00:00.000Z
```

***

### Save to API

```javascript
UTC ONLY
```

***

### Display

```javascript
Intl.DateTimeFormat(
  locale,
  {
    timeZone:
      userTimeZone
  }
)
```

***

# Interview Answer

> Never manually add or subtract timezone offsets because daylight saving rules change throughout the year and differ by region. Store all timestamps in UTC using `toISOString()` and convert them for display using `Intl.DateTimeFormat` with an IANA timezone identifier such as `America/New_York` or `Europe/London`. This automatically handles DST transitions, timezone offsets, locale formatting, and future timezone rule changes.


# React Component for Automatic DST Handling

✅ Stores dates in UTC  
✅ Automatically converts to user's timezone  
✅ Handles Daylight Saving Time (DST) correctly  
✅ Uses production-ready `Intl.DateTimeFormat`

***

## Simple DST-Safe React Component

```jsx
import React from "react";

function MeetingTime({ utcDate }) {
  const userTimeZone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone;

  const formattedDate =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: userTimeZone,
        dateStyle: "full",
        timeStyle: "long"
      }
    ).format(new Date(utcDate));

  return (
    <div>
      <h2>Meeting Time</h2>

      <p>
        {formattedDate}
      </p>

      <p>
        Time Zone:
        {" "}
        {userTimeZone}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <MeetingTime
      utcDate="2026-07-03T12:00:00Z"
    />
  );
}
```

***

# Advanced Version (Show Multiple Time Zones)

Useful for:

✅ Calendar Apps

✅ Teams Scheduling

✅ Global Dashboards

✅ Booking Systems

```jsx
import React from "react";

const TIME_ZONES = [
  {
    city: "India",
    zone: "Asia/Kolkata"
  },
  {
    city: "London",
    zone: "Europe/London"
  },
  {
    city: "New York",
    zone: "America/New_York"
  },
  {
    city: "Tokyo",
    zone: "Asia/Tokyo"
  }
];

export default function TimeZones() {
  const utcDate =
    "2026-07-03T12:00:00Z";

  return (
    <div>
      <h2>
        Global Meeting Time
      </h2>

      {TIME_ZONES.map(
        ({ city, zone }) => (
          <div
            key={zone}
          >
            <strong>
              {city}
            </strong>

            <p>
              {
                new Intl.DateTimeFormat(
                  "en-US",
                  {
                    timeZone:
                      zone,
                    dateStyle:
                      "full",
                    timeStyle:
                      "long"
                  }
                ).format(
                  new Date(
                    utcDate
                  )
                )
              }
            </p>
          </div>
        )
      )}
    </div>
  );
}
```

***

# Live Clock with Automatic DST

```jsx
import React, {
  useState,
  useEffect
} from "react";

export default function LiveClock() {
  const [now, setNow] =
    useState(new Date());

  useEffect(() => {
    const timer =
      setInterval(() => {
        setNow(
          new Date()
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone;

  return (
    <div>
      <h2>
        Current Time
      </h2>

      <p>
        {
          new Intl.DateTimeFormat(
            "en-US",
            {
              timeZone:
                timezone,
              dateStyle:
                "full",
              timeStyle:
                "medium"
            }
          ).format(now)
        }
      </p>

      <p>
        Timezone:
        {" "}
        {timezone}
      </p>
    </div>
  );
}
```

***

# Interview Question

### Why Not This?

```javascript
const newYork =
  date.getTime() -
  5 * 60 * 60 * 1000;
```

❌ Wrong

Because:

```text
New York
Winter = UTC -5

Summer = UTC -4
```

DST changes automatically.

***

# Correct Production Solution

```javascript
new Intl.DateTimeFormat(
  "en-US",
  {
    timeZone:
      "America/New_York",
    dateStyle: "full",
    timeStyle: "long"
  }
).format(date);
```

✅ Handles DST

✅ Handles changing timezone rules

✅ Handles locale formatting

✅ Works globally

***

# Senior React Interview Answer

> In production React applications, dates should always be stored in UTC (`toISOString()`) and rendered using `Intl.DateTimeFormat` with an IANA timezone such as `America/New_York` or `Europe/London`. This automatically handles daylight saving time transitions, locale-specific formatting, and future timezone rule changes. Manual timezone calculations using fixed hour offsets should be avoided because they fail during DST changes.



# JavaScript Date Interview Questions & Scenarios (Top 25)

These are the most commonly asked **Frontend / React / JavaScript interview questions** around Date.

***

# 1. Age Calculator

### Question

Calculate age from DOB.

```javascript
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDiff =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (
      monthDiff === 0 &&
      today.getDate() <
        birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}
```

***

# 2. Exact Age (Years Months Days)

```javascript
{
  years: 35,
  months: 4,
  days: 18
}
```

Frequently asked in interviews.

***

# 3. Difference Between Two Dates

```javascript
const start =
  new Date("2026-01-01");

const end =
  new Date("2026-01-10");

const diffDays =
  (end - start) /
  (1000 * 60 * 60 * 24);

console.log(diffDays);
```

Output:

```javascript
9
```

***

# 4. Add Days

```javascript
const date = new Date();

date.setDate(
  date.getDate() + 30
);
```

***

# 5. Subtract Days

```javascript
date.setDate(
  date.getDate() - 30
);
```

***

# 6. Add Hours

```javascript
date.setHours(
  date.getHours() + 5
);
```

***

# 7. Add Minutes

```javascript
date.setMinutes(
  date.getMinutes() + 15
);
```

***

# 8. Add Seconds

```javascript
date.setSeconds(
  date.getSeconds() + 45
);
```

***

# 9. Countdown Timer

```javascript
const target =
  new Date("2027-01-01");

const diff =
  target - new Date();
```

Used in:

```text
Offer Countdown
Exam App
Auction App
```

***

# 10. Format Date

```javascript
new Intl.DateTimeFormat(
  "en-GB"
).format(new Date());
```

Output:

```text
03/07/2026
```

***

# 11. Format Different Locales

```javascript
en-US
```

```text
07/03/2026
```

```javascript
en-GB
```

```text
03/07/2026
```

```javascript
de-DE
```

```text
03.07.2026
```

***

# 12. Timezone Conversion

```javascript
new Intl.DateTimeFormat(
  "en-US",
  {
    timeZone:
      "America/New_York"
  }
)
```

Interview favourite.

***

# 13. DST Handling

Question:

```text
How do you handle daylight saving time?
```

Answer:

```javascript
Intl.DateTimeFormat(
  locale,
  {
    timeZone
  }
)
```

Never manually add hours.

***

# 14. Last Day of Month

```javascript
const lastDay =
  new Date(2026, 7, 0);

console.log(
  lastDay.getDate()
);
```

Output:

```javascript
31
```

***

# 15. First Day of Month

```javascript
new Date(
  2026,
  6,
  1
);
```

***

# 16. Leap Year

```javascript
function isLeapYear(year) {
  return (
    (
      year % 4 === 0 &&
      year % 100 !== 0
    ) ||
    year % 400 === 0
  );
}
```

***

# 17. Day of Week

```javascript
const day =
  new Date()
    .getDay();
```

```text
0 Sunday
1 Monday
...
6 Saturday
```

***

# 18. Days Between Dates

```javascript
function daysBetween(
  date1,
  date2
) {
  return Math.ceil(
    (
      date2 - date1
    ) /
    (
      1000 *
      60 *
      60 *
      24
    )
  );
}
```

***

# 19. Business Days

Skip weekends.

```javascript
while (
  current <= end
) {
  if (
    day !== 0 &&
    day !== 6
  ) {
    count++;
  }
}
```

***

# 20. Relative Time

```javascript
const rtf =
  new Intl.RelativeTimeFormat(
    "en",
    {
      numeric: "auto"
    }
  );

rtf.format(
  -5,
  "minute"
);
```

Output:

```text
5 minutes ago
```

***

# 21. Convert Seconds to HH:MM:SS

```javascript
function formatTime(
  totalSeconds
) {
  const h =
    Math.floor(
      totalSeconds /
      3600
    );

  const m =
    Math.floor(
      (
        totalSeconds %
        3600
      ) / 60
    );

  const s =
    totalSeconds %
    60;

  return `${h}:${m}:${s}`;
}
```

***

# 22. Current Timestamp

```javascript
Date.now();
```

Output:

```javascript
1751520000000
```

***

# 23. Unix Timestamp to Date

```javascript
new Date(
  1751520000000
);
```

***

# 24. Sort Dates

```javascript
dates.sort(
  (a, b) =>
    new Date(a) -
    new Date(b)
);
```

***

# 25. React Interview Scenario

Display meeting time in user's timezone.

```jsx
function Meeting({
  utcDate
}) {
  const timezone =
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone;

  const formatted =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          timezone,
        dateStyle:
          "full",
        timeStyle:
          "short"
      }
    ).format(
      new Date(utcDate)
    );

  return (
    <p>
      {formatted}
    </p>
  );
}
```

***

# Most Asked Senior-Level Date Questions

### Easy

✅ Current Date

✅ Current Time

✅ Age Calculator

✅ Add/Subtract Days

✅ Date Difference

***

### Medium

✅ Leap Year

✅ Business Days

✅ Last Day of Month

✅ Sort Dates

✅ HH:MM:SS Conversion

***

### Advanced

✅ Timezone Conversion

✅ DST Handling

✅ Meeting Scheduler

✅ UTC Storage Strategy

✅ Relative Time Formats

✅ Calendar Applications

***

# Senior React Interview Answer

For production applications:

```text
Store Dates → UTC

Display Dates → User Time Zone

Format Dates → Intl.DateTimeFormat()

Relative Time → Intl.RelativeTimeFormat()
```

Master these APIs:

```javascript
new Date()

Date.now()

getFullYear()
getMonth()
getDate()

setDate()

toISOString()

Intl.DateTimeFormat()

Intl.RelativeTimeFormat()
```

These cover about **90% of real-world JavaScript date interview questions** asked in frontend, React, and system design interviews.


# Common Pitfalls in JavaScript Date Handling

Date handling is one of the most bug-prone areas in frontend applications.

***

# 1. Month is Zero-Based

### Problem

```javascript
const date = new Date(
  2026,
  6,
  3
);

console.log(date);
```

Output:

```text
July 3, 2026
```

Many developers expect:

```text
June
```

because:

```javascript
0 = January
1 = February
...
11 = December
```

### Fix

```javascript
const month =
  date.getMonth() + 1;
```

***

# 2. Invalid Date Parsing

### Problem

```javascript
new Date("03/07/2026");
```

Can mean:

```text
03 July 2026
```

or

```text
March 07 2026
```

depending on browser/locale.

### Better

```javascript
new Date("2026-07-03");
```

ISO format.

***

# 3. Manual Timezone Calculations

❌ Avoid

```javascript
date.setHours(
  date.getHours() + 5
);
```

Problems:

* DST
* Different timezone rules
* Future timezone changes

✅ Prefer

```javascript
new Intl.DateTimeFormat(
  "en-US",
  {
    timeZone:
      "America/New_York"
  }
).format(date);
```

***

# 4. Mutating Date Objects

### Problem

```javascript
const date =
  new Date();

date.setDate(
  date.getDate() + 1
);
```

Original object changed.

### Better

```javascript
const tomorrow =
  new Date(date);

tomorrow.setDate(
  tomorrow.getDate() + 1
);
```

***

# 5. Comparing Dates as Strings

❌

```javascript
"10/01/2026" >
"2/01/2026"
```

Unexpected results.

✅

```javascript
date1.getTime() >
date2.getTime()
```

***

# Date Validation Examples

***

## 1. Basic Validation

```javascript
function isValidDate(
  dateString
) {
  const date =
    new Date(dateString);

  return !isNaN(date);
}

console.log(
  isValidDate(
    "2026-07-03"
  )
);
```

Output:

```javascript
true
```

***

## 2. Strict Validation

### Problem

```javascript
new Date(
  "2026-02-31"
);
```

JavaScript auto-corrects:

```text
March 3rd
```

Not what we want.

### Solution

```javascript
function validateDate(
  year,
  month,
  day
) {
  const date =
    new Date(
      year,
      month - 1,
      day
    );

  return (
    date.getFullYear() ===
      year &&
    date.getMonth() ===
      month - 1 &&
    date.getDate() === day
  );
}

console.log(
  validateDate(
    2026,
    2,
    31
  )
);
```

Output:

```javascript
false
```

***

## 3. Validate Future Date

```javascript
function isFutureDate(
  dateString
) {
  return (
    new Date(dateString) >
    new Date()
  );
}
```

***

## 4. Validate Age (18+)

```javascript
function isAdult(dob) {
  const age =
    new Date()
      .getFullYear() -
    new Date(dob)
      .getFullYear();

  return age >= 18;
}
```

***

# React Validation Example

```jsx
function AgeValidator() {
  const [dob, setDob] =
    React.useState("");

  const [error, setError] =
    React.useState("");

  const validate = value => {
    const birth =
      new Date(value);

    if (
      isNaN(birth)
    ) {
      setError(
        "Invalid Date"
      );
      return;
    }

    setError("");
  };

  return (
    <>
      <input
        type="date"
        value={dob}
        onChange={e => {
          setDob(
            e.target.value
          );

          validate(
            e.target.value
          );
        }}
      />

      {error && (
        <p>{error}</p>
      )}
    </>
  );
}
```

***

# Tips for Optimising Date Calculations

***

## 1. Use Timestamps for Comparisons

Instead of:

```javascript
date1 > date2
```

Use:

```javascript
date1.getTime() >
date2.getTime()
```

Faster and more explicit.

***

## 2. Avoid Repeated Date Creation

❌

```javascript
for (
  let i = 0;
  i < 100000;
  i++
) {
  new Date();
}
```

✅

```javascript
const now =
  Date.now();

for (
  let i = 0;
  i < 100000;
  i++
) {
  // reuse
}
```

***

## 3. Use `Date.now()`

Faster than:

```javascript
new Date().getTime();
```

Use:

```javascript
Date.now();
```

***

## 4. Cache Formatters

❌

```javascript
items.map(item =>
  new Intl.DateTimeFormat(
    "en-GB"
  ).format(item.date)
);
```

Creates a formatter every iteration.

✅

```javascript
const formatter =
  new Intl.DateTimeFormat(
    "en-GB"
  );

items.map(item =>
  formatter.format(
    item.date
  )
);
```

***

## 5. Store Dates in UTC

Database:

```text
2026-07-03T12:00:00Z
```

Display:

```javascript
Intl.DateTimeFormat(
  locale,
  {
    timeZone
  }
)
```

Avoids timezone bugs.

***

## 6. Use Milliseconds for Large Calculations

### Difference in Days

```javascript
const days =
  (
    end.getTime() -
    start.getTime()
  ) /
  (
    1000 *
    60 *
    60 *
    24
  );
```

More efficient than repeatedly adjusting dates in loops.

***

# Most Asked Date Pitfall Interview Questions

### Why is this wrong?

```javascript
new Date(
  "03/07/2026"
)
```

Locale ambiguity.

***

### Why avoid?

```javascript
date.setHours(
  date.getHours() + 5
);
```

DST issues.

***

### Fastest current timestamp?

```javascript
Date.now();
```

***

### How should dates be stored?

```text
UTC
```

***

### How should dates be displayed?

```javascript
Intl.DateTimeFormat(
  locale,
  {
    timeZone
  }
)
```

***

# Senior Interview Answer

> The most common date-handling pitfalls include zero-based months, locale-dependent parsing, mutating Date objects, manual timezone calculations, and ignoring daylight saving time. For production systems, dates should be stored in UTC, validated using strict checks, compared using timestamps (`getTime()`), and displayed using `Intl.DateTimeFormat` with the appropriate locale and timezone. For performance, prefer `Date.now()` for timestamps and reuse `Intl.DateTimeFormat` instances rather than recreating them repeatedly.
# Date Parsing Errors in JavaScript (Most Common Interview Pitfalls)

Date parsing is one of the most error-prone areas in JavaScript. Many production bugs happen because developers rely on automatic parsing. Related guidance in internal engineering materials also emphasises validating date-related fields rather than assuming values are correct. [\[Robotic Pr...Guideline \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Robotic%20Process%20Automation%20Design%20Development%20Deployment%20Guideline.pdf?web=1), [\[dotnet-C#-...guidelines \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1)

***

# 1. Ambiguous Date Formats

## ❌ Problem

```javascript
const date = new Date("03/07/2026");

console.log(date);
```

Which date is this?

```text
03 July 2026 ?
```

or

```text
March 07 2026 ?
```

Different browsers and locales may interpret it differently.

***

## ✅ Fix

Always use ISO format:

```javascript
const date =
  new Date("2026-07-03");
```

or

```javascript
const date =
  new Date(
    Date.UTC(
      2026,
      6,
      3
    )
  );
```

***

# 2. Invalid Dates Auto-Correct

## ❌ Problem

```javascript
const date =
  new Date("2026-02-31");

console.log(date);
```

Output:

```text
Tue Mar 03 2026
```

JavaScript silently fixes the date.

***

## ✅ Fix

Use strict validation.

```javascript
function validateDate(
  year,
  month,
  day
) {
  const date =
    new Date(
      year,
      month - 1,
      day
    );

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

console.log(
  validateDate(
    2026,
    2,
    31
  )
);
```

Output:

```javascript
false
```

***

# 3. Month Index Mistake

## ❌ Problem

```javascript
new Date(
  2026,
  7,
  1
);
```

Expected:

```text
July
```

Actual:

```text
August
```

Because:

```javascript
0 = January
11 = December
```

***

## ✅ Fix

```javascript
new Date(
  2026,
  6,
  1
);
```

***

# 4. Parsing User Input Directly

## ❌ Problem

```javascript
const userInput =
  "31-12-2026";

const date =
  new Date(userInput);
```

May return:

```javascript
Invalid Date
```

depending on browser.

***

## ✅ Fix

Parse manually.

```javascript
function parseDDMMYYYY(
  value
) {
  const [
    day,
    month,
    year
  ] = value.split("-");

  return new Date(
    year,
    month - 1,
    day
  );
}

console.log(
  parseDDMMYYYY(
    "31-12-2026"
  )
);
```

***

# 5. Timezone Parsing Bug

## ❌ Problem

```javascript
const date =
  new Date("2026-07-03");
```

Different environments may interpret it relative to timezone.

***

## ✅ Fix

Store timestamps as UTC.

```javascript
const date =
  new Date(
    "2026-07-03T00:00:00Z"
  );
```

***

# 6. Comparing Dates as Strings

## ❌ Problem

```javascript
"10/01/2026" >
"2/01/2026"
```

Result:

```javascript
false
```

Wrong comparison.

***

## ✅ Fix

```javascript
new Date(
  "2026-10-01"
).getTime() >
new Date(
  "2026-02-01"
).getTime();
```

***

# 7. Detect Invalid Date

### Common Interview Question

```javascript
const date =
  new Date(
    "invalid-date"
  );

console.log(date);
```

Output:

```javascript
Invalid Date
```

***

## Validation

```javascript
function isValidDate(
  value
) {
  return !isNaN(
    new Date(value)
      .getTime()
  );
}

console.log(
  isValidDate(
    "2026-07-03"
  )
);
```

Output:

```javascript
true
```

***

# 8. React Form Validation Example

```jsx
import { useState } from "react";

function DateForm() {
  const [date, setDate] =
    useState("");

  const [error, setError] =
    useState("");

  const validate =
    value => {
      const parsed =
        new Date(value);

      if (
        isNaN(
          parsed
            .getTime()
        )
      ) {
        setError(
          "Invalid date"
        );
      } else {
        setError("");
      }
    };

  return (
    <>
      <input
        type="date"
        value={date}
        onChange={e => {
          setDate(
            e.target.value
          );

          validate(
            e.target.value
          );
        }}
      />

      {error && (
        <p>{error}</p>
      )}
    </>
  );
}
```

***

# 9. Daylight Saving Time Bug

## ❌ Wrong

```javascript
date.setHours(
  date.getHours() + 5
);
```

Assumes fixed offsets.

***

## ✅ Correct

```javascript
new Intl.DateTimeFormat(
  "en-US",
  {
    timeZone:
      "America/New_York"
  }
).format(date);
```

Handles:

✅ DST

✅ Timezone changes

✅ Locale formatting

***

# Production-Ready Date Parsing Utility

```javascript
function parseDate(
  value
) {
  const date =
    new Date(value);

  if (
    isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Invalid Date"
    );
  }

  return date;
}

try {
  const date =
    parseDate(
      "2026-07-03"
    );

  console.log(date);
} catch (error) {
  console.error(
    error.message
  );
}
```

***

# Senior React/JavaScript Interview Answer

### Biggest Date Parsing Mistakes

❌ Using `"03/07/2026"` (ambiguous format)

❌ Forgetting months are zero-based

❌ Relying on browser auto-parsing

❌ Accepting invalid dates such as `"2026-02-31"`

❌ Manually calculating timezone offsets

❌ Comparing date strings directly

### Best Practices

✅ Use ISO format:

```javascript
2026-07-03T12:00:00Z
```

✅ Validate using:

```javascript
!isNaN(date.getTime())
```

✅ Store dates in UTC

✅ Display using:

```javascript
Intl.DateTimeFormat()
```

✅ Compare using:

```javascript
date.getTime()
```

✅ Use strict validation when accepting user input

These are the date-related pitfalls and fixes most frequently discussed in JavaScript and React interviews.
