# Return type inferred from multiple return statements

```typescript
// Snippet: inferred return union from branch analysis, no annotation needed
function classify(n: number) {
  if (n < 0) return "negative" as const;
  if (n === 0) return "zero" as const;
  return "positive" as const;
}
// inferred return type: "negative" | "zero" | "positive"

const result = classify(-5); // result: "negative" | "zero" | "positive"
```
