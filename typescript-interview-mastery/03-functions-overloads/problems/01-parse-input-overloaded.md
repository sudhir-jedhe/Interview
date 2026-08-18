# Problem: Overloaded `parseInput` returning a different shape per literal argument

## Problem statement

Implement `parseInput`, a function used to parse raw string input from a generic settings form. It must accept a `raw` string and a `type` literal (`"integer"`, `"boolean"`, or `"stringList"`), and return a precisely-typed result depending on which `type` literal was passed — no caller should need to narrow a union return type manually.

## Requirements

- `parseInput(raw: string, type: "integer")` returns `number`.
- `parseInput(raw: string, type: "boolean")` returns `boolean`.
- `parseInput(raw: string, type: "stringList")` returns `string[]` (comma-separated values, trimmed).
- Throws a descriptive `Error` for invalid input (e.g. a non-numeric string for `"integer"`).
- Must compile under `strict: true`, with a single implementation signature backing all overloads.

## Solution

```typescript
function parseInput(raw: string, type: "integer"): number;
function parseInput(raw: string, type: "boolean"): boolean;
function parseInput(raw: string, type: "stringList"): string[];
function parseInput(
  raw: string,
  type: "integer" | "boolean" | "stringList",
): number | boolean | string[] {
  switch (type) {
    case "integer": {
      const value = Number.parseInt(raw, 10);
      if (Number.isNaN(value)) {
        throw new Error(`"${raw}" is not a valid integer`);
      }
      return value;
    }
    case "boolean": {
      if (raw === "true") return true;
      if (raw === "false") return false;
      throw new Error(`"${raw}" is not a valid boolean ("true"/"false" expected)`);
    }
    case "stringList":
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
  }
}

const maxRetries = parseInput("5", "integer");            // number
const debugEnabled = parseInput("true", "boolean");         // boolean
const allowedDomains = parseInput("a.com, b.com", "stringList"); // string[]

console.log(maxRetries + 1);
console.log(debugEnabled && true);
console.log(allowedDomains.length);
```

### Why this is the correct approach

Each overload signature pins the return type to exactly what a caller passing that literal `type` argument should receive — `parseInput(raw, "integer")` is statically known to return `number`, with zero narrowing required at the call site, which a single signature like `parseInput(raw: string, type: string): number | boolean | string[]` could never provide (every caller would be stuck handling all three possible return types regardless of which `type` they actually passed). The `switch` inside the implementation signature is exhaustive over the three literals, and TypeScript's control-flow analysis inside each `case` narrows `raw`'s associated logic correctly, keeping the single implementation body both type-safe and DRY.
