# Problem: Safely narrow `unknown` instead of using `any`

## Problem statement

Write a function `parseConfigValue` that accepts an `unknown` value (imagine it came from `JSON.parse` on a config file) and a `defaultValue`, and returns either the value — if it matches the same primitive type as `defaultValue` — or the `defaultValue` itself. The function must never use `any`, and must not throw for any input.

## Requirements

- Signature: `function parseConfigValue<T extends string | number | boolean>(value: unknown, defaultValue: T): T`
- If `value`'s runtime type (`typeof`) matches `typeof defaultValue`, return `value` cast to `T`.
- Otherwise, return `defaultValue`.
- No use of `any` anywhere in the implementation.
- Must compile under `strict: true`.

## Solution

```typescript
function parseConfigValue<T extends string | number | boolean>(
  value: unknown,
  defaultValue: T,
): T {
  if (typeof value === typeof defaultValue) {
    // `typeof value === typeof defaultValue` proves `value` shares defaultValue's
    // primitive kind, but TS can't narrow `value: unknown` to `T` from a dynamic
    // `typeof defaultValue` comparison alone — an explicit (but type-safe-in-intent) cast is needed.
    return value as T;
  }
  return defaultValue;
}

// Usage
const port = parseConfigValue(JSON.parse('"8080"'), 3000);       // typeof mismatch -> 3000
const retries = parseConfigValue(JSON.parse("5"), 3);              // typeof match -> 5
const debugFlag = parseConfigValue(JSON.parse("true"), false);     // typeof match -> true

console.log(port, retries, debugFlag); // 3000 5 true
```

### Why this is the correct approach

The naive version of this helper would type `value` as `any` and skip the `typeof` check entirely, silently accepting a mismatched type (e.g. returning the string `"8080"` where a `number` port was expected, which breaks arithmetic downstream). By typing `value: unknown` and requiring a runtime `typeof` check before any cast, the function forces every call site to go through validated, type-safe logic — the only remaining cast (`value as T`) is a narrow, deliberate escape hatch used *after* the runtime check has already proven safety, not a blanket bypass of the type system. This mirrors the real pattern used in production config-loading and API-response-parsing code.
