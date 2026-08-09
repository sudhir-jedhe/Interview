**Lifting state up** is a fundamental React pattern used when two or more sibling components need to share the same changing data.

Instead of trying to sync state between sibling components directly, you move (lift) the shared state up to their **closest common parent**. The parent then passes the state down to the siblings as **props**, along with callback functions so the siblings can request state updates.

---

## The Problem (Unsynced Sibling Components)

Imagine a temperature converter with two input boxes: **Celsius** and **Fahrenheit**. If each input keeps its own local state, they will quickly get out of sync.

```
❌ BAD: Each sibling holds local state independently (Unsynced)

          ┌───────────────────────┐
          │   Converter Parent    │
          └───────────────────────┘
             │                 │
             ▼                 ▼
   ┌──────────────────┐ ┌────────────────────┐
   │  Celsius Input   │ │  Fahrenheit Input  │
   │ [State: temp="0"]│ │ [State: temp="32"] │
   └──────────────────┘ └────────────────────┘

```

---

## The Solution (Lifting State Up)

Move the `temperature` and `scale` state up into the parent component.

```
✅ GOOD: State lives in the shared parent and flows down as props

          ┌────────────────────────────────┐
          │        Converter Parent        │
          │ [State: temperature, scale]    │
          └────────────────────────────────┘
             │                          │
   props:    │ temperature              │ temperature
   callback: │ onTemperatureChange      │ onTemperatureChange
             ▼                          ▼
   ┌──────────────────┐        ┌────────────────────┐
   │  Celsius Input   │        │  Fahrenheit Input  │
   └──────────────────┘        └────────────────────┘

```

---

## Practical Code Example: Temperature Converter

### Step 1: Conversion Helper Functions

```typescript
// utils/temperature.ts

export function toCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function tryConvert(temperature: string, convertFunc: (input: number) => number): string {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convertFunc(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

```

### Step 2: Child Input Component (Stateless / Controlled)

This child component accepts its current value and an `onChange` callback via **props**. It doesn't hold any local state.

```tsx
// components/TemperatureInput.tsx
import React from 'react';

interface TemperatureInputProps {
  scale: 'c' | 'f';
  temperature: string;
  onTemperatureChange: (value: string) => void;
}

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit',
};

export function TemperatureInput({
  scale,
  temperature,
  onTemperatureChange,
}: TemperatureInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Notify parent about the change
    onTemperatureChange(e.target.value);
  };

  return (
    <fieldset style={{ margin: '10px 0', padding: '16px', borderRadius: '8px' }}>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        type="number"
        value={temperature}
        onChange={handleChange}
        placeholder={`e.g. ${scale === 'c' ? '100' : '212'}`}
        style={{ padding: '8px', fontSize: '16px' }}
      />
    </fieldset>
  );
}

```

### Step 3: Parent Calculator Component (State Owner)

The parent maintains the single source of truth for the temperature and scale. It calculates the values for both children on the fly during rendering.

```tsx
// components/Calculator.tsx
import React, { useState } from 'react';
import { TemperatureInput } from './TemperatureInput';
import { toCelsius, toFahrenheit, tryConvert } from '../utils/temperature';

export function Calculator() {
  // 1. LIFTED STATE: Held in the common parent
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState<'c' | 'f'>('c');

  // 2. Callbacks passed to children to update parent state
  const handleCelsiusChange = (value: string) => {
    setScale('c');
    setTemperature(value);
  };

  const handleFahrenheitChange = (value: string) => {
    setScale('f');
    setTemperature(value);
  };

  // 3. Derived Values (calculated dynamically based on current scale)
  const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

  return (
    <div style={{ maxWidth: '400px', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Temperature Converter</h2>

      {/* Celsius Child Input */}
      <TemperatureInput
        scale="c"
        temperature={celsius}
        onTemperatureChange={handleCelsiusChange}
      />

      {/* Fahrenheit Child Input */}
      <TemperatureInput
        scale="f"
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />

      {/* Optional feedback derived from state */}
      <BoilingVerdict celsius={parseFloat(celsius)} />
    </div>
  );
}

function BoilingVerdict({ celsius }: { celsius: number }) {
  if (Number.isNaN(celsius)) return null;
  if (celsius >= 100) {
    return <p style={{ color: 'green', fontWeight: 'bold' }}>The water would boil.</p>;
  }
  return <p style={{ color: '#555' }}>The water would not boil.</p>;
}

```

---

## Key Benefits of Lifting State Up

1. **Single Source of Truth:** State lives in one place, avoiding data desynchronization bugs.
2. **Controlled Components:** Child components become predictable, purely presentation-focused views that render whatever their parent tells them to render.
3. **Derived Values over Duplicate State:** Instead of keeping both `celsius` and `fahrenheit` in state separately, you store only the raw input (`temperature` + `scale`) and compute the other value dynamically during render.
