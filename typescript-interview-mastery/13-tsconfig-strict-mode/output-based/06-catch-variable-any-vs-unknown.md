```typescript
// tsconfig A: useUnknownInCatchVariables: false (legacy default)
// tsconfig B: useUnknownInCatchVariables: true (part of strict: true today)

function parse(json: string) {
  try {
    return JSON.parse(json);
  } catch (err) {
    console.log(err.message.toUpperCase());
  }
}
```

Under which tsconfig does this line fail to compile: `console.log(err.message.toUpperCase())`?

**Answer:** It fails to compile under tsconfig B (`useUnknownInCatchVariables: true`), with `'err' is of type 'unknown'`. Under tsconfig A it compiles without error.

**Why:** With `useUnknownInCatchVariables: false`, `catch` clause variables default to `any`, so `err.message.toUpperCase()` is accepted with no checking at all — even though JavaScript allows `throw`ing anything (a string, a plain object, `undefined`), not just `Error` instances, so `err.message` could easily be `undefined` at runtime if something throws a non-`Error` value, and this would crash with `Cannot read properties of undefined`. With `useUnknownInCatchVariables: true` (bundled into `strict: true`), `err` is typed as `unknown`, so no property access is allowed until you narrow it, e.g. `if (err instanceof Error) { console.log(err.message.toUpperCase()); }` — this forces the exact runtime check that would have prevented the crash.
