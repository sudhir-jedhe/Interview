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

Here is a clean, modern, and zero-dependency **7-Segment Display** React component. It uses SVG for scalable rendering, supports customizable LED colors, allows both single-character digits and multi-digit strings (numbers, minus signs, spaces, decimals), and includes an optional "dim segments" background effect typical of real hardware displays.

---

### 1. Single Digit 7-Segment SVG Component

This component draws a single character using SVG path segments.

```tsx
import React from 'react';

// Maps characters to standard 7-segment LED states [a, b, c, d, e, f, g]
const SEGMENT_MAP: Record<string, boolean[]> = {
  '0': [true, true, true, true, true, true, false],
  '1': [false, true, true, false, false, false, false],
  '2': [true, true, false, true, true, false, true],
  '3': [true, true, true, true, false, false, true],
  '4': [false, true, true, false, false, true, true],
  '5': [true, false, true, true, false, true, true],
  '6': [true, false, true, true, true, true, true],
  '7': [true, true, true, false, false, false, false],
  '8': [true, true, true, true, true, true, true],
  '9': [true, true, true, true, false, true, true],
  '-': [false, false, false, false, false, false, true],
  'A': [true, true, true, false, true, true, true],
  'B': [false, false, true, true, true, true, true],
  'C': [true, false, false, true, true, true, false],
  'D': [false, true, true, true, true, false, true],
  'E': [true, false, false, true, true, true, true],
  'F': [true, false, false, false, true, true, true],
  ' ': [false, false, false, false, false, false, false],
};

interface SevenSegmentDigitProps {
  char?: string;
  hasDecimal?: boolean;
  color?: string;
  offColor?: string;
  height?: number;
}

export const SevenSegmentDigit: React.FC<SevenSegmentDigitProps> = ({
  char = ' ',
  hasDecimal = false,
  color = '#ef4444', // Active Segment LED Color (Red)
  offColor = '#1f2937', // Dimmed Inactive Segment Color
  height = 80,
}) => {
  const activeSegments = SEGMENT_MAP[char.toUpperCase()] || SEGMENT_MAP[' '];

  // SVG Coordinates for 7 Segments (a-g) on a 60x100 ViewBox
  const segmentPaths = [
    'M 12 10 L 18 4 L 42 4 L 48 10 L 42 16 L 18 16 Z', // a (Top)
    'M 50 12 L 56 18 L 56 42 L 50 48 L 44 42 L 44 18 Z', // b (Top Right)
    'M 50 52 L 56 58 L 56 82 L 50 88 L 44 82 L 44 58 Z', // c (Bottom Right)
    'M 12 90 L 18 84 L 42 84 L 48 90 L 42 96 L 18 96 Z', // d (Bottom)
    'M 10 52 L 16 58 L 16 82 L 10 88 L 4 82 L 4 58 Z', // e (Bottom Left)
    'M 10 12 L 16 18 L 16 42 L 10 48 L 4 42 L 4 18 Z', // f (Top Left)
    'M 12 50 L 18 44 L 42 44 L 48 50 L 42 56 L 18 56 Z', // g (Middle)
  ];

  return (
    <svg
      height={height}
      viewBox="0 0 68 100"
      style={{ display: 'inline-block', filter: `drop-shadow(0px 0px 4px ${color}80)` }}
    >
      {segmentPaths.map((path, idx) => (
        <path
          key={idx}
          d={path}
          fill={activeSegments[idx] ? color : offColor}
          style={{ transition: 'fill 0.15s ease-in-out' }}
        />
      ))}
      {/* Decimal Point Dot */}
      <circle
        cx="62"
        cy="92"
        r="4"
        fill={hasDecimal ? color : offColor}
        style={{ transition: 'fill 0.15s ease-in-out' }}
      />
    </svg>
  );
};

```

---

### 2. Multi-Digit Display Wrapper

This wrapper takes any string or number (e.g. `"12.34"`, `"-99"`, `"8888"`) and pads it with inactive lead digits to mimic a real digital clock, odometer, or multimeter display.

```tsx
interface SevenSegmentDisplayProps {
  value: string | number;
  digits?: number; // Total number of digit positions
  color?: string;
  offColor?: string;
  height?: number;
}

export const SevenSegmentDisplay: React.FC<SevenSegmentDisplayProps> = ({
  value,
  digits = 4,
  color = '#22c55e', // Green LED default
  offColor = '#142918', // Dark Green dimmed background
  height = 80,
}) => {
  const strVal = String(value);

  // Parse digits and decimals
  const parsedDigits: { char: string; hasDecimal: boolean }[] = [];
  for (let i = 0; i < strVal.length; i++) {
    const char = strVal[i];
    if (char === '.') {
      if (parsedDigits.length > 0) {
        parsedDigits[parsedDigits.length - 1].hasDecimal = true;
      }
    } else {
      parsedDigits.push({ char, hasDecimal: false });
    }
  }

  // Pad left with empty spaces if value string is shorter than required digits
  while (parsedDigits.length < digits) {
    parsedDigits.unshift({ char: ' ', hasDecimal: false });
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '12px 16px',
        backgroundColor: '#000000',
        borderRadius: '8px',
        border: '2px solid #333333',
        gap: '4px',
      }}
    >
      {parsedDigits.slice(0, digits).map((item, index) => (
        <SevenSegmentDigit
          key={index}
          char={item.char}
          hasDecimal={item.hasDecimal}
          color={color}
          offColor={offColor}
          height={height}
        />
      ))}
    </div>
  );
};

```

---

### 3. Example Usage Demo (Clock & Counter)

Here is how you can use it in a real-world React dashboard or application:

```tsx
import React, { useState, useEffect } from 'react';
import { SevenSegmentDisplay } from './SevenSegmentDisplay';

export default function App() {
  const [count, setCount] = useState(0);
  const [timeStr, setTimeStr] = useState('');

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hrs}.${mins}.${secs}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h2>7-Segment Display Components</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>
        {/* 1. Counter Display */}
        <div>
          <h3>Red LED Counter</h3>
          <SevenSegmentDisplay value={count} digits={4} color="#ef4444" offColor="#261010" height={70} />
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => setCount(c => c - 1)} style={btnStyle}>- Increment</button>
            <button onClick={() => setCount(c => c + 1)} style={btnStyle}>+ Increment</button>
          </div>
        </div>

        {/* 2. Digital Clock with Decimals */}
        <div>
          <h3>Blue LED Digital Clock</h3>
          <SevenSegmentDisplay value={timeStr} digits={6} color="#3b82f6" offColor="#0f172a" height={80} />
        </div>

        {/* 3. Decimal / Sensor Value */}
        <div>
          <h3>Amber LED Multimeter Reading</h3>
          <SevenSegmentDisplay value={37.4} digits={4} color="#f59e0b" offColor="#261a0c" height={60} />
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '8px 16px',
  marginRight: '8px',
  fontSize: '14px',
  cursor: 'pointer',
};

```

---

### Features & Customization

* **Scalable SVG Rendering:** Adjust the `height` prop to scale the display without pixelation.
* **Custom LED Colors:** Pass any CSS hex/RGB color string for `color` and `offColor` (e.g. Red, Green, Blue, Amber, Cyan).
* **Supports Decimals:** Automatically detects `.` in string values and lights up the decimal dot on the preceding digit.
* **Supported Characters:** Supports numbers `0-9`, letters `A-F`, hyphens `-`, and spaces `' '`.
