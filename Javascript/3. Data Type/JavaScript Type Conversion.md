Type conversion in JavaScript involves changing a value from one data type to another. This can be done **explicitly** using built-in methods/constructors or **implicitly** through operators.

Here are 3 concrete code examples for each type of conversion.

---

## 1. Converting Strings to Numbers

### A. Using `Number()`

Converts the full string to a number. Returns `NaN` if the string contains non-numeric characters.

```javascript
// Example 1: Standard numeric string
console.log(Number("123")); 
// Output: 123

// Example 2: Floating point string
console.log(Number("45.67")); 
// Output: 45.67

// Example 3: Non-numeric string yields NaN
console.log(Number("123abc")); 
// Output: NaN

```

### B. Using `parseInt()` and `parseFloat()`

Parses a string from left to right and stops at the first non-numeric character.

```javascript
// Example 1: parseInt extracts leading integers
console.log(parseInt("100px")); 
// Output: 100

// Example 2: parseFloat preserves decimal points
console.log(parseFloat("12.34em")); 
// Output: 12.34

// Example 3: parseInt with an explicit base (radix)
console.log(parseInt("1010", 2)); 
// Output: 10 (binary to decimal)

```

### C. Using the Unary Plus Operator (`+`)

A shorthand method to coerce a string into a number.

```javascript
// Example 1: Convert integer string
console.log(+"50"); 
// Output: 50

// Example 2: Convert float string
console.log(+"3.14"); 
// Output: 3.14

// Example 3: Empty string converts to 0
console.log(+""); 
// Output: 0

```

---

## 2. Converting Numbers to Strings

### A. Using `String()`

Safely converts any number (including `Infinity` and `NaN`) to a string.

```javascript
// Example 1: Standard number conversion
console.log(String(100)); 
// Output: "100"

// Example 2: Negative and decimal numbers
console.log(String(-45.6)); 
// Output: "-45.6"

// Example 3: Special numeric values
console.log(String(NaN)); 
// Output: "NaN"

```

### B. Using `.toString()`

Defined on numbers. Accepts an optional radix (base) parameter.

```javascript
// Example 1: Standard toString call
const num = 255;
console.log(num.toString()); 
// Output: "255"

// Example 2: Base 16 (Hexadecimal) conversion
console.log((255).toString(16)); 
// Output: "ff"

// Example 3: Base 2 (Binary) conversion
console.log((10).toString(2)); 
// Output: "1010"

```

### C. Using Template Literals or Concatenation

Implicitly converts a number to a string when combined with quotes or backticks.

```javascript
// Example 1: String concatenation (+)
console.log(42 + ""); 
// Output: "42"

// Example 2: Template literal interpolation
const count = 5;
console.log(`${count}`); 
// Output: "5"

// Example 3: Expression evaluation inside template literals
console.log(`Total: ${10 + 20}`); 
// Output: "Total: 30"

```

---

## 3. Converting Dates to Numbers

### A. Using `Number()` or `.getTime()`

Returns the Unix timestamp (milliseconds since January 1, 1970).

```javascript
// Example 1: Number() constructor
const d1 = new Date("2026-01-01");
console.log(Number(d1)); 
// Output: 1767225600000

// Example 2: .getTime() method
const d2 = new Date();
console.log(d2.getTime()); 
// Output: 1786115633000 (Current timestamp)

// Example 3: .valueOf() method
const d3 = new Date("2026-08-07");
console.log(d3.valueOf()); 
// Output: 1786060800000

```

### B. Using Unary Plus (`+`)

Shorthand method to fetch the Unix timestamp from a `Date` instance.

```javascript
// Example 1: Current timestamp
console.log(+new Date()); 
// Output: 1786115633000

// Example 2: Timestamp of a specific date
console.log(+new Date("2026-12-31")); 
// Output: 1803859200000

// Example 3: Calculating time difference in milliseconds
const start = +new Date("2026-01-01");
const end = +new Date("2026-01-02");
console.log(end - start); 
// Output: 86400000 (1 day in milliseconds)

```

### C. Using `Date.now()`

Returns the current timestamp directly as a number without instantiating a `new Date()` object.

```javascript
// Example 1: Direct timestamp generation
const timestamp = Date.now();
console.log(typeof timestamp); 
// Output: "number"

// Example 2: Measuring execution time
const t1 = Date.now();
// ... processing ...
const t2 = Date.now();
console.log(`Elapsed: ${t2 - t1}ms`);

// Example 3: Comparing timestamps
console.log(Date.now() > 1000000000000); 
// Output: true

```

---

## 4. Converting Numbers to Dates

### A. Passing Milliseconds to `new Date()`

Pass a Unix timestamp (number of milliseconds since Jan 1, 1970) to the constructor.

```javascript
// Example 1: Create Date from timestamp 0 (Epoch)
const epoch = new Date(0);
console.log(epoch.toUTCString()); 
// Output: "Thu, 01 Jan 1970 00:00:00 GMT"

// Example 2: Create Date from current timestamp
const nowNum = 1786115633000;
console.log(new Date(nowNum).getFullYear()); 
// Output: 2026

// Example 3: Restoring a serialized timestamp back to Date
const timestamp = 1767225600000;
const restoredDate = new Date(timestamp);
console.log(restoredDate.toISOString()); 
// Output: "2026-01-01T00:00:00.000Z"

```

### B. Passing Year, Month, Day as Individual Numeric Arguments

You can pass numbers representing parts of a date into `new Date(year, monthIndex, day, ...)`. Note that months are **0-indexed** (0 = January, 11 = December).

```javascript
// Example 1: Basic Year, Month (0-indexed), Day numbers
const date1 = new Date(2026, 7, 7); // August 7, 2026
console.log(date1.toDateString()); 
// Output: "Fri Aug 07 2026"

// Example 2: Adding time arguments (Hours, Minutes, Seconds)
const date2 = new Date(2026, 11, 31, 23, 59, 59);
console.log(date2.toLocaleString()); 
// Output: "12/31/2026, 11:59:59 PM"

// Example 3: Overflowing numbers automatically rolls over to the next month
const date3 = new Date(2026, 0, 32); // Jan 32 -> Feb 1
console.log(date3.toDateString()); 
// Output: "Sun Feb 01 2026"

```

### C. Mutating Existing Date with `.setTime()`

Updates an existing `Date` object using a numeric timestamp.

```javascript
// Example 1: Set time using timestamp
const d = new Date();
d.setTime(0);
console.log(d.getUTCFullYear()); 
// Output: 1970

// Example 2: Shift a date forward by adding milliseconds
const now = new Date();
now.setTime(now.getTime() + 3600000); // Add 1 hour (3,600,000 ms)
console.log(now > new Date()); 
// Output: true

// Example 3: Reset date via custom numeric calculation
const date = new Date("2026-01-01");
date.setTime(date.getTime() + 86400000 * 5); // Add 5 days
console.log(date.toISOString().split("T")[0]); 
// Output: "2026-01-06"

```

---

## 5. Converting Booleans to Numbers

### A. Using `Number()`

`true` converts to `1`, and `false` converts to `0`.

```javascript
// Example 1: Convert true
console.log(Number(true)); 
// Output: 1

// Example 2: Convert false
console.log(Number(false)); 
// Output: 0

// Example 3: Array mapping booleans to numbers
console.log([true, false, true].map(Number)); 
// Output: [1, 0, 1]

```

### B. Using Unary Plus (`+`)

Shorthand coercion converts boolean values into `1` or `0`.

```javascript
// Example 1: +true
console.log(+true); 
// Output: 1

// Example 2: +false
console.log(+false); 
// Output: 0

// Example 3: Adding coerced booleans
console.log(+true + +true + +false); 
// Output: 2

```

### C. Using Implicit Mathematical Operations

Arithmetic operators force boolean coercion into numbers.

```javascript
// Example 1: Multiplication
console.log(true * 5); 
// Output: 5

// Example 2: Addition
console.log(false + 10); 
// Output: 10

// Example 3: Subtracting booleans
console.log(true - false); 
// Output: 1

```

---

## 6. Converting Numbers to Booleans

### A. Using `Boolean()`

`0`, `-0`, `0n`, and `NaN` convert to `false`. All other numbers convert to `true`.

```javascript
// Example 1: Non-zero numbers are true
console.log(Boolean(100)); 
// Output: true

// Example 2: Zero is false
console.log(Boolean(0)); 
// Output: false

// Example 3: NaN is false
console.log(Boolean(NaN)); 
// Output: false

```

### B. Using Double Negation (`!!`)

Evaluates the logical truthiness of a number and coerces it to a boolean.

```javascript
// Example 1: Positive integer
console.log(!!42); 
// Output: true

// Example 2: Zero
console.log(!!0); 
// Output: false

// Example 3: Negative float
console.log(!!-3.14); 
// Output: true

```

### C. Implicit Boolean Coercion in Conditions

Numbers inside `if` or conditional expressions automatically coerce to booleans.

```javascript
// Example 1: Checking array length as a condition
const items = [1, 2, 3];
if (items.length) { // 3 coerces to true
  console.log("Array is not empty");
}

// Example 2: Zero in conditional
const count = 0;
if (!count) { // !0 -> !false -> true
  console.log("Count is zero");
}

// Example 3: Ternary expression with numeric condition
const status = 1 ? "Active" : "Inactive";
console.log(status); 
// Output: "Active"

```
