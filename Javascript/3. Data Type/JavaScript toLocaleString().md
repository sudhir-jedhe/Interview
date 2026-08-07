The **`toLocaleString()`** method returns a string representation of an object formatted according to a specific language, culture, and regional conventions (such as currency symbols, number separators, dates, and times).

It is overridden by **`Number`**, **`Date`**, **`Array`**, and **`BigInt`**.

---

## Standard Syntax

$$\text{value}\text{.toLocaleString([locales], [options])}$$

* **`locales`** *(Optional)*: A BCP 47 language tag string or array of tags (e.g., `"en-US"`, `"de-DE"`, `"hi-IN"`, `"ja-JP"`).
* **`options`** *(Optional)*: An object configuring formatting rules (e.g., currency, digit grouping, month formatting, time zone).

---

## 1. `Number.prototype.toLocaleString()`

Formats numbers for currency, percentages, units, or standard regional digit grouping.

### A. Formatting Currencies

```javascript
const price = 1234567.89;

// US Dollars
console.log(price.toLocaleString("en-US", { style: "currency", currency: "USD" }));
// Output: "$1,234,567.89"

// Euros (German formatting uses '.' for thousands and ',' for decimals)
console.log(price.toLocaleString("de-DE", { style: "currency", currency: "EUR" }));
// Output: "1.234.567,89 €"

// Indian Rupees (Uses lakh/crore grouping: 12,34,567.89)
console.log(price.toLocaleString("en-IN", { style: "currency", currency: "INR" }));
// Output: "₹12,34,567.89"

```

### B. Formatting Percentages & Units

```javascript
const ratio = 0.754;
console.log(ratio.toLocaleString("en-US", { style: "percent" }));
// Output: "75%"

const speed = 120;
console.log(speed.toLocaleString("en-US", { style: "unit", unit: "kilometer-per-hour" }));
// Output: "120 km/h"

```

### C. Controlling Significant Digits & Decimals

```javascript
const num = 12.34567;

console.log(num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
// Output: "12.35"

```

---

## 2. `Date.prototype.toLocaleString()`

Formats dates and times according to localized calendar formats and time zones.

### A. Full Date and Time Formatting

```javascript
const now = new Date("2026-08-07T15:30:00");

// US Format (MM/DD/YYYY)
console.log(now.toLocaleString("en-US"));
// Output: "8/7/2026, 3:30:00 PM"

// UK Format (DD/MM/YYYY)
console.log(now.toLocaleString("en-GB"));
// Output: "07/08/2026, 15:30:00"

// Japanese Format (YYYY/MM/DD)
console.log(now.toLocaleString("ja-JP"));
// Output: "2026/8/7 15:30:00"

```

### B. Customizing Date Components & Time Zones

```javascript
const event = new Date("2026-08-07T15:30:00Z");

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
  timeZone: "America/New_York"
};

console.log(event.toLocaleString("en-US", options));
// Output: "Friday, August 7, 2026 at 11:30 AM EDT"

```

---

## 3. `Array.prototype.toLocaleString()`

Calls `toLocaleString()` on **every element** inside the array and joins them into a single string using a localized separator (usually a comma).

```javascript
const prices = [1000, 25000, 500000];
const formattedPrices = prices.toLocaleString("en-US", { style: "currency", currency: "USD" });

console.log(formattedPrices);
// Output: "$1,000.00, $25,000.00, $500,000.00"

const mixedDates = [new Date("2026-01-01"), new Date("2026-12-31")];
console.log(mixedDates.toLocaleString("de-DE"));
// Output: "1.1.2026, 00:00:00, 31.12.2026, 00:00:00"

```

---

## 4. `BigInt.prototype.toLocaleString()`

Formats large `BigInt` values with regional digit separators.

```javascript
const hugeNumber = 900719925474099123456789n;

// US English
console.log(hugeNumber.toLocaleString("en-US"));
// Output: "900,719,925,474,099,123,456,789"

// German
console.log(hugeNumber.toLocaleString("de-DE"));
// Output: "900.719.925.474.099.123.456.789"

```

---

## Key Performance Tip (`Intl` Constructors)

If you are calling `toLocaleString()` thousands of times in a loop (e.g., formatting rows in a table), create an instance of `Intl.NumberFormat` or `Intl.DateTimeFormat` once and reuse it for significantly better performance:

```javascript
// Faster for repeated formatting
const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const items = [10, 20, 30];
const results = items.map(price => formatter.format(price));
console.log(results);
// Output: ["$10.00", "$20.00", "$30.00"]

```
