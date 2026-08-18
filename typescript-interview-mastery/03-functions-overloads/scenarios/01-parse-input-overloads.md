# Scenario: A `parseInput` function whose return shape depends on a mode argument

You're writing a form-input parser used across a codebase. Callers pass a `mode` literal (`"number"`, `"date"`, or `"json"`) along with a raw string, and expect a precisely-typed return value matching that mode — a `number` for `"number"` mode, a `Date` for `"date"` mode, and `unknown` for `"json"` mode (since arbitrary JSON shape can't be known generically). A single union return type would force every caller to narrow the result themselves, which is exactly what overloads exist to avoid.

**Approach:** Declare one overload per `mode` literal, each pinning down the exact return type for that mode, backed by a single wide implementation signature that dispatches on the runtime value of `mode`.

```typescript
function parseInput(raw: string, mode: "number"): number;
function parseInput(raw: string, mode: "date"): Date;
function parseInput(raw: string, mode: "json"): unknown;
function parseInput(raw: string, mode: "number" | "date" | "json"): number | Date | unknown {
  switch (mode) {
    case "number": {
      const value = Number(raw);
      if (Number.isNaN(value)) throw new Error(`"${raw}" is not a valid number`);
      return value;
    }
    case "date": {
      const value = new Date(raw);
      if (Number.isNaN(value.getTime())) throw new Error(`"${raw}" is not a valid date`);
      return value;
    }
    case "json":
      return JSON.parse(raw);
  }
}

const age = parseInput("30", "number");          // typed number — no narrowing needed
const signupDate = parseInput("2026-01-15", "date"); // typed Date
const payload = parseInput('{"a":1}', "json");     // typed unknown — caller must still narrow

console.log(age + 1);
console.log(signupDate.getFullYear());
```

Callers of `parseInput(raw, "number")` get a genuine `number` back with zero extra narrowing — the overload set does the work of "pick the right return type for this exact call shape" at the type level, which a single signature like `function parseInput(raw: string, mode: string): number | Date | unknown` could never provide, since that signature would force every caller to narrow the result regardless of which literal `mode` they passed, even when the call site obviously determines the exact type.
