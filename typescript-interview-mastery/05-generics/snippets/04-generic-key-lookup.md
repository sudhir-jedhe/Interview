# Type-safe property lookup with keyof

```typescript
// K is constrained to the actual keys of T
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const settings = { theme: "dark", fontSize: 14, autoSave: true };

const theme = get(settings, "theme");       // string (property widened, no `as const`)
const fontSize = get(settings, "fontSize"); // number

console.log(theme, fontSize);
```
