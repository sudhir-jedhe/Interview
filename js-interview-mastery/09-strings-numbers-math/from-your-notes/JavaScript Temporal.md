**JavaScript `Temporal**` is a modern built-in API designed to fix the long-standing flaws of the legacy `Date` object. Standardized under ECMAScript Stage 3 (and implemented across modern engines), `Temporal` provides immutable, timezone-aware, and type-safe primitives for dates, times, durations, and instantly identifiable timestamps.

---

## 1. What is JavaScript `Temporal`?

The legacy `Date` object was created in 10 days in 1995 (modeled directly on `java.util.Date`). It is notoriously buggy, mutable, and difficult to use safely. `Temporal` introduces separate, purpose-built data types under the global `Temporal` namespace.

### `Temporal` Core Principles

* **Immutability:** All `Temporal` objects are read-only. Modifying a date creates a new object instead of mutating in place.
* **Nanosecond Precision:** Timestamps are tracked in nanoseconds rather than milliseconds.
* **Explicit Timezones and Calendars:** Timezones and non-ISO calendars are first-class, explicit concepts rather than implicit local settings.
* **Separation of Concerns:** Distinct types exist for wall-clock dates, wall-clock times, durations, and global instants.

---

## 2. `Temporal` vs. JavaScript `Date`

| Feature                | Legacy `Date`                                              | `Temporal` API                                                   |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| **Mutability**         | **Mutable** (methods like `setHours()` mutate in place)    | **Immutable** (methods return new objects)                       |
| **Precision**          | Milliseconds ($10^{-3}\text{ s}$)                          | Nanoseconds ($10^{-9}\text{ s}$)                                 |
| **Timezone Support**   | Limited to UTC and System Local                            | Explicit IANA timezones (e.g., `'America/New_York'`)             |
| **DST / Leap Seconds** | Silent bugs and unpredictable rollbacks                    | Built-in disambiguation rules (`'compatible'`, `'reject'`, etc.) |
| **Month Indexing**     | **0-indexed** ($0 = \text{January}, 11 = \text{December}$) | **1-indexed** ($1 = \text{January}, 12 = \text{December}$)       |
| **Parsing**            | `Date.parse()` is notoriously implementation-dependent     | Strictly parses ISO 8601 / RFC 9557 strings                      |

---

## 3. Core `Temporal` Data Types

```text
                           ┌───────────────────┐
                           │   Temporal.Now    │
                           └─────────┬─────────┘
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│   Instant    │             │ ZonedDateTime│             │   Duration   │
│ (UTC Exact)  │             │(Exact + TZ)  │             │ (Delta Time) │
└──────────────┘             └──────────────┘             └──────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
   │ PlainDateTime │         │   PlainDate   │         │   PlainTime   │
   └───────────────┘         └───────┬───────┘         └───────────────┘
                                     │
                             ┌───────┴───────┐
                             ▼               ▼
                     ┌───────────────┐┌───────────────┐
                     │PlainYearMonth ││ PlainMonthDay │
                     └───────────────┘└───────────────┘

```

### A. `Temporal.Now`

Access methods to retrieve the current exact time, wall-clock date, or timezone.

```javascript
Temporal.Now.instant();        // Exact UTC timestamp
Temporal.Now.zonedDateTimeISO('America/New_York'); // Current date/time in specific timezone
Temporal.Now.plainDateISO();   // Current wall-clock date (YYYY-MM-DD)
Temporal.Now.plainTimeISO();   // Current wall-clock time (HH:MM:SS)

```

### B. `Temporal.Instant`

Represents an exact point in time on the timeline in UTC, independent of location or calendar (nanoseconds since UNIX epoch).

```javascript
const instant = Temporal.Instant.from("2026-08-07T11:44:00Z");
console.log(instant.epochNanoseconds); // Nanoseconds since 1970-01-01

```

### C. `Temporal.ZonedDateTime`

An exact point in time bound to a specific IANA timezone and calendar system. It handles Daylight Saving Time (DST) transitions automatically.

```javascript
const zdt = Temporal.ZonedDateTime.from("2026-08-07T14:30:00[America/New_York]");
console.log(zdt.timeZoneId); // "America/New_York"

```

### D. Wall-Clock Types (`Plain` Types)

`Plain` types represent calendar dates or times with **no timezone attached** (e.g., a birthday, store opening hours, or anniversary).

* **`Temporal.PlainDate`:** Represents a date ($YYYY-MM-DD$).

```javascript
const date = Temporal.PlainDate.from("2026-08-07");

```

* **`Temporal.PlainTime`:** Represents a time of day ($HH:MM:SS.sss$).

```javascript
const time = Temporal.PlainTime.from("14:30:00");

```

* **`Temporal.PlainDateTime`:** Combines `PlainDate` and `PlainTime` without a timezone offset.

```javascript
const dt = Temporal.PlainDateTime.from("2026-08-07T14:30:00");

```

* **`Temporal.PlainYearMonth`:** Represents a month in a specific year ($YYYY-MM$, e.g., credit card expiry).

```javascript
const ym = Temporal.PlainYearMonth.from("2026-08");

```

* **`Temporal.PlainMonthDay`:** Represents an annual recurring event ($MM-DD$, e.g., Halloween on 10-31).

```javascript
const md = Temporal.PlainMonthDay.from("10-31");

```

### E. `Temporal.Duration`

Represents a quantity or span of time (e.g., "2 hours, 30 minutes, and 45 seconds").

```javascript
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
console.log(duration.total({ unit: 'minutes' })); // 150

```

---

## 4. Arithmetic, Differences, and Comparison

### A. Arithmetic (`add` and `subtract`)

Because objects are immutable, `.add()` and `.subtract()` return a new instance.

```javascript
const today = Temporal.PlainDate.from("2026-08-07");

const nextWeek = today.add({ days: 7 });
const pastDate = today.subtract({ months: 2 });

console.log(nextWeek.toString()); // "2026-08-14"

```

### B. Calculating Differences (`until` and `since`)

Calculate the exact duration between two dates or instants:

```javascript
const start = Temporal.PlainDate.from("2026-01-01");
const end = Temporal.PlainDate.from("2026-08-07");

const diff = start.until(end, { largestUnit: "month" });
console.log(diff.toString()); // "P7M6D" (7 months, 6 days)

```

### C. Comparison (`Temporal.compare`)

Static `compare()` functions allow easy sorting in array sorting routines:

```javascript
const d1 = Temporal.PlainDate.from("2026-05-10");
const d2 = Temporal.PlainDate.from("2026-08-07");

Temporal.PlainDate.compare(d1, d2); // -1 (d1 < d2)

// Sorting an array of PlainDates
const dates = [d2, d1];
dates.sort(Temporal.PlainDate.compare);

```

---

## 5. Conversions and Formatting

### A. Converting Between Types

`Temporal` objects can be converted explicitly using `.to...()` methods:

```javascript
const plainDate = Temporal.PlainDate.from("2026-08-07");

// Convert PlainDate -> PlainDateTime by adding time
const plainDateTime = plainDate.toPlainDateTime({ hour: 14, minute: 30 });

// Convert PlainDateTime -> ZonedDateTime by adding a timezone
const zonedDateTime = plainDateTime.toZonedDateTime("America/New_York");

// Convert ZonedDateTime -> Instant
const instant = zonedDateTime.toInstant();

```

### B. Formatting (`toLocaleString`)

All `Temporal` objects integrate directly with the `Intl.DateTimeFormat` API via `.toLocaleString()`:

```javascript
const zdt = Temporal.Now.zonedDateTimeISO("Europe/Paris");

console.log(zdt.toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" }));
// e.g., "vendredi 7 août 2026 à 13:44"

```

---

## 6. Common Mistakes to Avoid with `Temporal`

1. **Assuming Month Indexing starts at 0:**

* ❌ **Legacy Date:** `new Date(2026, 0, 1)` = January 1st.
* ✅ **Temporal:** `Temporal.PlainDate.from({ year: 2026, month: 1, day: 1 })` = January 1st ($1 = \text{Jan}$).

1. **Confusing `PlainDateTime` with `ZonedDateTime`:**

* Do **not** store wall-clock `PlainDateTime` for global events or appointments across timezones. Always use `ZonedDateTime` or `Instant` when timezones matter.

1. **Attempting to Mutate Objects:**

* `Temporal` objects are read-only. Calling `date.add({ days: 1 })` does **not** change `date`; you must assign the return value to a variable.

---

## 7. How to Migrate to `Temporal`

### Interoperability with Legacy `Date`

Use the `toTemporalInstant()` extension method added to legacy `Date` prototypes to migrate incrementally:

```javascript
// 1. Convert Legacy Date -> Temporal.Instant
const legacyDate = new Date();
const temporalInstant = legacyDate.toTemporalInstant();

// 2. Convert to ZonedDateTime for safe operations
const zdt = temporalInstant.toZonedDateTimeISO(Temporal.Now.timeZoneId());

// 3. Convert Temporal.Instant -> Legacy Date (if passing to third-party library)
const newLegacyDate = new Date(temporalInstant.epochMilliseconds);

```

### Using a Polyfill Today

While browser engines roll out native support for Stage 3 `Temporal`, you can use the official `@js-temporal/polyfill` library in production environments:

```bash
npm install @js-temporal/polyfill

```

```javascript
import { Temporal } from "@js-temporal/polyfill";

const date = Temporal.Now.plainDateISO();

```

---

## 8. Standards Status

The `Temporal` specification is governed by **TC39** as an official ECMAScript proposal (Stage 3). It is designed according to **ISO 8601** and **RFC 9557** (Extended ISO 8601 format for timezones and calendars).

Explain Temporal.Duration and date arithmetic in JavaScript with code examples

**`Temporal.Duration`** is a dedicated primitive in the modern JavaScript `Temporal` API used to represent a length or difference of time (such as "3 days, 4 hours, and 30 minutes") without being tied to a specific point on the calendar.

It resolves legacy `Date` pain points where date arithmetic required converting dates into epoch milliseconds, calculating math manually, and dealing with subtle bugs caused by Daylight Saving Time (DST) or variable month lengths.

---

## 1. Creating a `Temporal.Duration`

You can construct a `Temporal.Duration` using an object payload or an **ISO 8601 duration string** (format: `P[n]Y[n]M[n]DT[n]H[n]M[n]S`).

```javascript
// 1. From an Object
const duration1 = Temporal.Duration.from({
  years: 1,
  months: 2,
  weeks: 1,
  days: 5,
  hours: 12,
  minutes: 30
});

// 2. From an ISO 8601 String ("P1Y2M1W5DT12H30M")
const duration2 = Temporal.Duration.from("P1Y2M1W5DT12H30M");

console.log(duration1.years);   // 1
console.log(duration1.minutes); // 30
console.log(duration1.toString()); // "P1Y2M1W5DT12H30M"

```

---

## 2. Date Arithmetic (`add` and `subtract`)

You can add or subtract durations directly to/from any `Temporal` date or time object (`PlainDate`, `PlainDateTime`, `ZonedDateTime`, `Instant`, etc.).

### A. Adding and Subtracting Durations

```javascript
const today = Temporal.PlainDate.from("2026-08-07");

// Add 3 months and 10 days
const futureDate = today.add({ months: 3, days: 10 });
console.log(futureDate.toString()); // "2026-11-17"

// Subtract 2 weeks
const pastDate = today.subtract({ weeks: 2 });
console.log(pastDate.toString()); // "2026-07-24"

```

---

### B. DST-Aware Arithmetic with `ZonedDateTime`

When performing calculations across Daylight Saving Time boundaries, `Temporal.ZonedDateTime` automatically adjusts wall-clock times appropriately.

```javascript
// New York transitions out of Daylight Saving Time on Nov 1, 2026
const beforeDST = Temporal.ZonedDateTime.from("2026-10-31T10:00:00[America/New_York]");

// Add 2 days (spans the DST transition night)
const afterDST = beforeDST.add({ days: 2 });

console.log(afterDST.toString()); 
// Output: "2026-11-02T10:00:00-05:00[America/New_York]" (Wall-clock time remains 10:00 AM!)

```

---

## 3. Calculating Differences (`since` and `until`)

To find the duration between two points in time, use `.until()` or `.since()`.

* **`until`**: Returns the duration from the caller to the target (caller $\rightarrow$ target).
* **`since`**: Returns the duration from the target to the caller (target $\rightarrow$ caller).

```javascript
const startDate = Temporal.PlainDate.from("2026-01-01");
const endDate = Temporal.PlainDate.from("2026-08-07");

// Calculate duration until endDate
const diff = startDate.until(endDate, { largestUnit: "month" });

console.log(diff.toString()); // "P7M6D" (7 months, 6 days)
console.log(`Months: ${diff.months}, Days: ${diff.days}`); // Months: 7, Days: 6

```

---

## 4. Duration Operations (`round`, `total`, `add`, `subtract`)

`Temporal.Duration` objects have their own instance methods to perform duration-to-duration math and unit conversions.

### A. `.total()` — Converting Duration to a Single Unit

Because months and years vary in length, converting relative duration units requires an explicit **`relativeTo`** reference date:

```javascript
const duration = Temporal.Duration.from({ hours: 3, minutes: 45 });

// Convert total hours to fractional number
console.log(duration.total({ unit: "hour" })); // 3.75
console.log(duration.total({ unit: "minute" })); // 225

// Converting month durations requires a relative reference date:
const monthDuration = Temporal.Duration.from({ months: 2 });
const totalDays = monthDuration.total({
  unit: "day",
  relativeTo: Temporal.PlainDate.from("2026-02-01") // Feb + Mar 2026
});
console.log(totalDays); // 59 days

```

---

### B. `.round()` — Balancing and Rounding Units

By default, durations do not automatically "roll over" (e.g., 90 minutes won't automatically convert to 1 hour and 30 minutes). Use `.round()` to balance or cap units:

```javascript
const unbalanced = Temporal.Duration.from({ minutes: 135 });

// Balance minutes into hours and minutes
const balanced = unbalanced.round({
  largestUnit: "hour",
  smallestUnit: "minute"
});

console.log(balanced.toString()); // "PT2H15M" (2 hours, 15 minutes)

```

---

### C. Duration Arithmetic (`add` and `subtract`)

You can combine or subtract two separate `Temporal.Duration` objects:

```javascript
const flightSegment1 = Temporal.Duration.from({ hours: 4, minutes: 30 });
const flightSegment2 = Temporal.Duration.from({ hours: 6, minutes: 45 });

// Add two durations
const totalFlightTime = flightSegment1.add(flightSegment2).round({ largestUnit: "hour" });

console.log(totalFlightTime.toString()); // "PT11H15M" (11 hours, 15 minutes)

```

---

## 5. Summary Cheat Sheet

| Task                         | Code Snippet                                    |
| ---------------------------- | ----------------------------------------------- |
| **Create Duration**          | `Temporal.Duration.from({ days: 5, hours: 2 })` |
| **Add to Date**              | `date.add({ months: 1 })`                       |
| **Subtract from Date**       | `date.subtract({ days: 10 })`                   |
| **Difference between dates** | `d1.until(d2, { largestUnit: 'month' })`        |
| **Balance Units**            | `duration.round({ largestUnit: 'day' })`        |
| **Get total minutes/hours**  | `duration.total({ unit: 'minute' })`            |

Explain JavaScript Intl.DateTimeFormat with code examples

The **`Intl.DateTimeFormat`** object is a built-in feature of the ECMAScript Internationalization API (`Intl`) that enables language-sensitive date and time formatting without external heavy libraries like Moment.js or date-fns.

It works with legacy `Date` instances, timestamp numbers, and modern `Temporal` objects.

---

## 1. Basic Syntax and Usage

You can format dates either by creating an explicit formatter instance (ideal for reusability and performance) or calling `date.toLocaleString()` (which uses `Intl.DateTimeFormat` under the hood).

```javascript
// Syntax: new Intl.DateTimeFormat([locales], [options])

const now = new Date(); // e.g., August 7, 2026

// 1. US English formatting
const formatterUS = new Intl.DateTimeFormat("en-US");
console.log(formatterUS.format(now)); // "8/7/2026"

// 2. German formatting (DD.MM.YYYY)
const formatterDE = new Intl.DateTimeFormat("de-DE");
console.log(formatterDE.format(now)); // "7.8.2026"

// 3. Japanese formatting (YYYY/MM/DD)
const formatterJP = new Intl.DateTimeFormat("ja-JP");
console.log(formatterJP.format(now)); // "2026/8/7"

```

---

## 2. Using Shortcuts: `dateStyle` and `timeStyle`

Instead of specifying every date component manually, use `dateStyle` and `timeStyle` for quick, standardized formats:

```javascript
const now = new Date();

// Options: 'full', 'long', 'medium', 'short'
const formatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeStyle: "short"
});

console.log(formatter.format(now)); 
// Output: "Friday, 7 August 2026 at 17:15"

```

---

## 3. Fine-Grained Component Formatting

When you need custom date layouts, configure individual date/time component options:

```javascript
const date = new Date("2026-08-07T14:30:00Z");

const options = {
  weekday: "long",   // "Friday", "Fri", "F"
  year: "numeric",   // "2026", "26"
  month: "long",     // "August", "Aug", "08"
  day: "numeric",    // "7", "07"
  hour: "2-digit",   // "02", "14"
  minute: "2-digit", // "30"
  timeZoneName: "short", // "EST", "GMT-5"
  timeZone: "America/New_York" // Force specific IANA timezone
};

const customFormatter = new Intl.DateTimeFormat("en-US", options);
console.log(customFormatter.format(date));
// Output: "Friday, August 7, 2026 at 10:30 AM EDT"

```

### Component Options Reference

| Option         | Values                                        | Example Output                             |
| -------------- | --------------------------------------------- | ------------------------------------------ |
| **`weekday`**  | `"narrow"`, `"short"`, `"long"`               | `"F"`, `"Fri"`, `"Friday"`                 |
| **`month`**    | `"numeric"`, `"2-digit"`, `"short"`, `"long"` | `"8"`, `"08"`, `"Aug"`, `"August"`         |
| **`day`**      | `"numeric"`, `"2-digit"`                      | `"7"`, `"07"`                              |
| **`hour`**     | `"numeric"`, `"2-digit"`                      | `"9"`, `"09"`                              |
| **`hour12`**   | `true`, `false`                               | `12-hour` vs `24-hour` toggle              |
| **`timeZone`** | IANA timezone string                          | `"UTC"`, `"Asia/Tokyo"`, `"Europe/London"` |

---

## 4. Formatting Date Ranges (`formatRange`)

`Intl.DateTimeFormat` includes a built-in `.formatRange()` method to format a start and end date concisely without repeating shared parts (like the year or month):

```javascript
const startDate = new Date("2026-08-07");
const endDate = new Date("2026-08-14");

const rangeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

console.log(rangeFormatter.formatRange(startDate, endDate));
// Output: "Aug 7 – 14, 2026" (Intelligently omits repeating "Aug" and "2026")

```

---

## 5. Splitting Formatted Strings (`formatToParts`)

If you are building custom calendar controls or UI components that require wrapping specific date parts in HTML elements, use `.formatToParts()`:

```javascript
const date = new Date("2026-08-07");
const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const parts = formatter.formatToParts(date);
console.log(parts);
/*
Output Array:
[
  { type: 'month', value: 'Aug' },
  { type: 'literal', value: ' ' },
  { type: 'day', value: '7' }
]
*/

// Example: Render with styled spans
const html = parts
  .map(({ type, value }) => `<span class="date-${type}">${value}</span>`)
  .join("");

```

---

## 6. Integration with `Temporal` (Modern JS)

`Intl.DateTimeFormat` works natively with modern `Temporal` objects via their built-in `.toLocaleString()` method or directly via `format()`:

```javascript
// Using Temporal.ZonedDateTime
const zdt = Temporal.ZonedDateTime.from("2026-08-07T14:30:00[Europe/Paris]");

console.log(zdt.toLocaleString("fr-FR", { dateStyle: "full" }));
// Output: "vendredi 7 août 2026"

```

---

## Performance Tip

Creating a new `Intl.DateTimeFormat` instance carries an initialization cost. When formatting arrays or lists of dates (e.g., inside a loop or React component render), instantiate the formatter **once** outside the loop and reuse it:

```javascript
const dates = [new Date("2026-08-01"), new Date("2026-08-07"), new Date("2026-08-15")];

// ✅ SECURE & FAST: Single formatter instance reused
const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
const formattedList = dates.map(d => formatter.format(d));

```

**`Temporal.ZonedDateTime`** is the most complete date-time type in the modern JavaScript `Temporal` API. It represents an exact point on the global timeline, explicitly bound to both an **IANA timezone identifier** (e.g., `'America/New_York'` or `'Asia/Kolkata'`) and a **calendar system** (ISO 8601 by default).

Unlike the legacy `Date` object—which only knows UTC and whatever local timezone the user's operating system happens to be set to—`Temporal.ZonedDateTime` treats timezones as first-class citizens, making time zone conversions and Daylight Saving Time (DST) math deterministic and bug-free.

---

## 1. Anatomy of a `ZonedDateTime`

A `ZonedDateTime` string follows the Extended ISO 8601 / RFC 9557 format:

$$\text{\texttt{2026-08-07T14:30:00-04:00[America/New\_York]}}$$

* **Wall-Clock Date & Time:** `2026-08-07T14:30:00`
* **UTC Offset:** `-04:00` (computed automatically based on DST rules for that date)
* **IANA Timezone ID:** `[America/New_York]`

---

## 2. Creating a `ZonedDateTime`

### A. From `Temporal.Now`

Retrieve the current date and time in a specific timezone or the user's local timezone:

```javascript
// Get current time in Tokyo
const zdtTokyo = Temporal.Now.zonedDateTimeISO('Asia/Tokyo');
console.log(zdtTokyo.toString()); 
// Output: "2026-08-07T20:45:00+09:00[Asia/Tokyo]"

// Get current time in local system timezone
const zdtLocal = Temporal.Now.zonedDateTimeISO();
console.log(zdtLocal.timeZoneId); // e.g., "Asia/Kolkata"

```

### B. Using `Temporal.ZonedDateTime.from()`

Construct an instance from an object or string representation:

```javascript
// 1. From an Extended ISO string
const zdt1 = Temporal.ZonedDateTime.from('2026-08-07T14:30:00-04:00[America/New_York]');

// 2. From an Object Payload
const zdt2 = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 8,
  day: 7,
  hour: 14,
  minute: 30,
  timeZone: 'Europe/Paris'
});

console.log(zdt2.offset); // "+02:00" (Paris is in CEST during August)

```

---

## 3. Converting Between Timezones (`withTimeZone`)

To convert a time from one region to another without altering the underlying exact instant in time, use **`.withTimeZone()`**:

```javascript
// A meeting scheduled for 10:00 AM New York time
const nyMeeting = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 8,
  day: 7,
  hour: 10,
  minute: 0,
  timeZone: 'America/New_York'
});

// Convert meeting time to London, Tokyo, and Kolkata
const londonMeeting = nyMeeting.withTimeZone('Europe/London');
const tokyoMeeting  = nyMeeting.withTimeZone('Asia/Tokyo');
const indiaMeeting  = nyMeeting.withTimeZone('Asia/Kolkata');

console.log(nyMeeting.toString());     // "2026-08-07T10:00:00-04:00[America/New_York]"
console.log(londonMeeting.toString()); // "2026-08-07T15:00:00+01:00[Europe/London]"
console.log(tokyoMeeting.toString());  // "2026-08-07T23:00:00+09:00[Asia/Tokyo]"
console.log(indiaMeeting.toString());  // "2026-08-07T19:30:00+05:30[Asia/Kolkata]"

```

---

## 4. Handling Daylight Saving Time (DST) Transitions

Daylight Saving Time creates two tricky edge cases when calculating wall-clock times:

1. **Gaps (Spring Forward):** An hour is skipped (e.g., $02:00 \rightarrow 03:00$). Clock times between 2 AM and 3 AM don't exist.
2. **Overlap / Ambiguity (Fall Back):** An hour repeats (e.g., $01:00 \rightarrow 02:00$ happens twice).

`Temporal.ZonedDateTime` automatically resolves DST transitions using disambiguation strategies via the **`disambiguation`** option (`'compatible'` [default], `'earlier'`, `'later'`, or `'reject'`).

### Handling a Skipped Clock Time (Spring Forward)

```javascript
// New York skipped 2:00 AM - 3:00 AM on March 8, 2026 (Spring Forward)
const skippedTimeStr = '2026-03-08T02:30:00[America/New_York]';

// Default ('compatible'): Adjusts forward to 3:30 AM
const defaultResolution = Temporal.ZonedDateTime.from(skippedTimeStr);
console.log(defaultResolution.toString()); 
// Output: "2026-03-08T03:30:00-04:00[America/New_York]"

// Option 'earlier': Shifts back to 1:30 AM before transition
const earlierResolution = Temporal.ZonedDateTime.from(skippedTimeStr, { disambiguation: 'earlier' });
console.log(earlierResolution.toString()); 
// Output: "2026-03-08T01:30:00-05:00[America/New_York]"

// Option 'reject': Throws RangeError if time is invalid
try {
  Temporal.ZonedDateTime.from(skippedTimeStr, { disambiguation: 'reject' });
} catch (e) {
  console.error("Invalid time during DST gap!");
}

```

---

## 5. Timezone-Aware Date Arithmetic

When adding days or months across DST boundaries, `ZonedDateTime` preserves wall-clock time while correctly updating the offset.

```javascript
const beforeFallBack = Temporal.ZonedDateTime.from('2026-10-31T09:00:00[America/New_York]');

// Add 2 days (spans the Fall Back transition night on Nov 1)
const afterFallBack = beforeFallBack.add({ days: 2 });

console.log(afterFallBack.toString());
// Output: "2026-11-02T09:00:00-05:00[America/New_York]"
// Note: Wall-clock time stays at 09:00 AM, but offset automatically shifted from -04:00 to -05:00!

```

---

## 6. Converting Between `ZonedDateTime`, `Instant`, and `PlainDateTime`

`Temporal` makes conversions between exact UTC instants, local wall-clock times, and timezone-aware dates explicit:

```javascript
const zdt = Temporal.ZonedDateTime.from('2026-08-07T14:30:00[America/New_York]');

// 1. Convert to Instant (Drops timezone metadata; exact UTC timestamp)
const instant = zdt.toInstant();
console.log(instant.toString()); // "2026-08-07T18:30:00Z"

// 2. Convert to PlainDateTime (Drops timezone; keeps wall-clock 14:30)
const plainDateTime = zdt.toPlainDateTime();
console.log(plainDateTime.toString()); // "2026-08-07T14:30:00"

// 3. Re-attach a different timezone to a PlainDateTime
const newZdt = plainDateTime.toZonedDateTime('Europe/London');
console.log(newZdt.toString()); // "2026-08-07T14:30:00+01:00[Europe/London]"

```

---

## Summary Reference

| Operation                     | Method / Code Snippet                         |
| ----------------------------- | --------------------------------------------- |
| **Get current ZonedDateTime** | `Temporal.Now.zonedDateTimeISO('UTC')`        |
| **Convert Timezone**          | `zdt.withTimeZone('Europe/London')`           |
| **Get UTC Offset String**     | `zdt.offset` (e.g., `"-04:00"`)               |
| **Get IANA Timezone ID**      | `zdt.timeZoneId` (e.g., `"America/New_York"`) |
| **Add / Subtract Duration**   | `zdt.add({ days: 1, hours: 3 })`              |
| **Convert to UTC Instant**    | `zdt.toInstant()`                             |

Explain Temporal.ZonedDateTime and timezones in JavaScript with code examples

**`Temporal.Duration`** is a dedicated primitive in the modern JavaScript `Temporal` API used to represent a length or difference of time (such as "3 days, 4 hours, and 30 minutes") without being tied to a specific point on the calendar.

It resolves legacy `Date` pain points where date arithmetic required converting dates into epoch milliseconds, calculating math manually, and dealing with subtle bugs caused by Daylight Saving Time (DST) or variable month lengths.

---

## 1. Creating a `Temporal.Duration`

You can construct a `Temporal.Duration` using an object payload or an **ISO 8601 duration string** (format: `P[n]Y[n]M[n]DT[n]H[n]M[n]S`).

```javascript
// 1. From an Object
const duration1 = Temporal.Duration.from({
  years: 1,
  months: 2,
  weeks: 1,
  days: 5,
  hours: 12,
  minutes: 30
});

// 2. From an ISO 8601 String ("P1Y2M1W5DT12H30M")
const duration2 = Temporal.Duration.from("P1Y2M1W5DT12H30M");

console.log(duration1.years);   // 1
console.log(duration1.minutes); // 30
console.log(duration1.toString()); // "P1Y2M1W5DT12H30M"

```

---

## 2. Date Arithmetic (`add` and `subtract`)

You can add or subtract durations directly to/from any `Temporal` date or time object (`PlainDate`, `PlainDateTime`, `ZonedDateTime`, `Instant`, etc.).

### A. Adding and Subtracting Durations

```javascript
const today = Temporal.PlainDate.from("2026-08-07");

// Add 3 months and 10 days
const futureDate = today.add({ months: 3, days: 10 });
console.log(futureDate.toString()); // "2026-11-17"

// Subtract 2 weeks
const pastDate = today.subtract({ weeks: 2 });
console.log(pastDate.toString()); // "2026-07-24"

```

---

### B. DST-Aware Arithmetic with `ZonedDateTime`

When performing calculations across Daylight Saving Time boundaries, `Temporal.ZonedDateTime` automatically adjusts wall-clock times appropriately.

```javascript
// New York transitions out of Daylight Saving Time on Nov 1, 2026
const beforeDST = Temporal.ZonedDateTime.from("2026-10-31T10:00:00[America/New_York]");

// Add 2 days (spans the DST transition night)
const afterDST = beforeDST.add({ days: 2 });

console.log(afterDST.toString()); 
// Output: "2026-11-02T10:00:00-05:00[America/New_York]" (Wall-clock time remains 10:00 AM!)

```

---

## 3. Calculating Differences (`since` and `until`)

To find the duration between two points in time, use `.until()` or `.since()`.

* **`until`**: Returns the duration from the caller to the target (caller $\rightarrow$ target).
* **`since`**: Returns the duration from the target to the caller (target $\rightarrow$ caller).

```javascript
const startDate = Temporal.PlainDate.from("2026-01-01");
const endDate = Temporal.PlainDate.from("2026-08-07");

// Calculate duration until endDate
const diff = startDate.until(endDate, { largestUnit: "month" });

console.log(diff.toString()); // "P7M6D" (7 months, 6 days)
console.log(`Months: ${diff.months}, Days: ${diff.days}`); // Months: 7, Days: 6

```

---

## 4. Duration Operations (`round`, `total`, `add`, `subtract`)

`Temporal.Duration` objects have their own instance methods to perform duration-to-duration math and unit conversions.

### A. `.total()` — Converting Duration to a Single Unit

Because months and years vary in length, converting relative duration units requires an explicit **`relativeTo`** reference date:

```javascript
const duration = Temporal.Duration.from({ hours: 3, minutes: 45 });

// Convert total hours to fractional number
console.log(duration.total({ unit: "hour" })); // 3.75
console.log(duration.total({ unit: "minute" })); // 225

// Converting month durations requires a relative reference date:
const monthDuration = Temporal.Duration.from({ months: 2 });
const totalDays = monthDuration.total({
  unit: "day",
  relativeTo: Temporal.PlainDate.from("2026-02-01") // Feb + Mar 2026
});
console.log(totalDays); // 59 days

```

---

### B. `.round()` — Balancing and Rounding Units

By default, durations do not automatically "roll over" (e.g., 90 minutes won't automatically convert to 1 hour and 30 minutes). Use `.round()` to balance or cap units:

```javascript
const unbalanced = Temporal.Duration.from({ minutes: 135 });

// Balance minutes into hours and minutes
const balanced = unbalanced.round({
  largestUnit: "hour",
  smallestUnit: "minute"
});

console.log(balanced.toString()); // "PT2H15M" (2 hours, 15 minutes)

```

---

### C. Duration Arithmetic (`add` and `subtract`)

You can combine or subtract two separate `Temporal.Duration` objects:

```javascript
const flightSegment1 = Temporal.Duration.from({ hours: 4, minutes: 30 });
const flightSegment2 = Temporal.Duration.from({ hours: 6, minutes: 45 });

// Add two durations
const totalFlightTime = flightSegment1.add(flightSegment2).round({ largestUnit: "hour" });

console.log(totalFlightTime.toString()); // "PT11H15M" (11 hours, 15 minutes)

```

---

## 5. Summary Cheat Sheet

| Task                         | Code Snippet                                    |
| ---------------------------- | ----------------------------------------------- |
| **Create Duration**          | `Temporal.Duration.from({ days: 5, hours: 2 })` |
| **Add to Date**              | `date.add({ months: 1 })`                       |
| **Subtract from Date**       | `date.subtract({ days: 10 })`                   |
| **Difference between dates** | `d1.until(d2, { largestUnit: 'month' })`        |
| **Balance Units**            | `duration.round({ largestUnit: 'day' })`        |
| **Get total minutes/hours**  | `duration.total({ unit: 'minute' })`            |
