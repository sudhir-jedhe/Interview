For this challenge, only **two things matter**:

1. `getDigits()` returns a **6-digit array** in `HHMMSS` format.
2. The clock updates every second using `setInterval`.

---

## `getDigits()` Implementation

```tsx
export function getDigits(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}${minutes}${seconds}`.split("").map(Number);
}
```

### Examples

```js
getDigits(new Date("2025-01-01T09:05:07"));

// [0,9,0,5,0,7]
```

```js
getDigits(new Date("2025-01-01T23:59:58"));

// [2,3,5,9,5,8]
```

✅ Always returns exactly:

```text
[H,H,M,M,S,S]
```

✅ Length = 6

---

## Clock Component

```tsx
import { useEffect, useState } from "react";

import { SevenSegmentDigit, Colon } from "./Components";

import { getDigits } from "./utils";

export default function DigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const digits = getDigits(now);

  return (
    <div>
      <h1>Digital Segment Clock</h1>

      <div className="clock">
        <SevenSegmentDigit digit={digits[0]} />
        <SevenSegmentDigit digit={digits[1]} />

        <Colon />

        <SevenSegmentDigit digit={digits[2]} />
        <SevenSegmentDigit digit={digits[3]} />

        <Colon />

        <SevenSegmentDigit digit={digits[4]} />
        <SevenSegmentDigit digit={digits[5]} />
      </div>
    </div>
  );
}
```

---

## Why This Passes Test 13

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setNow(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

Every second:

```text
state updates
↓
component rerenders
↓
new digits calculated
↓
clock changes
```

✅ `updates the clock digits every second`

---

## Why This Passes Test 14

```tsx
return `${hours}${minutes}${seconds}`.split("").map(Number);
```

Always returns:

```text
6 digits
```

Examples:

```text
09:05:07
→ [0,9,0,5,0,7]

14:32:50
→ [1,4,3,2,5,0]
```

✅ `checks getDigits return 6 digits array`

---

### Senior Interview Note

A subtle bug many candidates make is returning:

```js
[hours, minutes, seconds];
```

which yields:

```js
["09", "05", "07"];
```

(length 3)

instead of:

```js
[0, 9, 0, 5, 0, 7];
```

(length 6), which is what seven-segment displays typically require.
