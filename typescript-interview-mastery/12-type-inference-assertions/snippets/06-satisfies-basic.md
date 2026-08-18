# `satisfies` keeping literal types while validating shape

```typescript
// Snippet: satisfies validates against Record<string, number> but keeps keys/values literal
const scoreWeights = {
  accuracy: 0.6,
  speed: 0.3,
  style: 0.1,
} satisfies Record<string, number>;

// scoreWeights.accuracy is typed as 0.6, not just `number`
const total = scoreWeights.accuracy + scoreWeights.speed + scoreWeights.style;
```
