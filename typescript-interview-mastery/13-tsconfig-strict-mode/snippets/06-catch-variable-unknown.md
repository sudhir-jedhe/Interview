# useUnknownInCatchVariables forcing a narrowing check

```typescript
try {
  JSON.parse("{ invalid json");
} catch (err) {
  // err is `unknown`, not `any` -- must narrow before use
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error("Unknown error", err);
  }
}
```
