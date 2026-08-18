```typescript
interface Settings {
  theme: string;
  fontSize?: number;
}

type FlippedOptionality<T> = {
  [K in keyof T]-?: T[K];
};

type Result = FlippedOptionality<Settings>;

const s1: Result = { theme: "dark" }; // (1)
const s2: Result = { theme: "dark", fontSize: 12 }; // (2)
```

**Answer:** Line (1) fails to compile: `Property 'fontSize' is missing in type '{ theme: string; }' but required in type 'Result'`. Line (2) compiles fine.

**Why:** `-?` strips the optional modifier from every key, so `Result` becomes `{ theme: string; fontSize: number }` — both fields are now required, including `fontSize`, which was optional on `Settings`. This is a common trap when someone assumes a mapped type only ever *adds* flexibility; `-?` and `-readonly` are explicitly designed to remove modifiers the source type already had, tightening rather than loosening the shape.
