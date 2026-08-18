# Snippet: a minimal namespace grouping related helpers

```typescript
// Legacy-style organization — shown for recognition, not recommended for new code.

namespace StringUtils {
  export function truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? value.slice(0, maxLength) + "…" : value;
  }

  export function slugify(value: string): string {
    return value.toLowerCase().replace(/\s+/g, "-");
  }
}

console.log(StringUtils.truncate("A very long headline here", 10)); // "A very lon…"
console.log(StringUtils.slugify("Hello World"));                     // "hello-world"
```
