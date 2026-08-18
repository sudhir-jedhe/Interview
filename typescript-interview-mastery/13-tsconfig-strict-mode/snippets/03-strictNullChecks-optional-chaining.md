# strictNullChecks forcing an explicit optional-chain

```typescript
interface Profile {
  bio?: string;
}

function bioLength(profile: Profile): number {
  // Under strictNullChecks, profile.bio is `string | undefined`,
  // so .length can't be accessed without narrowing first.
  return profile.bio?.length ?? 0;
}
```
