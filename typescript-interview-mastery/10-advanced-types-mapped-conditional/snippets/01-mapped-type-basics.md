# Snippet: a basic mapped type turning every field nullable

```typescript
// Nullable<T> allows any field to also be explicitly null (distinct from optional).

interface Profile {
  bio: string;
  age: number;
}

type Nullable<T> = { [K in keyof T]: T[K] | null };

const profile: Nullable<Profile> = { bio: null, age: 30 };
```
