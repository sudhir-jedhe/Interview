**Create a Dictionary of Dates** is a popular DevTools/Frontend interview problem where you typically group dates or create a lookup table for fast access. [\[devtools.tech\]](https://devtools.tech/questions/s/create-a-dictionary-of-dates-or-frontend-interview-questions-or-problem-solving-practice---qid---Vp3l0UdgJIxFtSyF8nBh)

---

# Problem

Given:

```js
["2026-07-01", "2026-07-02", "2026-07-05"];
```

Create:

```js
{
  "2026-07-01": true,
  "2026-07-02": true,
  "2026-07-05": true
}
```

This provides **O(1)** lookup.

---

# Solution 1: Using reduce()

```js
function createDateDictionary(dates) {
  return dates.reduce((dictionary, date) => {
    dictionary[date] = true;

    return dictionary;
  }, {});
}
```

### Usage

```js
const dates = ["2026-07-01", "2026-07-02", "2026-07-05"];

const dictionary = createDateDictionary(dates);

console.log(dictionary);
```

### Output

```js
{
  "2026-07-01": true,
  "2026-07-02": true,
  "2026-07-05": true
}
```

---

# Solution 2: Using Map

Better for large datasets.

```js
function createDateMap(dates) {
  const map = new Map();

  for (const date of dates) {
    map.set(date, true);
  }

  return map;
}
```

Usage:

```js
const map = createDateMap(dates);

console.log(map.has("2026-07-02"));
```

Output:

```js
true;
```

---

# Calendar Interview Variant

Input:

```js
[
  {
    id: 1,
    date: "2026-07-01",
  },
  {
    id: 2,
    date: "2026-07-01",
  },
  {
    id: 3,
    date: "2026-07-02",
  },
];
```

Create:

```js
{
  "2026-07-01": [
    { id: 1 },
    { id: 2 }
  ],

  "2026-07-02": [
    { id: 3 }
  ]
}
```

### Solution

```js
function groupByDate(items) {
  const result = {};

  for (const item of items) {
    const date = item.date;

    if (!result[date]) {
      result[date] = [];
    }

    result[date].push(item);
  }

  return result;
}
```

---

# React Use Case

Useful for:

```text
✅ Date Picker

✅ Calendar

✅ Attendance Systems

✅ Event Schedulers

✅ Booking Systems
```

Example:

```js
const disabledDates = {
  "2026-07-01": true,
  "2026-07-02": true,
};

if (disabledDates[selectedDate]) {
  console.log("Date blocked");
}
```

---

# Time Complexity

### Object Dictionary

```text
Creation : O(n)

Lookup   : O(1)
```

### Map

```text
Creation : O(n)

Lookup   : O(1)
```

---

# Senior Interview Answer

> A date dictionary is typically implemented as an Object or Map where the date string is the key and the value is either a boolean, count, or list of records. This transforms repeated date searches from O(n) scans into O(1) lookups, which is useful in calendars, scheduling systems, and booking applications.
